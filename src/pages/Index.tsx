import { useState } from 'react';
import { Receipt, LogOut, Plus, BarChart3, Target, ArrowRightLeft, Wallet, TrendingUp, PieChart } from 'lucide-react';
import logo from '@/assets/logo.png';
import { ProfileSettings } from '@/components/ProfileSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseSummary } from '@/components/ExpenseSummary';
import { ExpenseCharts } from '@/components/ExpenseCharts';
import { BudgetManager } from '@/components/BudgetManager';
import { ExportButton } from '@/components/ExportButton';
import { AuthForm } from '@/components/AuthForm';
import { LandingPage } from '@/components/LandingPage';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CurrencySelector } from '@/components/CurrencySelector';
import { NotificationManager } from '@/components/NotificationManager';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { ProjectSelector } from '@/components/ProjectSelector';
import { ProjectOnboarding } from '@/components/ProjectOnboarding';
import { SmartInsights } from '@/components/SmartInsights';
import { BudgetOverview } from '@/components/BudgetOverview';
import { useAuth } from '@/hooks/useAuth';
import { useExpensesDb } from '@/hooks/useExpensesDb';
import { useBudgets } from '@/hooks/useBudgets';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from '@/hooks/use-toast';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { format } from 'date-fns';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const { user, isLoading: authLoading, signOut, isAuthenticated } = useAuth();
  const { selectedProject, selectedProjectId, projects, isLoading: projectsLoading } = useProjectContext();
  
  const {
    expenses,
    isLoading: expensesLoading,
    addExpense,
    deleteExpense,
    updateExpense,
    getTotalExpenses,
    getExpensesByCategory,
  } = useExpensesDb(selectedProjectId);

  const {
    budgets,
    setBudget,
    deleteBudget,
  } = useBudgets(selectedProjectId);

  const { preferences, updatePreferences } = useUserPreferences();
  const { formatAmount } = useCurrency();
  const { playExpenseAdded, playBudgetExceeded } = useNotificationSound();

  const handleAddExpense = async (expense: Parameters<typeof addExpense>[0]) => {
    const result = await addExpense(expense);
    if (result) {
      playExpenseAdded();
      setShowAddExpense(false);
      toast({
        title: 'Expense added!',
        description: `${formatAmount(expense.amount)} added to ${expense.category}`,
      });

      await updatePreferences({ lastExpenseDate: format(new Date(), 'yyyy-MM-dd') });

      const budget = budgets.find(b => b.category === expense.category);
      if (budget) {
        const newTotal = (getExpensesByCategory()[expense.category] || 0) + expense.amount;
        const percentage = (newTotal / budget.limitAmount) * 100;

        if (percentage >= 100) {
          playBudgetExceeded();
          toast({
            title: '⚠️ Budget exceeded!',
            description: `You've exceeded your ${expense.category} budget.`,
            variant: 'destructive',
          });
        } else if (percentage >= 80) {
          toast({
            title: '⚠️ Approaching budget limit',
            description: `You've used ${percentage.toFixed(0)}% of your ${expense.category} budget.`,
          });
        }
      }
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const success = await deleteExpense(id);
    if (success) {
      toast({
        title: 'Expense deleted',
        description: 'The expense has been removed.',
        variant: 'destructive',
      });
    }
  };

  const handleEditExpense = async (id: string, updates: Parameters<typeof updateExpense>[1]) => {
    const success = await updateExpense(id, updates);
    if (success) {
      toast({
        title: 'Expense updated',
        description: 'Your expense has been successfully updated.',
      });
    } else {
      toast({
        title: 'Failed to update expense',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
    return success;
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showAuth) {
      return <AuthForm />;
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  if (projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return <ProjectOnboarding />;
  }

  if (expensesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading your expenses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 min-w-0 flex-shrink">
              <img src={logo} alt="ExpenseTrace" className="h-6 sm:h-8 md:h-10 w-auto flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <ProjectSelector />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate hidden md:block">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-0.5 sm:gap-1.5 md:gap-2 flex-shrink-0">
              <div className="hidden lg:flex items-center gap-1.5">
                <CurrencySelector />
                <NotificationManager 
                  budgets={budgets}
                  expensesByCategory={getExpensesByCategory()}
                  lastExpenseDate={preferences?.lastExpenseDate}
                />
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <ThemeToggle />
                <ProfileSettings />
              </div>
              <div className="hidden sm:flex items-center gap-0.5 sm:gap-1">
                <ExportButton expenses={expenses} />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut} 
                className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-muted-foreground hover:text-foreground"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 mt-2 pt-2 border-t border-border/30 lg:hidden">
            <CurrencySelector />
            <NotificationManager 
              budgets={budgets}
              expensesByCategory={getExpensesByCategory()}
              lastExpenseDate={preferences?.lastExpenseDate}
            />
            <div className="sm:hidden ml-auto">
              <ExportButton expenses={expenses} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 page-container py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Project Header */}
        {selectedProject && (
          <div className="animate-fade-in-up">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2.5 text-foreground">
              <span className="text-2xl sm:text-3xl">{selectedProject.icon}</span>
              {selectedProject.name}
            </h1>
            {selectedProject.description && (
              <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-2xl">{selectedProject.description}</p>
            )}
          </div>
        )}

        {/* Summary Cards */}
        <section className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <ExpenseSummary
            totalExpenses={getTotalExpenses()}
            expensesByCategory={getExpensesByCategory()}
            expenseCount={expenses.length}
          />
        </section>

        {/* Budget Overview (compact) */}
        {budgets.length > 0 && (
          <section className="animate-fade-in-up" style={{ animationDelay: '75ms' }}>
            <BudgetOverview budgets={budgets} expensesByCategory={getExpensesByCategory()} />
          </section>
        )}

        {/* Smart Insights */}
        <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <SmartInsights expenses={expenses} budgets={budgets} />
        </section>

        {/* Tabs: Transactions, Analytics, Budgets, Converter */}
        <Tabs defaultValue="transactions" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-lg h-10 sm:h-11 p-1 bg-muted/50">
            <TabsTrigger value="transactions" className="text-xs sm:text-sm font-medium gap-1.5">
              <Receipt className="h-3.5 w-3.5 hidden sm:block" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm font-medium gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 hidden sm:block" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="budgets" className="text-xs sm:text-sm font-medium gap-1.5">
              <Target className="h-3.5 w-3.5 hidden sm:block" />
              Budgets
            </TabsTrigger>
            <TabsTrigger value="converter" className="text-xs sm:text-sm font-medium gap-1.5">
              <ArrowRightLeft className="h-3.5 w-3.5 hidden sm:block" />
              Converter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-0">
            <Card className="glass-card-elevated">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="section-header">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    Recent Transactions
                  </CardTitle>
                  <Button size="sm" className="gap-1.5 hidden md:flex" onClick={() => setShowAddExpense(true)}>
                    <Plus className="h-4 w-4" />
                    Add Expense
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} onEdit={handleEditExpense} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <ExpenseCharts expenses={expenses} />
          </TabsContent>

          <TabsContent value="budgets" className="mt-0">
            <BudgetManager
              budgets={budgets}
              expensesByCategory={getExpensesByCategory()}
              onSetBudget={setBudget}
              onDeleteBudget={deleteBudget}
            />
          </TabsContent>

          <TabsContent value="converter" className="mt-0">
            <div className="max-w-md mx-auto">
              <CurrencyConverter />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Add Expense Button (mobile) */}
      <button
        onClick={() => setShowAddExpense(true)}
        className="fixed bottom-24 md:bottom-8 right-4 sm:right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center justify-center hover-lift active:scale-95 transition-all"
        aria-label="Add Expense"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Expense Modal */}
      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent className="max-w-[92vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Receipt className="h-4 w-4 text-primary" />
              </div>
              Add Expense
            </DialogTitle>
          </DialogHeader>
          <ExpenseForm onSubmit={handleAddExpense} />
        </DialogContent>
      </Dialog>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/40 md:hidden">
        <div className="flex items-center justify-around py-2 px-2">
          <MobileNavItem icon={Wallet} label="Home" active />
          <MobileNavItem icon={BarChart3} label="Analytics" onClick={() => {
            document.querySelector<HTMLButtonElement>('[data-state][value="analytics"]')?.click();
          }} />
          <button
            onClick={() => setShowAddExpense(true)}
            className="flex flex-col items-center justify-center -mt-5 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-glow"
          >
            <Plus className="h-6 w-6" />
          </button>
          <MobileNavItem icon={Target} label="Budgets" onClick={() => {
            document.querySelector<HTMLButtonElement>('[data-state][value="budgets"]')?.click();
          }} />
          <MobileNavItem icon={PieChart} label="Insights" onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        </div>
      </nav>

      {/* Footer (desktop) */}
      <footer className="border-t border-border/40 mt-auto bg-card/50 hidden md:block">
        <div className="page-container py-4">
          <p className="text-center text-xs text-muted-foreground">
            Your expenses are synced across all your devices.
            <span className="ml-1 text-primary font-medium">Secure and private.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

const MobileNavItem = ({ icon: Icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
    <Icon className="h-5 w-5" />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default Index;
