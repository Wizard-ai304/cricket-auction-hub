import { useAuction } from '@/context/AuctionContext';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import AuctionBoard from '@/components/AuctionBoard';
import TeamDashboard from '@/components/TeamDashboard';
import PlayerManagement from '@/components/PlayerManagement';
import ViewerChat from '@/components/ViewerChat';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ViewerDashboard = () => {
  const { step, setStep } = useAuction();
  const { signOut } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen">
      <nav className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold text-primary">
              Cricket Auction - Viewer
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Viewer Navigation */}
          <div className="flex gap-2 border-b border-border pb-4">
            <Button
              variant={step === 'auction' ? 'default' : 'outline'}
              onClick={() => setStep('auction')}
            >
              Live Auction
            </Button>
            <Button
              variant={step === 'players' ? 'default' : 'outline'}
              onClick={() => setStep('players')}
            >
              Player List
            </Button>
            <Button
              variant={step === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setStep('dashboard')}
            >
              Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 'auction' && <AuctionBoard />}
              {step === 'players' && <PlayerManagement />}
              {step === 'dashboard' && <TeamDashboard />}
            </div>

            {/* Chat Sidebar */}
            <div className="lg:col-span-1">
              <ViewerChat />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewerDashboard;
