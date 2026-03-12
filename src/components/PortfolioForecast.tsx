import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { PortfolioAnalysis } from '@/types/portfolio';

interface PortfolioForecastProps {
  analysis: PortfolioAnalysis;
}

export const PortfolioForecast = ({ analysis }: PortfolioForecastProps) => {
  const { totalValue, volatilityEstimate } = analysis;
  if (totalValue === 0) {
    return (
      <Card className="glass-card-elevated">
        <CardHeader className="pb-3">
          <CardTitle className="section-header text-base sm:text-lg">
            <div className="p-1.5 rounded-lg bg-primary/10"><TrendingUp className="h-4 w-4 text-primary" /></div>
            12-Month Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">Add holdings to see forecast</p>
        </CardContent>
      </Card>
    );
  }

  // Monte Carlo-ish projection (simplified)
  const months = 12;
  const annualReturn = 0.10; // assume 10% expected return
  const monthlyReturn = annualReturn / 12;
  const monthlyVol = (volatilityEstimate / 100) / Math.sqrt(12);

  const data = [];
  let base = totalValue;
  let optimistic = totalValue;
  let pessimistic = totalValue;

  for (let i = 0; i <= months; i++) {
    const monthLabel = i === 0 ? 'Now' : `M${i}`;
    data.push({
      month: monthLabel,
      base: Math.round(base),
      optimistic: Math.round(optimistic),
      pessimistic: Math.round(pessimistic),
    });
    base *= (1 + monthlyReturn);
    optimistic *= (1 + monthlyReturn + monthlyVol * 1.5);
    pessimistic *= (1 + monthlyReturn - monthlyVol * 1.5);
  }

  return (
    <Card className="glass-card-elevated">
      <CardHeader className="pb-3">
        <CardTitle className="section-header text-base sm:text-lg">
          <div className="p-1.5 rounded-lg bg-primary/10"><TrendingUp className="h-4 w-4 text-primary" /></div>
          12-Month Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 55%, 40%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(160, 55%, 40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: number) => [`$${v.toLocaleString()}`, '']}
                contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
              />
              <Area type="monotone" dataKey="optimistic" stroke="hsl(160, 55%, 40%)" fill="url(#optGrad)" strokeWidth={1.5} strokeDasharray="4 4" name="Optimistic" />
              <Area type="monotone" dataKey="base" stroke="hsl(var(--primary))" fill="url(#optGrad)" strokeWidth={2.5} name="Expected" />
              <Area type="monotone" dataKey="pessimistic" stroke="hsl(var(--destructive))" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" name="Pessimistic" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-primary rounded" /> Expected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-primary/50 rounded border-dashed" style={{ borderTop: '2px dashed hsl(160, 55%, 40%)' }} /> Optimistic
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 rounded" style={{ borderTop: '2px dashed hsl(var(--destructive))' }} /> Pessimistic
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Based on {volatilityEstimate.toFixed(1)}% annualized volatility and 10% expected market return. For illustration only.
        </p>
      </CardContent>
    </Card>
  );
};
