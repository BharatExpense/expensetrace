import { useMemo } from 'react';
import { Lightbulb, TrendingDown, TrendingUp, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense, ExpenseCategory, getCategoryInfo } from '@/types/expense';
import { useCurrency } from '@/contexts/CurrencyContext';
import { parseISO, startOfMonth, endOfMonth, subMonths, differenceInDays, format } from 'date-fns';

interface SmartInsightsProps {
  expenses: Expense[];
  budgets: { category: string; limitAmount: number }[];
}

interface Insight {
  type: 'saving' | 'warning' | 'trend' | 'tip';
  icon: typeof Lightbulb;
  title: string;
  description: string;
}

export const SmartInsights = ({ expenses, budgets }: SmartInsightsProps) => {
  const { formatAmount } = useCurrency();

  const insights = useMemo(() => {
    const result: Insight[] = [];
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthExpenses = expenses.filter(e => {
      const d = parseISO(e.date);
      return d >= thisMonthStart && d <= thisMonthEnd;
    });

    const lastMonthExpenses = expenses.filter(e => {
      const d = parseISO(e.date);
      return d >= lastMonthStart && d <= lastMonthEnd;
    });

    const thisMonthByCategory: Record<string, number> = {};
    thisMonthExpenses.forEach(e => {
      thisMonthByCategory[e.category] = (thisMonthByCategory[e.category] || 0) + e.amount;
    });

    const lastMonthByCategory: Record<string, number> = {};
    lastMonthExpenses.forEach(e => {
      lastMonthByCategory[e.category] = (lastMonthByCategory[e.category] || 0) + e.amount;
    });

    // Top spending category suggestion
    const sortedCategories = Object.entries(thisMonthByCategory).sort(([, a], [, b]) => b - a);
    if (sortedCategories.length > 0) {
      const [topCat, topAmount] = sortedCategories[0];
      const info = getCategoryInfo(topCat as ExpenseCategory);
      const saving20 = topAmount * 0.2;
      result.push({
        type: 'saving',
        icon: DollarSign,
        title: `Reduce ${info.label} spending`,
        description: `You spent ${formatAmount(topAmount)} on ${info.label.toLowerCase()} this month. Reducing by 20% saves ${formatAmount(saving20)}.`,
      });
    }

    // Month-over-month comparison
    const thisMonthTotal = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);

    if (lastMonthTotal > 0 && thisMonthTotal > 0) {
      const change = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      if (change > 10) {
        result.push({
          type: 'warning',
          icon: TrendingUp,
          title: 'Spending increased',
          description: `Up ${change.toFixed(0)}% vs last month (${formatAmount(lastMonthTotal)} → ${formatAmount(thisMonthTotal)}).`,
        });
      } else if (change < -10) {
        result.push({
          type: 'trend',
          icon: TrendingDown,
          title: 'Great job saving!',
          description: `Spending decreased by ${Math.abs(change).toFixed(0)}% compared to last month. Keep it up!`,
        });
      }
    }

    // Daily average insight
    if (thisMonthExpenses.length > 0) {
      const daysPassed = differenceInDays(now, thisMonthStart) + 1;
      const dailyAvg = thisMonthTotal / daysPassed;
      const daysInMonth = differenceInDays(thisMonthEnd, thisMonthStart) + 1;
      const projectedTotal = dailyAvg * daysInMonth;
      result.push({
        type: 'tip',
        icon: Calendar,
        title: `Daily average: ${formatAmount(dailyAvg)}`,
        description: `At this pace you'll spend ~${formatAmount(projectedTotal)} this month across ${thisMonthExpenses.length} transactions.`,
      });
    }

    // Budget warnings
    budgets.forEach(budget => {
      const spent = thisMonthByCategory[budget.category] || 0;
      const pct = (spent / budget.limitAmount) * 100;
      if (pct >= 80 && pct < 100) {
        const info = getCategoryInfo(budget.category as ExpenseCategory);
        result.push({
          type: 'warning',
          icon: AlertTriangle,
          title: `${info.label} budget at ${pct.toFixed(0)}%`,
          description: `${formatAmount(spent)} of ${formatAmount(budget.limitAmount)} used. Consider slowing down.`,
        });
      }
    });

    // Category spike detection
    sortedCategories.forEach(([cat, amount]) => {
      const lastAmount = lastMonthByCategory[cat] || 0;
      if (lastAmount > 0 && amount > lastAmount * 1.5) {
        const info = getCategoryInfo(cat as ExpenseCategory);
        result.push({
          type: 'warning',
          icon: TrendingUp,
          title: `${info.label} spike detected`,
          description: `Jumped from ${formatAmount(lastAmount)} to ${formatAmount(amount)} this month (+${(((amount - lastAmount) / lastAmount) * 100).toFixed(0)}%).`,
        });
      }
    });

    // Weekend vs weekday spending
    if (thisMonthExpenses.length >= 5) {
      let weekendTotal = 0, weekdayTotal = 0, weekendDays = 0, weekdayDays = 0;
      thisMonthExpenses.forEach(e => {
        const day = parseISO(e.date).getDay();
        if (day === 0 || day === 6) { weekendTotal += e.amount; weekendDays++; }
        else { weekdayTotal += e.amount; weekdayDays++; }
      });
      if (weekendDays > 0 && weekdayDays > 0) {
        const weekendAvg = weekendTotal / weekendDays;
        const weekdayAvg = weekdayTotal / weekdayDays;
        if (weekendAvg > weekdayAvg * 1.5) {
          result.push({
            type: 'tip',
            icon: Lightbulb,
            title: 'Weekend spending is high',
            description: `You spend ${formatAmount(weekendAvg)} avg on weekends vs ${formatAmount(weekdayAvg)} on weekdays. Plan weekend budgets!`,
          });
        }
      }
    }

    if (result.length === 0) {
      result.push({
        type: 'tip',
        icon: Lightbulb,
        title: 'Start tracking consistently',
        description: 'Log your expenses daily for at least a month to unlock personalized spending insights.',
      });
    }

    return result.slice(0, 5);
  }, [expenses, budgets, formatAmount]);

  const typeStyles: Record<string, string> = {
    saving: 'bg-primary/10 text-primary',
    warning: 'bg-destructive/10 text-destructive',
    trend: 'bg-primary/10 text-primary',
    tip: 'bg-accent text-accent-foreground',
  };

  return (
    <Card className="glass-card-elevated">
      <CardHeader className="pb-3">
        <CardTitle className="section-header text-base sm:text-lg">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          Smart Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/30">
            <div className={`p-2 rounded-lg flex-shrink-0 ${typeStyles[insight.type]}`}>
              <insight.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{insight.title}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">{insight.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
