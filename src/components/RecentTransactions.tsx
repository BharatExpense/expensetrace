import { Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Expense, getCategoryInfo, ExpenseCategory } from '@/types/expense';
import { useCurrency } from '@/contexts/CurrencyContext';
import { format, parseISO } from 'date-fns';

interface RecentTransactionsProps {
  expenses: Expense[];
  limit?: number;
}

export const RecentTransactions = ({ expenses, limit = 5 }: RecentTransactionsProps) => {
  const { formatAmount } = useCurrency();
  const recent = expenses.slice(0, limit);

  return (
    <Card className="glass-card-elevated">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="section-header text-base sm:text-lg">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Receipt className="h-4 w-4 text-primary" />
          </div>
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">💸</div>
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((expense) => {
              const info = getCategoryInfo(expense.category as ExpenseCategory);
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/20 hover:border-border/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: `${info.color}12` }}
                    >
                      {info.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                          {expense.description || info.label}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        {format(parseISO(expense.date), 'MMM d')}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm sm:text-base font-bold text-foreground tabular-nums ml-2">
                    {formatAmount(expense.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
