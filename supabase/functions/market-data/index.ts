import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ALPHA_VANTAGE_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    if (!ALPHA_VANTAGE_KEY) {
      throw new Error('ALPHA_VANTAGE_API_KEY is not configured');
    }

    const { tickers } = await req.json();
    if (!Array.isArray(tickers) || tickers.length === 0) {
      throw new Error('tickers array is required');
    }

    // Limit to 5 tickers per request (Alpha Vantage rate limits)
    const limitedTickers = tickers.slice(0, 5);

    const results: Record<string, any> = {};

    for (const ticker of limitedTickers) {
      try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(ticker)}&apikey=${ALPHA_VANTAGE_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data['Global Quote'] && data['Global Quote']['05. price']) {
          const quote = data['Global Quote'];
          results[ticker] = {
            currentPrice: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
            high: parseFloat(quote['03. high']),
            low: parseFloat(quote['04. low']),
            volume: parseInt(quote['06. volume'], 10),
            previousClose: parseFloat(quote['08. previous close']),
          };
        } else if (data['Note']) {
          // Rate limited
          results[ticker] = { error: 'rate_limited' };
        } else {
          results[ticker] = { error: 'no_data' };
        }

        // Small delay between requests to avoid rate limiting
        if (limitedTickers.indexOf(ticker) < limitedTickers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (e) {
        results[ticker] = { error: 'fetch_failed' };
      }
    }

    return new Response(JSON.stringify({ data: results }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
