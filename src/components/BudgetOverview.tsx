import { Target, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Budget } from '@/hooks/useBudgets';
import { getCategoryInfo, ExpenseCategory } from '@/types/expense';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BudgetOverviewProps {
  budgets: Budget[];
  expensesByCategory: Record<string, number>;
}

export const BudgetOverview = ({ budgets, expensesByCategory }: BudgetOverviewProps) => {
  const { formatAmount } = useCurrency();

  return (
    <Card className="glass-card-elevated">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="section-header text-base sm:text-lg">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Target className="h-4 w-4 text-primary" />
          </div>
          Budget Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {budgets.slice(0, 4).map((budget) => {
          const info = getCategoryInfo(budget.category as ExpenseCategory);
          const spent = expensesByCategory[budget.category] || 0;
          const pct = Math.min((spent / budget.limitAmount) * 100, 100);
          const isOver = spent > budget.limitAmount;
          const isWarning = pct >= 80;

          return (
            <div key={budget.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <span>{info.emoji}</span>
                  <span className="font-medium text-foreground">{info.label}</span>
                  {isOver && <AlertTriangle className="h-3 w-3 text-destructive" />}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {formatAmount(spent)} / {formatAmount(budget.limitAmount)}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver ? 'bg-destructive' : isWarning ? 'bg-warning' : 'bg-primary'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
