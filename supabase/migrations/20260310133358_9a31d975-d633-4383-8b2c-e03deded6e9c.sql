
ALTER TABLE public.expenses 
ADD COLUMN is_recurring boolean NOT NULL DEFAULT false,
ADD COLUMN recurring_interval text DEFAULT NULL;
