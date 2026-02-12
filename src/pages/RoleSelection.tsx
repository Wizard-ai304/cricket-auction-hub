import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Eye } from 'lucide-react';
import { toast } from 'sonner';

const RoleSelection = () => {
  const [loading, setLoading] = useState(false);
  const { setUserRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = async (role: 'host' | 'viewer') => {
    setLoading(true);
    try {
      await setUserRole(role);
      toast.success(`Welcome, ${role}!`);
      navigate(role === 'host' ? '/' : '/viewer');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Select Your Role</h1>
        <p className="text-muted-foreground text-center mb-8">
          Choose whether you want to host or view the auction
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Host Card */}
          <Card className="border-2 border-border hover:border-primary transition p-8 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <Users className="w-16 h-16 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-2">Host</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Manage teams, players, and run the auction
              </p>
              <Button
                onClick={() => handleRoleSelect('host')}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Loading...' : 'Continue as Host'}
              </Button>
            </div>
          </Card>

          {/* Viewer Card */}
          <Card className="border-2 border-border hover:border-primary transition p-8 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <Eye className="w-16 h-16 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-2">Viewer</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Watch auction, view dashboard, and chat with others
              </p>
              <Button
                onClick={() => handleRoleSelect('viewer')}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Loading...' : 'Continue as Viewer'}
              </Button>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default RoleSelection;
