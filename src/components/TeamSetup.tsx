import { useState } from 'react';
import { useAuction, TEAM_COLORS } from '@/context/AuctionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Users, Crown, Wallet, ArrowRight, Image } from 'lucide-react';
import { Team } from '@/types/auction';
import { getImageByCode } from '@/lib/imageUtils';

const TeamSetup = () => {
  const { teams, setTeams, maxTeamSize, setMaxTeamSize, setStep } = useAuction();
  const [newTeam, setNewTeam] = useState({ name: '', captain: '', budget: 10000, logoCode: '' });

  const addTeam = () => {
    if (!newTeam.name.trim() || !newTeam.captain.trim()) return;
    
    const team: Team = {
      id: `team-${Date.now()}`,
      name: newTeam.name.trim(),
      captain: newTeam.captain.trim(),
      budget: newTeam.budget,
      remainingBudget: newTeam.budget,
      maxSize: maxTeamSize,
      players: [],
      color: TEAM_COLORS[teams.length % TEAM_COLORS.length],
      logoCode: newTeam.logoCode.trim() || undefined,
    };
    
    setTeams(prev => [...prev, team]);
    setNewTeam({ name: '', captain: '', budget: 10000, logoCode: '' });
  };

  const removeTeam = (id: string) => {
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold text-glow mb-2">
          Team Setup
        </h2>
        <p className="text-muted-foreground">
          Configure your teams before the auction begins
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Add Team Card */}
        <Card className="card-stadium">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={newTeam.name}
                onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Mumbai Indians"
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <Label htmlFor="captain">Captain Name</Label>
              <Input
                id="captain"
                value={newTeam.captain}
                onChange={(e) => setNewTeam(prev => ({ ...prev, captain: e.target.value }))}
                placeholder="Rohit Sharma"
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <Label htmlFor="budget">Team Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                value={newTeam.budget}
                onChange={(e) => setNewTeam(prev => ({ ...prev, budget: Number(e.target.value) }))}
                min={1000}
                step={500}
              className="bg-secondary border-border"
              />
            </div>
            <div>
              <Label htmlFor="logoCode" className="flex items-center gap-1">
                <Image className="w-3 h-3" />
                Team Logo Code
              </Label>
              <Input
                id="logoCode"
                value={newTeam.logoCode}
                onChange={(e) => setNewTeam(prev => ({ ...prev, logoCode: e.target.value }))}
                placeholder="e.g. mi, csk, rcb"
                className="bg-secondary border-border"
              />
              {newTeam.logoCode && getImageByCode(newTeam.logoCode) && (
                <div className="mt-2 flex items-center gap-2">
                  <img 
                    src={getImageByCode(newTeam.logoCode)!} 
                    alt="Team logo preview" 
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                  <span className="text-xs text-muted-foreground">Preview</span>
                </div>
              )}
              {newTeam.logoCode && !getImageByCode(newTeam.logoCode) && (
                <p className="text-xs text-destructive mt-1">No image found for "{newTeam.logoCode}"</p>
              )}
            </div>
            <div>
              <Label htmlFor="maxSize">Max Team Size</Label>
              <Input
                id="maxSize"
                type="number"
                value={maxTeamSize}
                onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                min={5}
                max={25}
                className="bg-secondary border-border"
              />
            </div>
            <Button 
              onClick={addTeam} 
              className="w-full btn-auction"
              disabled={!newTeam.name.trim() || !newTeam.captain.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          </CardContent>
        </Card>

        {/* Teams List Card */}
        <Card className="card-stadium">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Teams ({teams.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teams.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No teams added yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {teams.map((team, index) => (
                  <div
                    key={team.id}
                    className="p-4 rounded-lg bg-secondary/50 border border-border flex items-center justify-between group hover:border-primary/50 transition-colors"
                    style={{ borderLeftColor: team.color, borderLeftWidth: '4px' }}
                  >
                    {getImageByCode(team.logoCode) ? (
                      <img 
                        src={getImageByCode(team.logoCode)!} 
                        alt={team.name} 
                        className="w-10 h-10 rounded-full object-cover border border-border flex-shrink-0"
                      />
                    ) : (
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-bold flex-shrink-0"
                        style={{ backgroundColor: team.color + '30', color: team.color }}
                      >
                        {team.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold">{team.name}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          {team.captain}
                        </span>
                        <span className="flex items-center gap-1">
                          <Wallet className="w-3 h-3" />
                          ₹{team.budget.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTeam(team.id)}
                      className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
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

      {teams.length >= 2 && (
        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={() => setStep('players')}
            className="btn-auction bg-primary hover:bg-primary/90 px-8"
          >
            Continue to Add Players
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamSetup;
