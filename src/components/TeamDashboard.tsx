import { useAuction } from '@/context/AuctionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Wallet, Users, TrendingUp } from 'lucide-react';

const TeamDashboard = () => {
  const { teams, players } = useAuction();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Batsman': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Bowler': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'All-Rounder': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Wicket-Keeper': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const totalSpent = teams.reduce((acc, team) => acc + (team.budget - team.remainingBudget), 0);
  const totalPlayers = teams.reduce((acc, team) => acc + team.players.length, 0);
  const unsoldPlayers = players.filter(p => p.status === 'unsold');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold text-glow mb-2">
          Team Dashboard
        </h2>
        <p className="text-muted-foreground">
          Overview of all teams and their squad compositions
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="card-stadium text-center">
          <CardContent className="pt-6">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="font-display text-3xl text-primary mb-1">{teams.length}</div>
            <div className="text-muted-foreground text-sm">Teams</div>
          </CardContent>
        </Card>
        <Card className="card-stadium text-center">
          <CardContent className="pt-6">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent" />
            <div className="font-display text-3xl text-accent mb-1">{totalPlayers}</div>
            <div className="text-muted-foreground text-sm">Players Bought</div>
          </CardContent>
        </Card>
        <Card className="card-stadium text-center">
          <CardContent className="pt-6">
            <Wallet className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="font-display text-2xl text-primary mb-1">₹{totalSpent.toLocaleString()}</div>
            <div className="text-muted-foreground text-sm">Total Spent</div>
          </CardContent>
        </Card>
        <Card className="card-stadium text-center">
          <CardContent className="pt-6">
            <Badge variant="outline" className="text-destructive border-destructive mb-2">UNSOLD</Badge>
            <div className="font-display text-3xl text-destructive mb-1">{unsoldPlayers.length}</div>
            <div className="text-muted-foreground text-sm">Unsold Players</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {teams.map((team) => {
          const spent = team.budget - team.remainingBudget;
          const isFull = team.players.length >= team.maxSize;
          
          return (
            <Card 
              key={team.id} 
              className="card-stadium overflow-hidden"
              style={{ borderTopColor: team.color, borderTopWidth: '4px' }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-display font-bold"
                      style={{ backgroundColor: team.color + '30', color: team.color }}
                    >
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="font-display text-lg">{team.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Crown className="w-3 h-3 text-accent" />
                        {team.captain}
                      </div>
                    </div>
                  </div>
                  {isFull && (
                    <Badge className="bg-accent/20 text-accent border border-accent/50">
                      FULL
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Budget Info */}
                <div className="flex justify-between items-center mb-4 p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <div className="text-xs text-muted-foreground">Remaining</div>
                    <div className="font-display text-xl text-primary">
                      ₹{team.remainingBudget.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Spent</div>
                    <div className="font-display text-lg text-accent">
                      ₹{spent.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Squad Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Squad</span>
                    <span className="font-medium">{team.players.length}/{team.maxSize}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(team.players.length / team.maxSize) * 100}%`,
                        backgroundColor: team.color
                      }}
                    />
                  </div>
                </div>

                {/* Players List */}
                {team.players.length > 0 ? (
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {team.players.map((player, idx) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg text-sm animate-slide-in"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                            {idx + 1}
                          </span>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`${getRoleColor(player.role)} text-xs border`}
                          >
                            {player.role.slice(0, 3)}
                          </Badge>
                          <span className="text-accent font-display text-xs">
                            ₹{player.soldPrice?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No players yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Unsold Players Section */}
      {unsoldPlayers.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-xl font-bold text-destructive mb-4 flex items-center gap-2">
            <Badge variant="outline" className="border-destructive text-destructive">
              UNSOLD
            </Badge>
            Players ({unsoldPlayers.length})
          </h3>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            {unsoldPlayers.map((player) => (
              <div
                key={player.id}
                className="player-card unsold p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center text-destructive font-display font-bold">
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <Badge 
                      variant="outline" 
                      className={`${getRoleColor(player.role)} text-xs border mt-1`}
                    >
                      {player.role}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDashboard;
