import { useState } from 'react';
import { LogOut, BarChart3, Activity, Brain, TrendingUp, PieChart, Bot, FileText, Briefcase } from 'lucide-react';
import logo from '@/assets/logo.png';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AuthForm } from '@/components/AuthForm';
import { LandingPage } from '@/components/LandingPage';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PortfolioInput } from '@/components/PortfolioInput';
import { PortfolioOverview } from '@/components/PortfolioOverview';
import { RiskHeatmap } from '@/components/RiskHeatmap';
import { SectorAllocation } from '@/components/SectorAllocation';
import { AIInsightsPanel } from '@/components/AIInsightsPanel';
import { PortfolioForecast } from '@/components/PortfolioForecast';
import { AIChat } from '@/components/AIChat';
import { PortfolioReport } from '@/components/PortfolioReport';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolio } from '@/hooks/usePortfolio';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, isLoading: authLoading, signOut, isAuthenticated } = useAuth();
  const { holdings, isLoading: portfolioLoading, addHolding, deleteHolding, marketDataMap, analysis } = usePortfolio();

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'Signed out', description: 'You have been signed out successfully.' });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showAuth) return <AuthForm />;
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  if (portfolioLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img src={logo} alt="PortfolioAI" className="h-7 sm:h-9 w-auto flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5">
                  <Brain className="h-4 w-4 text-primary" />
                  Portfolio Intelligence
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate hidden sm:block">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Sign Out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 page-container py-4 sm:py-6 lg:py-8 space-y-5 sm:space-y-6">
        {/* Portfolio Overview */}
        <section className="animate-fade-in-up">
          <PortfolioOverview analysis={analysis} />
        </section>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl h-10 sm:h-11 p-1 bg-muted/50">
            <TabsTrigger value="overview" className="text-xs sm:text-sm font-medium gap-1.5">
              <Briefcase className="h-3.5 w-3.5 hidden sm:block" /> Portfolio
            </TabsTrigger>
            <TabsTrigger value="risk" className="text-xs sm:text-sm font-medium gap-1.5">
              <Activity className="h-3.5 w-3.5 hidden sm:block" /> Risk
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs sm:text-sm font-medium gap-1.5">
              <Brain className="h-3.5 w-3.5 hidden sm:block" /> Insights
            </TabsTrigger>
            <TabsTrigger value="forecast" className="text-xs sm:text-sm font-medium gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 hidden sm:block" /> Forecast
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-xs sm:text-sm font-medium gap-1.5">
              <FileText className="h-3.5 w-3.5 hidden sm:block" /> Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <PortfolioInput holdings={holdings} marketDataMap={marketDataMap} onAdd={addHolding} onDelete={deleteHolding} />
              <SectorAllocation analysis={analysis} />
            </div>
          </TabsContent>

          <TabsContent value="risk" className="mt-0 space-y-5">
            <RiskHeatmap holdings={holdings} marketDataMap={marketDataMap} analysis={analysis} />
          </TabsContent>

          <TabsContent value="insights" className="mt-0 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <AIInsightsPanel holdings={holdings} analysis={analysis} marketDataMap={marketDataMap} />
              <AIChat holdings={holdings} analysis={analysis} />
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="mt-0 space-y-5">
            <PortfolioForecast analysis={analysis} />
          </TabsContent>

          <TabsContent value="reports" className="mt-0 space-y-5">
            <PortfolioReport holdings={holdings} analysis={analysis} marketDataMap={marketDataMap} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/40 md:hidden">
        <div className="flex items-center justify-around py-2 px-2">
          <MobileNavItem icon={Briefcase} label="Portfolio" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <MobileNavItem icon={Activity} label="Risk" active={activeTab === 'risk'} onClick={() => setActiveTab('risk')} />
          <MobileNavItem icon={Brain} label="Insights" active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} />
          <MobileNavItem icon={TrendingUp} label="Forecast" active={activeTab === 'forecast'} onClick={() => setActiveTab('forecast')} />
          <MobileNavItem icon={FileText} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
        </div>
      </nav>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-auto bg-card/50 hidden md:block">
        <div className="page-container py-4">
          <p className="text-center text-xs text-muted-foreground">
            AI-powered portfolio intelligence. <span className="text-primary font-medium">Secure · Private · Encrypted</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

const MobileNavItem = ({ icon: Icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
    <Icon className="h-5 w-5" />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default Index;
