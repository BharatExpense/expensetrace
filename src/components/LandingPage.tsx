import { ArrowRight, BarChart3, Shield, TrendingUp, Star, Check, X, Zap, Brain, Activity, Target, PieChart, Bot, FileText, Lock, LineChart } from 'lucide-react';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const features = [
    { icon: PieChart, title: 'Portfolio Analytics', description: 'Track holdings, sector allocation, and concentration risk with real-time data.' },
    { icon: Brain, title: 'AI Insights Engine', description: 'Get explainable, data-driven recommendations to optimize your portfolio.' },
    { icon: Activity, title: 'Risk Heatmap', description: 'Visualize risk across holdings with beta analysis and volatility metrics.' },
    { icon: LineChart, title: 'Portfolio Forecasting', description: 'Monte Carlo projections showing potential growth scenarios over 12 months.' },
    { icon: Bot, title: 'AI Financial Chat', description: 'Ask questions about your portfolio and get instant, contextual advice.' },
    { icon: FileText, title: 'Intelligence Reports', description: 'Generate downloadable reports with performance, risk, and AI recommendations.' },
    { icon: Shield, title: 'Risk Analysis', description: 'Diversification scoring, concentration risk, and sector exposure analysis.' },
    { icon: TrendingUp, title: 'Market Integration', description: 'Real-time market data with price tracking and beta calculations.' },
    { icon: Lock, title: 'Bank-Grade Security', description: 'Your portfolio data is encrypted end-to-end. We never share your information.' },
  ];

  const testimonials = [
    { name: 'Rahul Mehra', role: 'Retail Investor', review: 'The AI insights helped me identify that 52% of my portfolio was in tech. After diversifying, my Sharpe ratio improved significantly.' },
    { name: 'Sarah Chen', role: 'Day Trader', review: 'The risk heatmap is incredible. I can instantly see which positions are dragging my portfolio and make informed decisions.' },
    { name: 'Michael Park', role: 'Financial Advisor', review: 'I use this for my clients. The AI reports are professional enough to share, and the diversification analysis saves me hours.' },
    { name: 'Priya Sharma', role: 'Index Investor', review: "Finally a tool that explains WHY my portfolio is risky, not just that it is. The AI chat feels like talking to a real advisor." },
    { name: 'James Wilson', role: 'Swing Trader', review: 'The portfolio forecasting helped me understand my downside risk. Adjusted my positions and slept better at night.' },
    { name: 'Aisha Khan', role: 'New Investor', review: "As a beginner, the AI explains everything clearly. It told me my portfolio was too concentrated and suggested ETFs to fix it." },
  ];

  const comparison = [
    { name: 'Portfolio tracking', free: true, pro: true },
    { name: 'Holdings (max)', free: '10', pro: 'Unlimited' },
    { name: 'Sector allocation chart', free: true, pro: true },
    { name: 'Risk & diversification scores', free: true, pro: true },
    { name: 'Risk heatmap', free: false, pro: true },
    { name: 'AI insights panel', free: '3/day', pro: 'Unlimited' },
    { name: 'AI financial assistant chat', free: false, pro: true },
    { name: 'Portfolio forecasting', free: false, pro: true },
    { name: 'Intelligence reports (CSV/PDF)', free: false, pro: true },
    { name: 'Real-time market data', free: 'Delayed', pro: 'Real-time' },
    { name: 'Priority support', free: false, pro: true },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="page-container py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="PortfolioAI" className="h-8 sm:h-10 w-auto" />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" onClick={onGetStarted} className="font-medium">Sign In</Button>
            <Button size="sm" onClick={onGetStarted} className="font-semibold gap-1.5">
              Start Free <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="page-container py-20 sm:py-28 md:py-36 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/80 text-accent-foreground text-xs sm:text-sm font-medium animate-fade-in backdrop-blur-sm border border-accent-foreground/10 mb-6">
            <Brain className="h-3.5 w-3.5 text-primary" />
            AI-Powered Portfolio Intelligence
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight text-balance animate-fade-in-up max-w-4xl mx-auto">
            AI Portfolio Intelligence for{' '}
            <span className="gradient-text">Smarter Investing</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6 text-pretty animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Analyze your portfolio with AI. Get risk scores, diversification insights, sector analysis, and actionable recommendations — all in one intelligent dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <Button onClick={onGetStarted} size="lg" className="gap-2 font-semibold hover-lift h-12 px-8">
              Analyze My Portfolio <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="font-medium hover-lift h-12 px-8" onClick={onGetStarted}>
              Try Demo
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Free portfolio analysis</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Bank-grade encryption</span>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="relative mt-16 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-3xl scale-95" />
            <div className="relative glass-card-elevated p-6 sm:p-8 rounded-2xl">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Portfolio Value', value: '$142,580', change: '+12.4%' },
                  { label: 'Risk Score', value: '38/100', change: 'Low Risk' },
                  { label: 'AI Insights', value: '5 Active', change: 'View All' },
                ].map(item => (
                  <div key={item.label} className="bg-muted/30 rounded-xl p-3 sm:p-4 text-left">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm sm:text-lg font-bold text-foreground mt-0.5">{item.value}</p>
                    <p className="text-[10px] sm:text-xs text-primary font-medium">{item.change}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/20 rounded-xl p-4 h-32 flex items-center justify-center border border-border/20">
                  <div className="text-center space-y-1">
                    <PieChart className="h-8 w-8 text-primary mx-auto opacity-50" />
                    <p className="text-xs text-muted-foreground">Sector Allocation</p>
                  </div>
                </div>
                <div className="bg-muted/20 rounded-xl p-4 h-32 flex items-center justify-center border border-border/20">
                  <div className="text-center space-y-1">
                    <Activity className="h-8 w-8 text-primary mx-auto opacity-50" />
                    <p className="text-xs text-muted-foreground">Risk Heatmap</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-semibold uppercase tracking-wider">
                <Target className="h-3.5 w-3.5" /> The Problem
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight text-balance">
                Most investors fly blind with their portfolios
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Retail investors and small traders lack access to institutional-grade portfolio analysis. Without understanding risk, concentration, and sector exposure, poor diversification leads to unnecessary losses.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '72%', label: 'of retail investors are over-concentrated in 1-2 sectors' },
                { stat: '85%', label: "don't know their portfolio's risk score" },
                { stat: '$4.2K', label: 'average annual loss from poor diversification' },
                { stat: '91%', label: 'would rebalance if they had better tools' },
              ].map(item => (
                <Card key={item.label} className="glass-card p-4 sm:p-5 text-center">
                  <CardContent className="p-0">
                    <p className="text-2xl sm:text-3xl font-bold gradient-text">{item.stat}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 sm:py-24">
        <div className="page-container text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5" /> The Solution
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-balance max-w-3xl mx-auto">
            Institutional-grade portfolio analysis, <span className="gradient-text">powered by AI</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Upload your portfolio and get instant risk analysis, diversification scores, sector breakdowns, and AI-powered recommendations — no finance degree required.
          </p>
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 pt-8">
            {[
              { icon: Activity, title: 'Analyze Risk', desc: 'Risk heatmaps, beta analysis, and volatility estimation for every holding.' },
              { icon: Brain, title: 'AI Insights', desc: 'Natural language explanations of portfolio health with actionable recommendations.' },
              { icon: LineChart, title: 'Forecast Growth', desc: 'Monte Carlo simulations showing best, expected, and worst-case scenarios.' },
            ].map(s => (
              <Card key={s.title} className="glass-card-elevated hover-lift p-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="page-container">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Everything you need for portfolio intelligence
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Professional-grade tools designed for retail investors and small traders.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {features.map((f, i) => (
              <Card key={f.title} className="glass-card-elevated hover-lift border-border/40 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <CardContent className="p-5 sm:p-6 space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16 sm:py-24">
        <div className="page-container">
          <div className="glass-card-elevated p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
            <div className="relative">
              <Lock className="h-12 w-12 text-primary mx-auto mb-4 opacity-70" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Bank-Grade Security</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                Your portfolio data is encrypted with 256-bit AES encryption. We use SOC 2 compliant infrastructure. Your data is never shared or sold.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                {['256-bit Encryption', 'SOC 2 Compliant', 'GDPR Ready', 'Zero Data Sharing'].map(item => (
                  <span key={item} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/30">
                    <Shield className="h-3.5 w-3.5 text-primary" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-24 bg-muted/30" id="pricing">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">Start free. Upgrade when you need deeper intelligence.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            <Card className="glass-card-elevated p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Free</h3>
                <p className="text-muted-foreground text-sm mt-1">Get started with portfolio analysis</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {['10 holdings', 'Sector allocation', 'Risk scoring', 'Basic analytics', '3 AI insights/day'].map(f => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Button variant="outline" className="w-full font-semibold h-11" onClick={onGetStarted}>Get Started</Button>
            </Card>

            <Card className="glass-card-elevated p-6 sm:p-8 space-y-6 relative border-primary/40 ring-2 ring-primary/20">
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">POPULAR</div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Pro</h3>
                <p className="text-muted-foreground text-sm mt-1">Full portfolio intelligence suite</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold gradient-text">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2.5 text-sm text-foreground">
                {['Unlimited holdings', 'Risk heatmap', 'AI financial assistant', 'Portfolio forecasting', 'Intelligence reports', 'Real-time market data', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Button className="w-full font-semibold h-11 gap-2" onClick={onGetStarted}>
                Upgrade to Pro
              </Button>
            </Card>
          </div>

          {/* Comparison */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground text-center mb-6">Detailed Comparison</h3>
            <Card className="glass-card-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left p-3 sm:p-4 font-semibold text-foreground">Feature</th>
                      <th className="text-center p-3 sm:p-4 font-semibold text-foreground w-24">Free</th>
                      <th className="text-center p-3 sm:p-4 font-semibold text-primary w-24">Pro ✨</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((f, i) => (
                      <tr key={f.name} className={`border-b border-border/20 ${i % 2 === 0 ? 'bg-muted/10' : ''}`}>
                        <td className="p-3 sm:p-4 text-foreground">{f.name}</td>
                        <td className="p-3 sm:p-4 text-center">
                          {typeof f.free === 'boolean' ? (
                            f.free ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                          ) : <span className="text-muted-foreground text-xs font-medium">{f.free}</span>}
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          {typeof f.pro === 'boolean' ? (
                            f.pro ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                          ) : <span className="font-semibold text-foreground text-xs">{f.pro}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by investors worldwide</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">See how our AI helps investors make smarter decisions.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {testimonials.map((t, i) => (
              <Card key={t.name} className="glass-card-elevated hover-lift animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.review}"</p>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="page-container">
          <Card className="glass-card-elevated overflow-hidden">
            <CardContent className="p-8 sm:p-12 lg:p-16 text-center space-y-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                  Ready to invest smarter?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join thousands of investors using AI to analyze and optimize their portfolios. Start your free analysis today.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={onGetStarted} size="lg" className="gap-2 font-semibold hover-lift h-12 px-8">
                    Analyze My Portfolio <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 sm:py-8 bg-card/50">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <img src={logo} alt="PortfolioAI" className="h-7 sm:h-8 w-auto opacity-70" />
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
              © {new Date().getFullYear()} PortfolioAI. Your portfolio data stays private and secure.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
