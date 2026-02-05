import { useAuction } from '@/context/AuctionContext';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Gavel, LayoutDashboard } from 'lucide-react';

const Navigation = () => {
  const { step, setStep, teams, players } = useAuction();

  const navItems = [
    { id: 'setup', label: 'Team Setup', icon: Users, disabled: false },
    { id: 'players', label: 'Players', icon: UserPlus, disabled: teams.length === 0 },
    { id: 'auction', label: 'Auction', icon: Gavel, disabled: players.length === 0 },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, disabled: teams.length === 0 },
  ] as const;

  return (
    <nav className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Gavel className="w-8 h-8 text-primary" />
            <h1 className="font-display text-xl font-bold text-glow">
              Cricket Auction
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={step === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStep(item.id)}
                disabled={item.disabled}
                className={`btn-auction ${
                  step === item.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
