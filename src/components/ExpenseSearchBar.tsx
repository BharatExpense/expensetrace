import { useState } from 'react';
import { Search, Calendar, DollarSign, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export interface ExpenseFilters {
  searchText: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
}

interface ExpenseSearchBarProps {
  filters: ExpenseFilters;
  onChange: (filters: ExpenseFilters) => void;
}

export const ExpenseSearchBar = ({ filters, onChange }: ExpenseSearchBarProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.amountMin || filters.amountMax;

  const clearAll = () => {
    onChange({ searchText: '', dateFrom: undefined, dateTo: undefined, amountMin: undefined, amountMax: undefined });
    setShowAdvanced(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={filters.searchText}
            onChange={(e) => onChange({ ...filters, searchText: e.target.value })}
            className="pl-9 h-10"
          />
          {filters.searchText && (
            <button
              onClick={() => onChange({ ...filters, searchText: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button
          variant={showAdvanced ? 'default' : 'outline'}
          size="icon"
          className="h-10 w-10 flex-shrink-0"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-muted-foreground">
            Clear
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 animate-fade-in">
          {/* Date Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Date From
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start text-left font-normal h-9 text-sm', !filters.dateFrom && 'text-muted-foreground')}>
                  {filters.dateFrom ? format(filters.dateFrom, 'MMM d, yyyy') : 'Start date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(d) => onChange({ ...filters, dateFrom: d || undefined })}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Date To
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start text-left font-normal h-9 text-sm', !filters.dateTo && 'text-muted-foreground')}>
                  {filters.dateTo ? format(filters.dateTo, 'MMM d, yyyy') : 'End date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(d) => onChange({ ...filters, dateTo: d || undefined })}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Amount Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> Min Amount
            </label>
            <Input
              type="number"
              placeholder="0"
              value={filters.amountMin ?? ''}
              onChange={(e) => onChange({ ...filters, amountMin: e.target.value ? Number(e.target.value) : undefined })}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> Max Amount
            </label>
            <Input
              type="number"
              placeholder="No limit"
              value={filters.amountMax ?? ''}
              onChange={(e) => onChange({ ...filters, amountMax: e.target.value ? Number(e.target.value) : undefined })}
              className="h-9 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};
