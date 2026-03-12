import { useState, useMemo } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PortfolioAnalysis, PortfolioHolding, MarketData } from '@/types/portfolio';

interface PortfolioReportProps {
  holdings: PortfolioHolding[];
  analysis: PortfolioAnalysis;
  marketDataMap: Record<string, MarketData>;
}

export const PortfolioReport = ({ holdings, analysis, marketDataMap }: PortfolioReportProps) => {
  const [generating, setGenerating] = useState(false);

  const generateCSV = () => {
    const rows = [
      ['Ticker', 'Name', 'Sector', 'Quantity', 'Buy Price', 'Current Price', 'Value', 'Return %'],
      ...holdings.map(h => {
        const md = marketDataMap[h.ticker.toUpperCase()];
        const cp = md?.currentPrice ?? h.buyPrice;
        const val = h.quantity * cp;
        const ret = ((cp - h.buyPrice) / h.buyPrice * 100).toFixed(2);
        return [h.ticker, h.stockName, h.sector, h.quantity, h.buyPrice.toFixed(2), cp.toFixed(2), val.toFixed(2), ret];
      }),
      [],
      ['Portfolio Summary'],
      ['Total Value', `$${analysis.totalValue.toFixed(2)}`],
      ['Total Invested', `$${analysis.totalInvested.toFixed(2)}`],
      ['Total Return', `${analysis.totalReturnPercent.toFixed(2)}%`],
      ['Risk Score', `${analysis.riskScore}/100`],
      ['Diversification', `${analysis.diversificationScore}/100`],
      ['Volatility', `${analysis.volatilityEstimate.toFixed(1)}%`],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateTextReport = () => {
    setGenerating(true);
    const lines = [
      '═══════════════════════════════════════',
      '  PORTFOLIO INTELLIGENCE REPORT',
      `  Generated: ${new Date().toLocaleDateString()}`,
      '═══════════════════════════════════════',
      '',
      '▸ PORTFOLIO OVERVIEW',
      `  Total Value:    $${analysis.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      `  Total Invested: $${analysis.totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      `  Total Return:   ${analysis.totalReturnPercent >= 0 ? '+' : ''}${analysis.totalReturnPercent.toFixed(2)}%`,
      '',
      '▸ RISK METRICS',
      `  Risk Score:       ${analysis.riskScore}/100`,
      `  Diversification:  ${analysis.diversificationScore}/100`,
      `  Concentration:    ${analysis.concentrationRisk.toFixed(1)}/100`,
      `  Volatility (ann): ${analysis.volatilityEstimate.toFixed(1)}%`,
      '',
      '▸ SECTOR EXPOSURE',
      ...Object.entries(analysis.sectorExposure)
        .sort((a, b) => b[1] - a[1])
        .map(([s, v]) => `  ${s.padEnd(25)} ${v.toFixed(1)}%`),
      '',
      '▸ HOLDINGS',
      ...holdings.map(h => {
        const md = marketDataMap[h.ticker.toUpperCase()];
        const cp = md?.currentPrice ?? h.buyPrice;
        const ret = ((cp - h.buyPrice) / h.buyPrice * 100);
        return `  ${h.ticker.padEnd(10)} ${h.stockName.padEnd(25)} ${ret >= 0 ? '+' : ''}${ret.toFixed(1)}%`;
      }),
      '',
      '▸ AI RECOMMENDATIONS',
    ];

    // Add recommendations
    if (analysis.riskScore > 60) lines.push('  ⚠ Consider reducing high-beta positions to lower overall risk');
    if (analysis.diversificationScore < 50) lines.push('  💡 Add holdings from underrepresented sectors for better diversification');
    const topHolding = analysis.holdingWeights[0];
    if (topHolding?.weight > 25) lines.push(`  ⚠ ${topHolding.ticker} is ${topHolding.weight.toFixed(0)}% of portfolio — consider trimming`);
    if (analysis.volatilityEstimate > 20) lines.push('  💡 Add low-volatility ETFs or dividend stocks to reduce volatility');
    lines.push('  ✓ Review and rebalance portfolio quarterly');
    lines.push('');
    lines.push('─── Disclaimer: This report is for informational purposes only. Not financial advice. ───');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setGenerating(false), 500);
  };

  return (
    <Card className="glass-card-elevated">
      <CardHeader className="pb-3">
        <CardTitle className="section-header text-base sm:text-lg">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          Generate Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Download a comprehensive portfolio intelligence report with performance, risk analysis, and AI recommendations.</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generateCSV} variant="outline" size="sm" className="gap-1.5" disabled={holdings.length === 0}>
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button onClick={generateTextReport} size="sm" className="gap-1.5" disabled={holdings.length === 0 || generating}>
              {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
              Full Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
