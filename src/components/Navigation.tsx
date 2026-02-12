import { useAuction } from '@/context/AuctionContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Gavel, LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Navigation = () => {
  const { step, setStep, teams, players } = useAuction();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { id: 'setup', label: 'Team Setup', icon: Users, disabled: false },
    { id: 'players', label: 'Players', icon: UserPlus, disabled: teams.length === 0 },
    { id: 'auction', label: 'Auction', icon: Gavel, disabled: players.length === 0 },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, disabled: teams.length === 0 },
  ] as const;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

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
            
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground ml-4"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
