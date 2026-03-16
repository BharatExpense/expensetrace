import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketData, SIMULATED_STOCKS } from '@/types/portfolio';
import { toast } from '@/hooks/use-toast';

export const useMarketData = () => {
  const [liveData, setLiveData] = useState<Record<string, MarketData>>({});
  const [isLive, setIsLive] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchLiveData = useCallback(async (tickers: string[]) => {
    if (tickers.length === 0) return;
    setIsFetching(true);

    try {
      const { data, error } = await supabase.functions.invoke('market-data', {
        body: { tickers: tickers.map(t => t.toUpperCase()) },
      });

      if (error) throw error;

      const results: Record<string, MarketData> = {};
      const apiData = data?.data || {};

      for (const ticker of tickers) {
        const upper = ticker.toUpperCase();
        const live = apiData[upper];
        const simulated = SIMULATED_STOCKS[upper];

        if (live && !live.error) {
          results[upper] = {
            ticker: upper,
            currentPrice: live.currentPrice,
            change: live.change,
            changePercent: live.changePercent,
            high52w: live.high * 1.15, // approximation
            low52w: live.low * 0.85,
            volume: live.volume,
            beta: simulated?.beta ?? 1.0, // beta not available from GLOBAL_QUOTE
          };
        }
      }

      if (Object.keys(results).length > 0) {
        setLiveData(prev => ({ ...prev, ...results }));
        setIsLive(true);
        toast({ title: 'Live data loaded', description: `Updated ${Object.keys(results).length} stock prices` });
      } else {
        toast({ title: 'Using simulated data', description: 'Live data unavailable or rate limited', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Market data fetch failed:', err);
      toast({ title: 'Using simulated data', description: 'Could not fetch live prices', variant: 'destructive' });
    } finally {
      setIsFetching(false);
    }
  }, []);

  return { liveData, isLive, isFetching, fetchLiveData };
};
