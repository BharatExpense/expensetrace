import { useState, useMemo } from 'react';
import { Trash2, Filter, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES, getCategoryInfo } from '@/types/expense';
import { useCurrency } from '@/contexts/CurrencyContext';
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { ExpenseEditDialog } from './ExpenseEditDialog';
import { ExpenseSearchBar, ExpenseFilters } from './ExpenseSearchBar';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => Promise<boolean>;
}

export const ExpenseList = ({ expenses, onDelete, onEdit }: ExpenseListProps) => {
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');
  const [filters, setFilters] = useState<ExpenseFilters>({ searchText: '' });
  const { formatAmount } = useCurrency();

  const filteredExpenses = useMemo(() => {
    let result = expenses;

    // Category filter
    if (filterCategory !== 'all') {
      result = result.filter(e => e.category === filterCategory);
    }

    // Text search
    if (filters.searchText.trim()) {
      const q = filters.searchText.toLowerCase();
      result = result.filter(e =>
        (e.description?.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q) ||
        e.amount.toString().includes(q)
      );
    }

    // Date range
    if (filters.dateFrom) {
      const from = startOfDay(filters.dateFrom);
      result = result.filter(e => !isBefore(parseISO(e.date), from));
    }
    if (filters.dateTo) {
      const to = endOfDay(filters.dateTo);
      result = result.filter(e => !isAfter(parseISO(e.date), to));
    }

    // Amount range
    if (filters.amountMin !== undefined) {
      result = result.filter(e => e.amount >= filters.amountMin!);
    }
    if (filters.amountMax !== undefined) {
      result = result.filter(e => e.amount <= filters.amountMax!);
    }

    return result;
  }, [expenses, filterCategory, filters]);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 sm:py-16">
        <div className="text-5xl sm:text-6xl mb-4 animate-float">💸</div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No expenses yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">Add your first expense to start tracking your spending!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Search Bar */}
      <ExpenseSearchBar filters={filters} onChange={setFilters} />

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="text-xs sm:text-sm font-medium">Category:</span>
        </div>
        <Select 
          value={filterCategory} 
          onValueChange={(v) => setFilterCategory(v as ExpenseCategory | 'all')}
        >
          <SelectTrigger className="w-[160px] sm:w-[180px] h-9 sm:h-10 text-sm">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {EXPENSE_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                <span className="flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
          {filteredExpenses.length} result{filteredExpenses.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Expense Items */}
      <div className="space-y-2.5 sm:space-y-3">
        {filteredExpenses.map((expense, index) => {
          const categoryInfo = getCategoryInfo(expense.category);
          
          return (
            <div
              key={expense.id}
              className="group flex items-center justify-between p-3 sm:p-4 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-md transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${categoryInfo.color}12` }}
                >
                  {categoryInfo.emoji}
                </div>
                
                <div className="space-y-0.5 sm:space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <Badge 
                      variant="secondary" 
                      className="font-medium text-xs px-2 py-0.5"
                      style={{ 
                        backgroundColor: `${categoryInfo.color}12`,
                        color: categoryInfo.color,
                      }}
                    >
                      {categoryInfo.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(expense.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {expense.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                      {expense.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 ml-2">
                <span className="text-base sm:text-lg font-bold text-foreground tabular-nums mr-1 sm:mr-2">
                  {formatAmount(expense.amount)}
                </span>

                <ExpenseEditDialog
                  expense={expense}
                  onEdit={onEdit}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                    >
                      <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  }
                />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this expense? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(expense.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExpenses.length === 0 && expenses.length > 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm text-muted-foreground">No matching transactions found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};
