import { useState } from 'react';
import { Plus, Trash2, Upload, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PortfolioHolding, SECTORS, SIMULATED_STOCKS, MarketData } from '@/types/portfolio';
import { toast } from '@/hooks/use-toast';

interface PortfolioInputProps {
  holdings: PortfolioHolding[];
  marketDataMap: Record<string, MarketData>;
  onAdd: (holding: Omit<PortfolioHolding, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export const PortfolioInput = ({ holdings, marketDataMap, onAdd, onDelete }: PortfolioInputProps) => {
  const [showAdd, setShowAdd] = useState(false);
  const [ticker, setTicker] = useState('');
  const [stockName, setStockName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sector, setSector] = useState('Other');

  const handleTickerChange = (val: string) => {
    const upper = val.toUpperCase();
    setTicker(upper);
    const stock = SIMULATED_STOCKS[upper];
    if (stock) {
      setStockName(stock.name);
      setSector(stock.sector);
      if (!buyPrice) setBuyPrice(stock.price.toFixed(2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !stockName || !quantity || !buyPrice) {
      toast({ title: 'Fill all fields', variant: 'destructive' });
      return;
    }
    const success = await onAdd({ stockName, ticker, quantity: Number(quantity), buyPrice: Number(buyPrice), sector });
    if (success) {
      toast({ title: 'Holding added', description: `${ticker} added to portfolio` });
      setTicker(''); setStockName(''); setQuantity(''); setBuyPrice(''); setSector('Other');
      setShowAdd(false);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').slice(1); // skip header
      let count = 0;
      for (const line of lines) {
        const [t, name, qty, price, sec] = line.split(',').map(s => s.trim());
        if (t && name && qty && price) {
          const stock = SIMULATED_STOCKS[t.toUpperCase()];
          await onAdd({
            ticker: t.toUpperCase(),
            stockName: name || stock?.name || t,
            quantity: Number(qty),
            buyPrice: Number(price),
            sector: sec || stock?.sector || 'Other',
          });
          count++;
        }
      }
      toast({ title: `${count} holdings imported` });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      <Card className="glass-card-elevated">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="section-header text-base sm:text-lg">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              Portfolio Holdings
            </CardTitle>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                <Button variant="outline" size="sm" className="gap-1.5" asChild>
                  <span><Upload className="h-3.5 w-3.5" /> CSV</span>
                </Button>
              </label>
              <Button size="sm" className="gap-1.5" onClick={() => setShowAdd(true)}>
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {holdings.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-4xl">📊</div>
              <p className="text-muted-foreground text-sm">No holdings yet. Add stocks to analyze your portfolio.</p>
              <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add First Holding
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {holdings.map(h => {
                const md = marketDataMap[h.ticker.toUpperCase()];
                const currentPrice = md?.currentPrice ?? h.buyPrice;
                const returnPct = ((currentPrice - h.buyPrice) / h.buyPrice) * 100;
                const value = h.quantity * currentPrice;
                return (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/20 hover:border-border/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                        {h.ticker.slice(0, 4)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{h.stockName}</p>
                        <p className="text-xs text-muted-foreground">{h.quantity} shares · {h.sector}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold tabular-nums">${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        <div className={`flex items-center gap-0.5 text-xs font-medium ${returnPct >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {returnPct >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(1)}%
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(h.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-[92vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10"><Plus className="h-4 w-4 text-primary" /></div>
              Add Holding
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Ticker</Label>
                <Input placeholder="AAPL" value={ticker} onChange={e => handleTickerChange(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Stock Name</Label>
                <Input placeholder="Apple Inc." value={stockName} onChange={e => setStockName(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Quantity</Label>
                <Input type="number" placeholder="10" value={quantity} onChange={e => setQuantity(e.target.value)} min="0" step="any" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Buy Price ($)</Label>
                <Input type="number" placeholder="150.00" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} min="0" step="0.01" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sector</Label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full font-semibold">Add to Portfolio</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
