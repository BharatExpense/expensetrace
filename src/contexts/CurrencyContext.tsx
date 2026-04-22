import React, { createContext, useContext, ReactNode } from 'react';
import { Currency, formatCurrency as formatCurrencyUtil, convertCurrency } from '@/types/currency';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExchangeRates } from '@/hooks/useExchangeRates';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => Promise<boolean>;
  formatAmount: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency: Currency) => number;
  isLoading: boolean;
  isLiveRates: boolean;
  ratesUpdatedAt: number | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const { preferences, updatePreferences, isLoading } = useUserPreferences();
  const { rates, isLive, lastUpdated } = useExchangeRates();

  const currency = preferences?.preferredCurrency || 'USD';

  const setCurrency = async (newCurrency: Currency): Promise<boolean> => {
    return updatePreferences({ preferredCurrency: newCurrency });
  };

  const formatAmount = (amount: number): string => {
    return formatCurrencyUtil(amount, currency);
  };

  const convertAmount = (amount: number, fromCurrency: Currency): number => {
    return convertCurrency(amount, fromCurrency, currency, rates);
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatAmount,
      convertAmount,
      isLoading,
      isLiveRates: isLive,
      ratesUpdatedAt: lastUpdated,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
