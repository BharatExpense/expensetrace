import { TrendingUp, TrendingDown, Shield, Activity, PieChart, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PortfolioAnalysis } from '@/types/portfolio';

interface PortfolioOverviewProps {
  analysis: PortfolioAnalysis;
}

const ScoreGauge = ({ value, label, icon: Icon, color }: { value: number; label: string; icon: any; color: string }) => (
  <Card className="glass-card p-4 sm:p-5 hover-lift">
    <CardContent className="p-0 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <span className="text-lg sm:text-xl font-bold text-foreground tabular-nums">{Math.round(value)}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.min(value, 100)}%`,
            background: value > 70 ? 'hsl(var(--destructive))' : value > 40 ? 'hsl(var(--warning))' : 'hsl(var(--primary))',
          }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">
        {value > 70 ? 'High' : value > 40 ? 'Moderate' : 'Low'} — {
          label === 'Risk Score' ? (value > 70 ? 'Consider reducing exposure' : value > 40 ? 'Balanced risk level' : 'Conservative portfolio') :
          label === 'Diversification' ? (value > 70 ? 'Well diversified' : value > 40 ? 'Could improve' : 'Highly concentrated') :
          'Monitor closely'
        }
      </p>
    </CardContent>
  </Card>
);

export const PortfolioOverview = ({ analysis }: PortfolioOverviewProps) => {
  const { totalValue, totalInvested, totalReturn, totalReturnPercent, diversificationScore, riskScore, volatilityEstimate, concentrationRisk } = analysis;
  const isPositive = totalReturn >= 0;

  return (
    <div className="space-y-4">
      {/* Value Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="glass-card-elevated p-4 sm:p-5">
          <CardContent className="p-0">
            <p className="text-xs text-muted-foreground mb-1">Portfolio Value</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
              ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card-elevated p-4 sm:p-5">
          <CardContent className="p-0">
            <p className="text-xs text-muted-foreground mb-1">Total Invested</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
              ${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card-elevated p-4 sm:p-5">
          <CardContent className="p-0">
            <p className="text-xs text-muted-foreground mb-1">Total Return</p>
            <div className={`flex items-center gap-1.5 ${isPositive ? 'text-primary' : 'text-destructive'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <p className="text-xl sm:text-2xl font-bold tabular-nums">
                {isPositive ? '+' : ''}${totalReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <p className={`text-xs font-medium mt-0.5 ${isPositive ? 'text-primary' : 'text-destructive'}`}>
              {isPositive ? '+' : ''}{totalReturnPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card-elevated p-4 sm:p-5">
          <CardContent className="p-0">
            <p className="text-xs text-muted-foreground mb-1">Est. Volatility</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
              {volatilityEstimate.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">annualized</p>
          </CardContent>
        </Card>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <ScoreGauge value={riskScore} label="Risk Score" icon={AlertTriangle} color="bg-destructive/10 text-destructive" />
        <ScoreGauge value={diversificationScore} label="Diversification" icon={PieChart} color="bg-primary/10 text-primary" />
        <ScoreGauge value={concentrationRisk} label="Concentration" icon={Activity} color="bg-warning/10 text-warning" />
      </div>
    </div>
  );
};
