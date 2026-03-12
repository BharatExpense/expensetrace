import { useMemo } from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PortfolioAnalysis, PortfolioHolding, MarketData } from '@/types/portfolio';

interface AIInsightsPanelProps {
  holdings: PortfolioHolding[];
  analysis: PortfolioAnalysis;
  marketDataMap: Record<string, MarketData>;
}

interface Insight {
  type: 'warning' | 'suggestion' | 'positive' | 'info';
  title: string;
  description: string;
  icon: any;
}

export const AIInsightsPanel = ({ holdings, analysis, marketDataMap }: AIInsightsPanelProps) => {
  const insights = useMemo<Insight[]>(() => {
    const result: Insight[] = [];
    if (holdings.length === 0) return result;

    const { sectorExposure, holdingWeights, riskScore, diversificationScore, concentrationRisk, volatilityEstimate } = analysis;

    // Concentration warnings
    const topHolding = holdingWeights[0];
    if (topHolding && topHolding.weight > 30) {
      result.push({
        type: 'warning',
        title: 'High Concentration Risk',
        description: `${topHolding.name} (${topHolding.ticker}) represents ${topHolding.weight.toFixed(1)}% of your portfolio. Consider reducing to below 20% to minimize single-stock risk.`,
        icon: AlertTriangle,
      });
    }

    // Sector concentration
    const topSector = Object.entries(sectorExposure).sort((a, b) => b[1] - a[1])[0];
    if (topSector && topSector[1] > 40) {
      const otherSectors = ['Healthcare', 'Consumer Staples', 'Utilities', 'ETF/Index'].filter(s => !sectorExposure[s] || sectorExposure[s] < 10);
      result.push({
        type: 'warning',
        title: 'Sector Overexposure',
        description: `Your portfolio is ${topSector[1].toFixed(0)}% concentrated in ${topSector[0]}. This increases volatility risk. Diversifying into ${otherSectors.slice(0, 2).join(' or ')} may reduce risk.`,
        icon: AlertTriangle,
      });
    }

    // Risk level
    if (riskScore > 60) {
      result.push({
        type: 'warning',
        title: 'Elevated Portfolio Risk',
        description: `Your risk score is ${riskScore}/100. Consider adding low-beta defensive stocks or index ETFs (like VTI or SPY) to stabilize returns.`,
        icon: Shield,
      });
    } else if (riskScore < 30) {
      result.push({
        type: 'positive',
        title: 'Conservative Portfolio',
        description: `Your risk score is ${riskScore}/100, indicating a conservative profile. Your portfolio should perform well during market downturns.`,
        icon: Shield,
      });
    }

    // Diversification
    if (diversificationScore > 70) {
      result.push({
        type: 'positive',
        title: 'Well Diversified',
        description: `Diversification score of ${diversificationScore}/100. Your portfolio spans ${Object.keys(sectorExposure).length} sectors with balanced allocation.`,
        icon: TrendingUp,
      });
    } else if (diversificationScore < 40) {
      result.push({
        type: 'suggestion',
        title: 'Improve Diversification',
        description: `Score of ${diversificationScore}/100. Adding stocks from underrepresented sectors or broad-market ETFs would improve risk-adjusted returns.`,
        icon: Lightbulb,
      });
    }

    // High beta holdings
    const highBetaHoldings = holdings.filter(h => {
      const md = marketDataMap[h.ticker.toUpperCase()];
      return md && md.beta > 1.5;
    });
    if (highBetaHoldings.length > 0) {
      result.push({
        type: 'info',
        title: 'High-Volatility Holdings',
        description: `${highBetaHoldings.map(h => h.ticker).join(', ')} ${highBetaHoldings.length === 1 ? 'has' : 'have'} beta > 1.5, meaning ${highBetaHoldings.length === 1 ? 'it moves' : 'they move'} significantly more than the market.`,
        icon: Zap,
      });
    }

    // Volatility
    if (volatilityEstimate > 25) {
      result.push({
        type: 'warning',
        title: 'High Estimated Volatility',
        description: `Portfolio volatility is ~${volatilityEstimate.toFixed(1)}% annualized. Adding bonds or low-volatility dividend stocks could smooth returns.`,
        icon: AlertTriangle,
      });
    }

    // Positive returns
    const gainers = holdingWeights.filter(h => h.return > 10);
    if (gainers.length > 0) {
      result.push({
        type: 'positive',
        title: 'Strong Performers',
        description: `${gainers.map(g => g.ticker).join(', ')} ${gainers.length === 1 ? 'is' : 'are'} up more than 10%. Consider taking partial profits or rebalancing.`,
        icon: TrendingUp,
      });
    }

    return result;
  }, [holdings, analysis, marketDataMap]);

  const typeStyles = {
    warning: 'border-l-warning bg-warning/5',
    suggestion: 'border-l-primary bg-primary/5',
    positive: 'border-l-primary bg-primary/5',
    info: 'border-l-muted-foreground bg-muted/30',
  };

  const typeBadge = {
    warning: 'bg-warning/20 text-warning border-warning/30',
    suggestion: 'bg-primary/20 text-primary border-primary/30',
    positive: 'bg-primary/20 text-primary border-primary/30',
    info: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <Card className="glass-card-elevated">
      <CardHeader className="pb-3">
        <CardTitle className="section-header text-base sm:text-lg">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          AI Portfolio Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="text-3xl">🤖</div>
            <p className="text-sm text-muted-foreground">Add holdings to receive AI-powered insights</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className={`border-l-4 rounded-r-xl p-3.5 ${typeStyles[insight.type]} transition-colors`}>
                <div className="flex items-start gap-2.5">
                  <insight.icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-foreground/70" />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${typeBadge[insight.type]}`}>
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
