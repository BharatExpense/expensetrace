import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { PortfolioAnalysis } from '@/types/portfolio';

interface BenchmarkComparisonProps {
  analysis: PortfolioAnalysis;
}

const BENCHMARKS = [
  { id: 'sp500', name: 'S&P 500', annualReturn: 0.105, volatility: 15.5, color: 'hsl(220, 70%, 50%)' },
  { id: 'nasdaq', name: 'NASDAQ 100', annualReturn: 0.135, volatility: 20.1, color: 'hsl(280, 60%, 55%)' },
  { id: 'nifty50', name: 'Nifty 50', annualReturn: 0.12, volatility: 17.8, color: 'hsl(30, 80%, 50%)' },
];

export const BenchmarkComparison = ({ analysis }: BenchmarkComparisonProps) => {
  const { totalValue, volatilityEstimate, totalReturnPercent } = analysis;

  const chartData = useMemo(() => {
    if (totalValue === 0) return [];
    const months = 12;
    const portfolioMonthlyReturn = 0.10 / 12;
    const portfolioMonthlyVol = (volatilityEstimate / 100) / Math.sqrt(12);

    const data = [];
    let portfolioVal = 100;
    const benchmarkVals = BENCHMARKS.map(() => 100);

    for (let i = 0; i <= months; i++) {
      const point: Record<string, number | string> = { month: i === 0 ? 'Now' : `M${i}` };
      point.portfolio = Math.round(portfolioVal * 100) / 100;
      BENCHMARKS.forEach((b, idx) => {
        point[b.id] = Math.round(benchmarkVals[idx] * 100) / 100;
      });
      data.push(point);

      if (i < months) {
        portfolioVal *= (1 + portfolioMonthlyReturn);
        BENCHMARKS.forEach((b, idx) => {
          benchmarkVals[idx] *= (1 + b.annualReturn / 12);
        });
      }
    }
    return data;
  }, [totalValue, volatilityEstimate]);

  if (totalValue === 0) {
    return (
      <Card className="glass-card-elevated">
        <CardHeader className="pb-3">
          <CardTitle className="section-header text-base sm:text-lg">
            <div className="p-1.5 rounded-lg bg-primary/10"><BarChart3 className="h-4 w-4 text-primary" /></div>
            Benchmark Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">Add holdings to compare against benchmarks</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card-elevated">
      <CardHeader className="pb-3">
        <CardTitle className="section-header text-base sm:text-lg">
          <div className="p-1.5 rounded-lg bg-primary/10"><BarChart3 className="h-4 w-4 text-primary" /></div>
          Benchmark Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Comparison Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-[10px] text-muted-foreground mb-1">Your Portfolio</p>
            <div className={`flex items-center gap-1 ${totalReturnPercent >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {totalReturnPercent >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span className="text-sm font-bold tabular-nums">{totalReturnPercent >= 0 ? '+' : ''}{totalReturnPercent.toFixed(1)}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Vol: {volatilityEstimate.toFixed(1)}%</p>
          </div>
          {BENCHMARKS.map((b) => {
            const outperforms = totalReturnPercent > b.annualReturn * 100;
            return (
              <div key={b.id} className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-[10px] text-muted-foreground mb-1">{b.name}</p>
                <span className="text-sm font-bold tabular-nums text-foreground">+{(b.annualReturn * 100).toFixed(1)}%</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <p className="text-[10px] text-muted-foreground">Vol: {b.volatility}%</p>
                  {totalValue > 0 && (
                    <Badge variant={outperforms ? 'default' : 'secondary'} className="text-[9px] px-1 py-0 h-4">
                      {outperforms ? 'Beating' : 'Trailing'}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                formatter={(v: number, name: string) => {
                  const label = name === 'portfolio' ? 'Your Portfolio' : BENCHMARKS.find(b => b.id === name)?.name || name;
                  return [`${v.toFixed(1)}`, label];
                }}
              />
              <Line type="monotone" dataKey="portfolio" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} name="portfolio" />
              {BENCHMARKS.map((b) => (
                <Line key={b.id} type="monotone" dataKey={b.id} stroke={b.color} strokeWidth={1.5} strokeDasharray="5 3" dot={false} name={b.id} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-primary rounded" /> Your Portfolio
          </span>
          {BENCHMARKS.map((b) => (
            <span key={b.id} className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 rounded" style={{ borderTop: `2px dashed ${b.color}` }} /> {b.name}
            </span>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Projected 12-month comparison using historical average returns. Normalized to 100 at start. For illustration only.
        </p>
      </CardContent>
    </Card>
  );
};
