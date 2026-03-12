export interface PortfolioHolding {
  id: string;
  userId: string;
  stockName: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  sector: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketData {
  ticker: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
  volume: number;
  beta: number;
}

export interface PortfolioAnalysis {
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  totalReturnPercent: number;
  diversificationScore: number;
  riskScore: number;
  volatilityEstimate: number;
  concentrationRisk: number;
  sectorExposure: Record<string, number>;
  holdingWeights: { ticker: string; name: string; weight: number; value: number; return: number }[];
}

export const SECTORS = [
  'Technology', 'Healthcare', 'Financial', 'Consumer Discretionary',
  'Consumer Staples', 'Energy', 'Industrials', 'Materials',
  'Real Estate', 'Utilities', 'Communication Services', 'ETF/Index', 'Other'
] as const;

// Simulated market data for demo
export const SIMULATED_STOCKS: Record<string, { name: string; price: number; beta: number; sector: string; change: number }> = {
  'AAPL': { name: 'Apple Inc.', price: 178.72, beta: 1.28, sector: 'Technology', change: 1.24 },
  'GOOGL': { name: 'Alphabet Inc.', price: 141.80, beta: 1.06, sector: 'Technology', change: -0.53 },
  'MSFT': { name: 'Microsoft Corp.', price: 378.91, beta: 0.89, sector: 'Technology', change: 0.87 },
  'AMZN': { name: 'Amazon.com Inc.', price: 185.07, beta: 1.15, sector: 'Consumer Discretionary', change: 1.92 },
  'TSLA': { name: 'Tesla Inc.', price: 248.42, beta: 2.07, sector: 'Consumer Discretionary', change: -2.31 },
  'NVDA': { name: 'NVIDIA Corp.', price: 495.22, beta: 1.68, sector: 'Technology', change: 3.15 },
  'META': { name: 'Meta Platforms', price: 505.75, beta: 1.24, sector: 'Communication Services', change: 0.44 },
  'JPM': { name: 'JPMorgan Chase', price: 196.56, beta: 1.12, sector: 'Financial', change: 0.78 },
  'JNJ': { name: 'Johnson & Johnson', price: 156.74, beta: 0.53, sector: 'Healthcare', change: -0.12 },
  'V': { name: 'Visa Inc.', price: 275.96, beta: 0.94, sector: 'Financial', change: 0.56 },
  'PG': { name: 'Procter & Gamble', price: 158.33, beta: 0.42, sector: 'Consumer Staples', change: 0.21 },
  'UNH': { name: 'UnitedHealth Group', price: 527.38, beta: 0.73, sector: 'Healthcare', change: -0.89 },
  'XOM': { name: 'Exxon Mobil', price: 104.56, beta: 0.87, sector: 'Energy', change: 1.43 },
  'HD': { name: 'Home Depot', price: 345.12, beta: 1.04, sector: 'Consumer Discretionary', change: 0.32 },
  'BAC': { name: 'Bank of America', price: 33.42, beta: 1.38, sector: 'Financial', change: -0.67 },
  'KO': { name: 'Coca-Cola', price: 59.87, beta: 0.58, sector: 'Consumer Staples', change: 0.15 },
  'SPY': { name: 'S&P 500 ETF', price: 458.27, beta: 1.00, sector: 'ETF/Index', change: 0.42 },
  'QQQ': { name: 'Nasdaq 100 ETF', price: 389.56, beta: 1.12, sector: 'ETF/Index', change: 0.78 },
  'VTI': { name: 'Total Stock Market ETF', price: 234.15, beta: 1.01, sector: 'ETF/Index', change: 0.35 },
  'RELIANCE.NS': { name: 'Reliance Industries', price: 2456.30, beta: 0.82, sector: 'Energy', change: 1.12 },
  'TCS.NS': { name: 'Tata Consultancy', price: 3678.45, beta: 0.65, sector: 'Technology', change: -0.45 },
  'INFY.NS': { name: 'Infosys Ltd.', price: 1456.70, beta: 0.78, sector: 'Technology', change: 0.89 },
  'HDFCBANK.NS': { name: 'HDFC Bank', price: 1634.25, beta: 0.91, sector: 'Financial', change: 0.34 },
};

export function getMarketData(ticker: string): MarketData {
  const stock = SIMULATED_STOCKS[ticker.toUpperCase()];
  if (!stock) {
    return {
      ticker,
      currentPrice: 100 + Math.random() * 200,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      high52w: 150 + Math.random() * 100,
      low52w: 50 + Math.random() * 50,
      volume: Math.floor(Math.random() * 10000000),
      beta: 0.8 + Math.random() * 0.8,
    };
  }
  return {
    ticker,
    currentPrice: stock.price * (1 + (Math.random() - 0.5) * 0.02),
    change: stock.change,
    changePercent: (stock.change / stock.price) * 100,
    high52w: stock.price * 1.3,
    low52w: stock.price * 0.7,
    volume: Math.floor(Math.random() * 10000000),
    beta: stock.beta,
  };
}

export function analyzePortfolio(
  holdings: PortfolioHolding[],
  marketDataMap: Record<string, MarketData>
): PortfolioAnalysis {
  if (holdings.length === 0) {
    return {
      totalValue: 0, totalInvested: 0, totalReturn: 0, totalReturnPercent: 0,
      diversificationScore: 0, riskScore: 0, volatilityEstimate: 0, concentrationRisk: 0,
      sectorExposure: {}, holdingWeights: [],
    };
  }

  let totalValue = 0;
  let totalInvested = 0;
  const sectorValues: Record<string, number> = {};
  const holdingValues: { ticker: string; name: string; value: number; invested: number }[] = [];

  for (const h of holdings) {
    const md = marketDataMap[h.ticker.toUpperCase()];
    const currentPrice = md?.currentPrice ?? h.buyPrice;
    const value = h.quantity * currentPrice;
    const invested = h.quantity * h.buyPrice;
    totalValue += value;
    totalInvested += invested;
    sectorValues[h.sector] = (sectorValues[h.sector] || 0) + value;
    holdingValues.push({ ticker: h.ticker, name: h.stockName, value, invested });
  }

  const totalReturn = totalValue - totalInvested;
  const totalReturnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  // Sector exposure as percentages
  const sectorExposure: Record<string, number> = {};
  for (const [sector, val] of Object.entries(sectorValues)) {
    sectorExposure[sector] = totalValue > 0 ? (val / totalValue) * 100 : 0;
  }

  // Holding weights
  const holdingWeights = holdingValues.map(h => ({
    ticker: h.ticker,
    name: h.name,
    weight: totalValue > 0 ? (h.value / totalValue) * 100 : 0,
    value: h.value,
    return: h.invested > 0 ? ((h.value - h.invested) / h.invested) * 100 : 0,
  })).sort((a, b) => b.weight - a.weight);

  // Concentration risk (HHI - Herfindahl-Hirschman Index)
  const hhi = holdingWeights.reduce((sum, h) => sum + (h.weight / 100) ** 2, 0);
  const concentrationRisk = Math.min(hhi * 100, 100);

  // Diversification score (inverse of concentration, scaled)
  const numSectors = Object.keys(sectorExposure).length;
  const maxWeight = holdingWeights[0]?.weight ?? 100;
  const diversificationScore = Math.min(
    Math.round(
      (numSectors / 11) * 30 + // sector diversity
      (1 - hhi) * 40 + // holding spread
      Math.min(holdings.length / 10, 1) * 30 // number of holdings
    ),
    100
  );

  // Risk score based on beta and concentration
  const weightedBeta = holdings.reduce((sum, h) => {
    const md = marketDataMap[h.ticker.toUpperCase()];
    const value = h.quantity * (md?.currentPrice ?? h.buyPrice);
    const weight = totalValue > 0 ? value / totalValue : 0;
    return sum + weight * (md?.beta ?? 1);
  }, 0);

  const riskScore = Math.min(Math.round(
    weightedBeta * 25 + concentrationRisk * 0.4 + (maxWeight > 30 ? 20 : maxWeight > 20 ? 10 : 0)
  ), 100);

  const volatilityEstimate = weightedBeta * 15; // rough annualized vol estimate

  return {
    totalValue, totalInvested, totalReturn, totalReturnPercent,
    diversificationScore, riskScore, volatilityEstimate, concentrationRisk,
    sectorExposure, holdingWeights,
  };
}
