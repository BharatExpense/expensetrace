import { ArrowRight, BarChart3, Shield, Wallet, Globe, TrendingUp, Star, Check, X, Zap, Eye, Target, AlertTriangle, Lightbulb, CreditCard, Users, FileText, Cloud } from 'lucide-react';
import logo from '@/assets/logo.png';
import heroIllustration from '@/assets/hero-illustration.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const features = [
    { icon: Wallet, title: 'Track Expenses', description: 'Log and categorize daily expenses with a simple, intuitive interface.' },
    { icon: BarChart3, title: 'Visual Analytics', description: 'Understand spending patterns with beautiful charts and breakdowns.' },
    { icon: TrendingUp, title: 'Budget Management', description: 'Set spending limits by category and get alerts when approaching your budget.' },
    { icon: Globe, title: 'Multi-Currency', description: 'Support for 20+ currencies with built-in converter for international tracking.' },
    { icon: Shield, title: 'Secure & Private', description: 'Your financial data is encrypted and synced securely across all devices.' },
    { icon: Lightbulb, title: 'Smart Insights', description: 'AI-powered suggestions to optimize your spending and save more money.' },
  ];

  const testimonials = [
    { name: 'Sarah Mitchell', role: 'Freelancer', review: 'ExpenseTrace completely changed how I manage my money. The visual analytics helped me cut unnecessary spending by 30%!' },
    { name: 'James Rodriguez', role: 'Business Owner', review: 'The multi-currency support is a game changer for working with international clients. Highly recommended!' },
    { name: 'Priya Sharma', role: 'Student', review: "Simple, beautiful, and effective. The budget alerts keep me accountable. Best expense app I've used." },
    { name: 'David Chen', role: 'Software Engineer', review: "Finally an expense tracker that doesn't feel overwhelming. The clean interface makes it easy to log expenses on the go." },
    { name: 'Emily Watson', role: 'Marketing Manager', review: 'The category breakdowns and charts are incredibly insightful. I now have a clear picture of where every dollar goes.' },
    { name: 'Omar Al-Rashid', role: 'Consultant', review: "ExpenseTrace stands out with its privacy-first approach and seamless syncing across devices." },
  ];

  const comparisonFeatures = [
    { name: 'Monthly transactions', free: '50', pro: 'Unlimited' },
    { name: 'Expense categories', free: '8', pro: 'Custom + 8' },
    { name: 'Basic analytics', free: true, pro: true },
    { name: 'Advanced charts & reports', free: false, pro: true },
    { name: 'Export (CSV/PDF)', free: false, pro: true },
    { name: 'Budget alerts', free: true, pro: true },
    { name: 'Smart AI insights', free: false, pro: true },
    { name: 'Cloud backup & sync', free: false, pro: true },
    { name: 'Unlimited projects', free: false, pro: true },
    { name: 'Priority support', free: false, pro: true },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="page-container py-3 sm:py-4 flex items-center justify-between">
          <img src={logo} alt="ExpenseTrace" className="h-8 sm:h-10 w-auto" />
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

        <div className="page-container py-16 sm:py-20 md:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/80 text-accent-foreground text-xs sm:text-sm font-medium animate-fade-in backdrop-blur-sm border border-accent-foreground/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Smart expense tracking made simple
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight text-balance animate-fade-in-up">
                Take Control of Your{' '}
                <span className="gradient-text">Finances</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                Track expenses, manage budgets, and gain AI-powered insights into your spending habits. All in one beautiful application.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <Button onClick={onGetStarted} size="lg" className="gap-2 font-semibold hover-lift h-12 px-8">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="font-medium hover-lift h-12 px-8" onClick={onGetStarted}>
                  Try Demo
                </Button>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
                ✓ No credit card required • ✓ Free forever plan available
              </p>
            </div>

            <div className="relative hidden lg:block animate-scale-in" style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl transform scale-95" />
              <div className="relative animate-float">
                <img src={heroIllustration} alt="ExpenseTrace Dashboard Preview" className="w-full h-auto rounded-2xl shadow-2xl border border-border/30" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/15 rounded-full blur-2xl animate-pulse-soft" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/40 rounded-full blur-2xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-semibold uppercase tracking-wider">
                <AlertTriangle className="h-3.5 w-3.5" />
                The Problem
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight text-balance">
                People don't know where their money goes every month
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Most people have no idea how much they spend on food, transport, or subscriptions. Without visibility, overspending becomes a habit — and savings become impossible.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '78%', label: 'of people live paycheck to paycheck' },
                { stat: '₹15K+', label: 'wasted monthly on untracked expenses' },
                { stat: '60%', label: "don't know their top spending category" },
                { stat: '3 in 4', label: 'have no monthly budget plan' },
              ].map((item) => (
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

      {/* Solution Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-container text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Target className="h-3.5 w-3.5" />
            The Solution
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-balance max-w-3xl mx-auto">
            ExpenseTrace helps you track and analyze expenses <span className="gradient-text">effortlessly</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Log expenses in seconds, see exactly where your money goes, and get smart suggestions to save more — all from one clean dashboard.
          </p>
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 pt-8">
            {[
              { icon: Eye, title: 'See Everything', desc: 'Visual dashboards show your spending at a glance with category breakdowns.' },
              { icon: Zap, title: 'Act Faster', desc: 'Smart insights tell you exactly where to cut back and how much you can save.' },
              { icon: Target, title: 'Hit Goals', desc: 'Budget limits and alerts keep you on track toward your financial goals.' },
            ].map((s) => (
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

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="page-container">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Everything you need to manage expenses
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you understand and optimize your spending.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {features.map((feature, index) => (
              <Card key={feature.title} className="glass-card-elevated hover-lift border-border/40 animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
                <CardContent className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing with Comparison Table */}
      <section className="py-16 sm:py-20 lg:py-24" id="pricing">
        <div className="page-container">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Start free and upgrade when you need more. No hidden fees.
            </p>
          </div>

          {/* Plan Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {/* Free Plan */}
            <Card className="glass-card-elevated p-6 sm:p-8 space-y-6 relative">
              <div>
                <h3 className="text-xl font-bold text-foreground">Free</h3>
                <p className="text-muted-foreground text-sm mt-1">Perfect for getting started</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">₹0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Button variant="outline" className="w-full font-semibold h-11" onClick={onGetStarted}>
                Get Started
              </Button>
            </Card>

            {/* Pro Plan */}
            <Card className="glass-card-elevated p-6 sm:p-8 space-y-6 relative border-primary/40 ring-2 ring-primary/20">
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                POPULAR
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Pro</h3>
                <p className="text-muted-foreground text-sm mt-1">For serious budgeters</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold gradient-text">₹299</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Button className="w-full font-semibold h-11 gap-2" onClick={onGetStarted}>
                <CreditCard className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            </Card>
          </div>

          {/* Comparison Table */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground text-center mb-6">Feature Comparison</h3>
            <Card className="glass-card-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-3 sm:p-4 font-semibold text-foreground">Feature</th>
                      <th className="text-center p-3 sm:p-4 font-semibold text-foreground w-24">Free</th>
                      <th className="text-center p-3 sm:p-4 font-semibold text-primary w-24">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((f, i) => (
                      <tr key={f.name} className={i % 2 === 0 ? 'bg-muted/20' : ''}>
                        <td className="p-3 sm:p-4 text-foreground">{f.name}</td>
                        <td className="p-3 sm:p-4 text-center">
                          {typeof f.free === 'boolean' ? (
                            f.free ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">{f.free}</span>
                          )}
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          {typeof f.pro === 'boolean' ? (
                            f.pro ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                          ) : (
                            <span className="font-medium text-foreground">{f.pro}</span>
                          )}
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
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="page-container">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Loved by thousands of users
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              See what our community says about managing their finances with ExpenseTrace.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="glass-card-elevated hover-lift border-border/40 animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed italic">
                    "{testimonial.review}"
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Features Teaser */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-container text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Coming Soon
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're building the future of personal finance management.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            {[
              { icon: FileText, title: 'Receipt Scanner', desc: 'Snap a photo, auto-log expense' },
              { icon: Users, title: 'Split Expenses', desc: 'Share costs with friends easily' },
              { icon: Target, title: 'Financial Goals', desc: 'Set and track savings targets' },
              { icon: Zap, title: 'AI Assistant', desc: 'Personalized spending advisor' },
            ].map((item) => (
              <Card key={item.title} className="glass-card p-5 text-center opacity-80">
                <CardContent className="p-0 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="page-container">
          <Card className="glass-card-elevated overflow-hidden border-border/40">
            <CardContent className="p-8 sm:p-12 lg:p-16 text-center space-y-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                  Ready to take control of your finances?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join thousands who track their expenses smarter with ExpenseTrace. Start for free today.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={onGetStarted} size="lg" className="gap-2 font-semibold hover-lift h-12 px-8">
                    Start Free Now <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="font-medium hover-lift h-12 px-8" onClick={onGetStarted}>
                    Try Demo
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
            <img src={logo} alt="ExpenseTrace" className="h-7 sm:h-8 w-auto opacity-70" />
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
              © {new Date().getFullYear()} ExpenseTrace. Your data stays private and secure.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
