import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { PortfolioHolding, MarketData, PortfolioAnalysis, getMarketData, analyzePortfolio } from '@/types/portfolio';
import { toast } from '@/hooks/use-toast';

export const usePortfolio = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHoldings = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('portfolio_holdings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: 'Error loading portfolio', description: error.message, variant: 'destructive' });
    } else {
      setHoldings((data || []).map(d => ({
        id: d.id,
        userId: d.user_id,
        stockName: d.stock_name,
        ticker: d.ticker,
        quantity: Number(d.quantity),
        buyPrice: Number(d.buy_price),
        sector: d.sector || 'Other',
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      })));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => { fetchHoldings(); }, [fetchHoldings]);

  const addHolding = useCallback(async (holding: Omit<PortfolioHolding, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return false;
    const { error } = await supabase.from('portfolio_holdings').insert({
      user_id: user.id,
      stock_name: holding.stockName,
      ticker: holding.ticker.toUpperCase(),
      quantity: holding.quantity,
      buy_price: holding.buyPrice,
      sector: holding.sector,
    });
    if (error) {
      toast({ title: 'Failed to add holding', description: error.message, variant: 'destructive' });
      return false;
    }
    await fetchHoldings();
    return true;
  }, [user, fetchHoldings]);

  const deleteHolding = useCallback(async (id: string) => {
    const { error } = await supabase.from('portfolio_holdings').delete().eq('id', id);
    if (error) {
      toast({ title: 'Failed to delete', description: error.message, variant: 'destructive' });
      return false;
    }
    setHoldings(prev => prev.filter(h => h.id !== id));
    return true;
  }, []);

  const updateHolding = useCallback(async (id: string, updates: Partial<Omit<PortfolioHolding, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.stockName !== undefined) dbUpdates.stock_name = updates.stockName;
    if (updates.ticker !== undefined) dbUpdates.ticker = updates.ticker.toUpperCase();
    if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
    if (updates.buyPrice !== undefined) dbUpdates.buy_price = updates.buyPrice;
    if (updates.sector !== undefined) dbUpdates.sector = updates.sector;
    
    const { error } = await supabase.from('portfolio_holdings').update(dbUpdates).eq('id', id);
    if (error) {
      toast({ title: 'Failed to update', description: error.message, variant: 'destructive' });
      return false;
    }
    await fetchHoldings();
    return true;
  }, [fetchHoldings]);

  // Market data for all holdings
  const marketDataMap = useMemo(() => {
    const map: Record<string, MarketData> = {};
    for (const h of holdings) {
      map[h.ticker.toUpperCase()] = getMarketData(h.ticker);
    }
    return map;
  }, [holdings]);

  // Portfolio analysis
  const analysis = useMemo(() => analyzePortfolio(holdings, marketDataMap), [holdings, marketDataMap]);

  return { holdings, isLoading, addHolding, deleteHolding, updateHolding, marketDataMap, analysis, refetch: fetchHoldings };
};
