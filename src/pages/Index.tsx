import { AuctionProvider, useAuction } from '@/context/AuctionContext';
import Navigation from '@/components/Navigation';
import TeamSetup from '@/components/TeamSetup';
import PlayerManagement from '@/components/PlayerManagement';
import AuctionBoard from '@/components/AuctionBoard';
import TeamDashboard from '@/components/TeamDashboard';

const AuctionApp = () => {
  const { step } = useAuction();

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {step === 'setup' && <TeamSetup />}
        {step === 'players' && <PlayerManagement />}
        {step === 'auction' && <AuctionBoard />}
        {step === 'dashboard' && <TeamDashboard />}
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <AuctionProvider>
      <AuctionApp />
    </AuctionProvider>
  );
};

export default Index;
