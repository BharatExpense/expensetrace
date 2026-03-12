import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { PortfolioAnalysis, MarketData } from '@/types/portfolio';
import { PortfolioHolding } from '@/types/portfolio';

interface RiskHeatmapProps {
  holdings: PortfolioHolding[];
  marketDataMap: Record<string, MarketData>;
  analysis: PortfolioAnalysis;
}

export const RiskHeatmap = ({ holdings, marketDataMap, analysis }: RiskHeatmapProps) => {
  const items = holdings.map(h => {
    const md = marketDataMap[h.ticker.toUpperCase()];
    const currentPrice = md?.currentPrice ?? h.buyPrice;
    const value = h.quantity * currentPrice;
    const returnPct = ((currentPrice - h.buyPrice) / h.buyPrice) * 100;
    const beta = md?.beta ?? 1;
    return { ticker: h.ticker, name: h.stockName, value, returnPct, beta, weight: analysis.totalValue > 0 ? (value / analysis.totalValue) * 100 : 0 };
  }).sort((a, b) => b.value - a.value);

  const maxValue = Math.max(...items.map(i => i.value), 1);

  const getColor = (returnPct: number) => {
    if (returnPct > 5) return 'bg-primary/80 text-primary-foreground';
    if (returnPct > 0) return 'bg-primary/40 text-foreground';
    if (returnPct > -5) return 'bg-destructive/30 text-foreground';
    return 'bg-destructive/70 text-destructive-foreground';
  };

  return (
    <Card className="glass-card-elevated">
      <CardHeader className="pb-3">
        <CardTitle className="section-header text-base sm:text-lg">
          <div className="p-1.5 rounded-lg bg-destructive/10">
            <Activity className="h-4 w-4 text-destructive" />
          </div>
          Risk Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Add holdings to see risk heatmap</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {items.map(item => {
              const sizeRatio = Math.max(item.value / maxValue, 0.4);
              return (
                <div
                  key={item.ticker}
                  className={`${getColor(item.returnPct)} rounded-xl p-3 transition-all hover:scale-[1.02] cursor-default`}
                  style={{ minHeight: `${60 + sizeRatio * 40}px` }}
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <p className="font-bold text-sm">{item.ticker}</p>
                      <p className="text-[10px] opacity-80 truncate">{item.name}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-semibold tabular-nums">{item.returnPct >= 0 ? '+' : ''}{item.returnPct.toFixed(1)}%</p>
                      <p className="text-[10px] opacity-70">{item.weight.toFixed(1)}% · β{item.beta.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/80" /> &gt;5% gain</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/40" /> 0-5% gain</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive/30" /> 0-5% loss</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive/70" /> &gt;5% loss</span>
        </div>
      </CardContent>
    </Card>
  );
};
