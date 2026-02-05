import { useState } from 'react';
import { useAuction } from '@/context/AuctionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, UserPlus, Gavel, ArrowRight, IndianRupee } from 'lucide-react';
import { Player } from '@/types/auction';

const ROLES = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'] as const;
const BASE_PRICES = [150, 200, 300, 400, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000];

const PlayerManagement = () => {
  const { players, setPlayers, basePrice, setBasePrice, bidIncrement, setBidIncrement, setStep } = useAuction();
  const [newPlayer, setNewPlayer] = useState({ name: '', role: 'Batsman' as Player['role'] });
  const [basePriceSet, setBasePriceSet] = useState(players.length > 0);

  const addPlayer = () => {
    if (!newPlayer.name.trim()) return;
    
    const player: Player = {
      id: `player-${Date.now()}`,
      name: newPlayer.name.trim(),
      role: newPlayer.role,
      basePrice: basePrice,
      status: 'available',
    };
    
    setPlayers(prev => [...prev, player]);
    setNewPlayer({ name: '', role: 'Batsman' });
    setBasePriceSet(true);
  };

  const removePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const getRoleColor = (role: Player['role']) => {
    switch (role) {
      case 'Batsman': return 'text-blue-400';
      case 'Bowler': return 'text-red-400';
      case 'All-Rounder': return 'text-purple-400';
      case 'Wicket-Keeper': return 'text-amber-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold text-glow mb-2">
          Player Pool
        </h2>
        <p className="text-muted-foreground">
          Add players to the auction pool with a unified base price
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Base Price Setting */}
        <Card className="card-stadium lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-accent" />
              Auction Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Base Price (₹) - All Players</Label>
              <Select
                value={basePrice.toString()}
                onValueChange={(v) => setBasePrice(Number(v))}
                disabled={basePriceSet}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BASE_PRICES.map(price => (
                    <SelectItem key={price} value={price.toString()}>
                      ₹{price.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {basePriceSet && (
                <p className="text-xs text-muted-foreground mt-1">
                  Base price locked after first player added
                </p>
              )}
            </div>
            
            <div>
              <Label>Bid Increment (₹)</Label>
              <Input
                type="number"
                value={bidIncrement}
                onChange={(e) => setBidIncrement(Number(e.target.value))}
                min={10}
                step={10}
                className="bg-secondary border-border"
              />
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground mb-2">Quick Stats</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <div className="font-display text-lg text-primary">{players.length}</div>
                  <div className="text-muted-foreground text-xs">Players</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <div className="font-display text-lg text-accent">₹{basePrice}</div>
                  <div className="text-muted-foreground text-xs">Base</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Player Card */}
        <Card className="card-stadium lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Add Player
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="playerName">Player Name</Label>
              <Input
                id="playerName"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Virat Kohli"
                className="bg-secondary border-border"
                onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              />
            </div>
            <div>
              <Label>Player Role</Label>
              <Select
                value={newPlayer.role}
                onValueChange={(v) => setNewPlayer(prev => ({ ...prev, role: v as Player['role'] }))}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={addPlayer} 
              className="w-full btn-auction"
              disabled={!newPlayer.name.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </Button>
          </CardContent>
        </Card>

        {/* Players List */}
        <Card className="card-stadium lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Gavel className="w-5 h-5 text-primary" />
              Player Pool ({players.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {players.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No players added yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between group hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{player.name}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={getRoleColor(player.role)}>{player.role}</span>
                        <span className="text-muted-foreground">₹{player.basePrice}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePlayer(player.id)}
                      className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {players.length >= 1 && (
        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={() => setStep('auction')}
            className="btn-auction bg-primary hover:bg-primary/90 px-8"
          >
            Start Auction
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlayerManagement;
