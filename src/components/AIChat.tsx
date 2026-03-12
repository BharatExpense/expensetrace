import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { PortfolioAnalysis, PortfolioHolding } from '@/types/portfolio';

interface AIChatProps {
  holdings: PortfolioHolding[];
  analysis: PortfolioAnalysis;
}

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/portfolio-chat`;

export const AIChat = ({ holdings, analysis }: AIChatProps) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const buildContext = () => {
    const holdingSummary = holdings.map(h => `${h.ticker} (${h.stockName}): ${h.quantity} shares at $${h.buyPrice}, sector: ${h.sector}`).join('\n');
    return `Portfolio Summary:
Total Value: $${analysis.totalValue.toLocaleString()}
Total Invested: $${analysis.totalInvested.toLocaleString()}
Return: ${analysis.totalReturnPercent.toFixed(2)}%
Risk Score: ${analysis.riskScore}/100
Diversification: ${analysis.diversificationScore}/100
Volatility: ${analysis.volatilityEstimate.toFixed(1)}%
Sector Exposure: ${Object.entries(analysis.sectorExposure).map(([s, v]) => `${s}: ${v.toFixed(1)}%`).join(', ')}

Holdings:
${holdingSummary}`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    let assistantContent = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          portfolioContext: buildContext(),
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(resp.status === 429 ? 'Rate limit reached. Please try again later.' : resp.status === 402 ? 'Usage limit reached.' : errText);
      }

      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch { buffer = line + '\n' + buffer; break; }
        }
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
    }

    setIsLoading(false);
  };

  const suggestions = [
    "Is my portfolio risky?",
    "How can I diversify better?",
    "Which stocks contribute most to risk?",
    "Should I rebalance my portfolio?",
  ];

  return (
    <Card className="glass-card-elevated flex flex-col h-[500px]">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="section-header text-base sm:text-lg">
            <div className="p-1.5 rounded-lg bg-primary/10"><Bot className="h-4 w-4 text-primary" /></div>
            AI Financial Assistant
          </CardTitle>
          {messages.length > 0 && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMessages([])}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 pt-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-6">
              <div className="text-3xl">🤖</div>
              <p className="text-sm text-muted-foreground text-center">Ask me anything about your portfolio</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); }}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-accent border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted/50 text-foreground rounded-bl-md border border-border/30'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center"><Bot className="h-3.5 w-3.5 text-primary" /></div>
              <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3 border border-border/30">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2 flex-shrink-0">
          <Input
            placeholder="Ask about your portfolio..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            className="text-sm"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
