import SavingsCalculator from '../components/SavingsCalculator';
import { useSubscription } from '../hooks/useSubscription';

export default function AppHome() {
  const { sub, loading } = useSubscription();
  const isPaid = sub.status === 'active' || sub.status === 'trialing';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      {/* App Header */}
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Car Deal Coach</h1>
            <p className="opacity-80">Your personal negotiation assistant</p>
          </div>
          <div className="text-right">
            {isPaid && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
                <div className="text-green-400 font-semibold">✓ Active Plan</div>
                <div className="text-sm opacity-80">{sub.tier} subscription</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex gap-4 border-b border-white/10 pb-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Dashboard
          </button>
          <button className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">
            Saved Deals
          </button>
          <button className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">
            Negotiation Scripts
          </button>
          <button className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">
            Red Flag Alerts
          </button>
          <button 
            className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors ml-auto"
            onClick={() => window.location.href = '/pricing'}
          >
            Manage Plan
          </button>
        </nav>
      </header>

      {/* Quick Stats */}
      <section className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">$2,847</div>
          <div className="text-sm opacity-80">Average Savings</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">3</div>
          <div className="text-sm opacity-80">Saved Scenarios</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">12</div>
          <div className="text-sm opacity-80">Days Remaining</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">95%</div>
          <div className="text-sm opacity-80">Success Rate</div>
        </div>
      </section>

      {/* Main Tools */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Tools</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">🧮</div>
            <h3 className="font-semibold mb-2">Payment Calculator</h3>
            <p className="text-sm opacity-80">Calculate true costs and compare financing options</p>
          </div>
          <div className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Negotiation Scripts</h3>
            <p className="text-sm opacity-80">Proven phrases and responses for every situation</p>
          </div>
          <div className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">🚨</div>
            <h3 className="font-semibold mb-2">Red Flag Detector</h3>
            <p className="text-sm opacity-80">Spot dealer tactics and hidden fees instantly</p>
          </div>
        </div>
      </section>

      {/* Savings Calculator - Fully Unlocked */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Savings Calculator</h2>
          <p className="opacity-80">
            Estimate your savings with full access to all features and breakdowns
          </p>
        </div>
        <SavingsCalculator isPaid={isPaid} />
      </section>

      {/* Recent Activity */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="font-medium">2024 Honda Accord scenario saved</div>
              <div className="text-sm opacity-70">Estimated savings: $2,340</div>
            </div>
            <div className="text-sm opacity-70">2 hours ago</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="font-medium">Negotiation script downloaded</div>
              <div className="text-sm opacity-70">Trade-in value maximization</div>
            </div>
            <div className="text-sm opacity-70">1 day ago</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="font-medium">Red flag alert triggered</div>
              <div className="text-sm opacity-70">Extended warranty markup detected</div>
            </div>
            <div className="text-sm opacity-70">3 days ago</div>
          </div>
        </div>
      </section>
    </main>
  );
}
