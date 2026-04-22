import { useEffect, useState } from 'react';
import { Currency, EXCHANGE_RATES, CURRENCIES } from '@/types/currency';

const STORAGE_KEY = 'live_exchange_rates_v1';
const REFRESH_MS = 60 * 60 * 1000; // 1 hour

interface CachedRates {
  rates: Record<Currency, number>;
  fetchedAt: number;
}

const readCache = (): CachedRates | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CachedRates) : null;
  } catch {
    return null;
  }
};

const writeCache = (data: CachedRates) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
};

/**
 * Fetches USD-based exchange rates from a free public API.
 * Falls back to static EXCHANGE_RATES on failure.
 * Cached in localStorage for 1 hour.
 */
export const useExchangeRates = () => {
  const cached = readCache();
  const [rates, setRates] = useState<Record<Currency, number>>(
    cached?.rates ?? EXCHANGE_RATES
  );
  const [isLive, setIsLive] = useState<boolean>(!!cached);
  const [lastUpdated, setLastUpdated] = useState<number | null>(cached?.fetchedAt ?? null);

  useEffect(() => {
    const fresh = cached && Date.now() - cached.fetchedAt < REFRESH_MS;
    if (fresh) return;

    const controller = new AbortController();
    const symbols = CURRENCIES.map((c) => c.code).join(',');

    (async () => {
      try {
        // Free, no-key API — open.er-api.com (USD base)
        const res = await fetch(`https://open.er-api.com/v6/latest/USD`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data?.result !== 'success' || !data?.rates) throw new Error('Bad payload');

        const merged = { ...EXCHANGE_RATES };
        for (const c of CURRENCIES) {
          const v = data.rates[c.code];
          if (typeof v === 'number' && v > 0) merged[c.code] = v;
        }
        setRates(merged);
        setIsLive(true);
        const now = Date.now();
        setLastUpdated(now);
        writeCache({ rates: merged, fetchedAt: now });
      } catch (err) {
        console.warn('Exchange rate fetch failed, using fallback:', err);
      }
    })();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rates, isLive, lastUpdated };
};
