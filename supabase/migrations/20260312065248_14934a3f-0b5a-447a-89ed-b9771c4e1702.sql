
-- Portfolio holdings table
CREATE TABLE public.portfolio_holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  stock_name text NOT NULL,
  ticker text NOT NULL,
  quantity numeric NOT NULL DEFAULT 0,
  buy_price numeric NOT NULL DEFAULT 0,
  sector text DEFAULT 'Other',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own holdings" ON public.portfolio_holdings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own holdings" ON public.portfolio_holdings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own holdings" ON public.portfolio_holdings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own holdings" ON public.portfolio_holdings FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- AI chat messages table
CREATE TABLE public.ai_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'user',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON public.ai_chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own messages" ON public.ai_chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own messages" ON public.ai_chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);
