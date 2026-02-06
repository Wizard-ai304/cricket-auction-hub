import { useState } from 'react';
import { useAuction } from '@/context/AuctionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Gavel, Play, SkipForward, ThumbsDown, Check, X, 
  Users, Wallet, AlertTriangle, Trophy, RotateCcw, TrendingUp
} from 'lucide-react';
import { getImageByCode } from '@/lib/imageUtils';

const AuctionBoard = () => {
  const {
    teams,
    players,
    auctionState,
    basePrice,
    bidIncrement,
    updateBidIncrement,
    startAuction,
    nextPlayer,
    placeBid,
    dropFromBidding,
    sellPlayer,
    markUnsold,
    startUnsoldRound,
  } = useAuction();

  const [animateBid, setAnimateBid] = useState(false);

  const {
    currentPlayer,
    currentBid,
    currentBidder,
    teamsInRotation,
    droppedTeams,
    activeTeamIndex,
    isAuctionActive,
    isPlayerSold,
  } = auctionState;

  const activeTeamIds = teamsInRotation.filter(id => !droppedTeams.includes(id));
  const currentTeamId = activeTeamIds[activeTeamIndex % Math.max(activeTeamIds.length, 1)];
  const currentTeam = teams.find(t => t.id === currentTeamId);

  const availablePlayers = players.filter(p => p.status === 'available');
  const soldPlayers = players.filter(p => p.status === 'sold');
  const unsoldPlayers = players.filter(p => p.status === 'unsold');

  // Calculate max bid for a team: remaining balance - ((player slots - 1) × base price)
  const calculateMaxBid = (team: typeof teams[0]) => {
    const slotsRemaining = team.maxSize - team.players.length;
    const reserveForOtherPlayers = (slotsRemaining - 1) * basePrice;
    return Math.max(0, team.remainingBudget - reserveForOtherPlayers);
  };

  const handleBid = () => {
    setAnimateBid(true);
    placeBid();
    setTimeout(() => setAnimateBid(false), 300);
  };

  const handleBidIncrementChange = (value: string) => {
    const num = parseInt(value) || 0;
    if (num >= 0) {
      updateBidIncrement(num);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Batsman': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Bowler': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'All-Rounder': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Wicket-Keeper': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  // Check if auction is complete
  const isAuctionComplete = availablePlayers.length === 0 && !currentPlayer && !isAuctionActive;

  if (!isAuctionActive && !currentPlayer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-glow mb-2">
            Auction Board
          </h2>
          <p className="text-muted-foreground">
            {isAuctionComplete ? 'Auction Complete!' : 'Ready to start the auction'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="card-stadium text-center">
            <CardContent className="pt-6">
              <div className="font-display text-4xl text-primary mb-1">{availablePlayers.length}</div>
              <div className="text-muted-foreground">Available</div>
            </CardContent>
          </Card>
          <Card className="card-stadium text-center">
            <CardContent className="pt-6">
              <div className="font-display text-4xl text-accent mb-1">{soldPlayers.length}</div>
              <div className="text-muted-foreground">Sold</div>
            </CardContent>
          </Card>
          <Card className="card-stadium text-center">
            <CardContent className="pt-6">
              <div className="font-display text-4xl text-destructive mb-1">{unsoldPlayers.length}</div>
              <div className="text-muted-foreground">Unsold</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          {availablePlayers.length > 0 && (
            <Button size="lg" onClick={startAuction} className="btn-auction bg-primary px-8">
              <Play className="w-5 h-5 mr-2" />
              Start Auction
            </Button>
          )}
          {unsoldPlayers.length > 0 && availablePlayers.length === 0 && (
            <Button size="lg" onClick={startUnsoldRound} className="btn-auction bg-accent text-accent-foreground px-8">
              <RotateCcw className="w-5 h-5 mr-2" />
              Re-Auction Unsold ({unsoldPlayers.length})
            </Button>
          )}
          {isAuctionComplete && unsoldPlayers.length === 0 && (
            <div className="text-center">
              <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="font-display text-2xl text-accent text-gold-glow">Auction Complete!</h3>
              <p className="text-muted-foreground mt-2">All players have been sold</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current Player Card */}
        <Card className="card-stadium lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Gavel className="w-5 h-5 text-primary" />
              Current Auction
              {currentPlayer?.isUnsoldRound && (
                <Badge variant="outline" className="ml-2 border-destructive text-destructive">
                  UNSOLD ROUND
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentPlayer && (
              <div className="space-y-6">
                {/* Player Info */}
                <div className={`player-card p-6 text-center ${isPlayerSold ? 'sold' : ''}`}>
                  {getImageByCode(currentPlayer.imageCode) ? (
                    <img 
                      src={getImageByCode(currentPlayer.imageCode)!} 
                      alt={currentPlayer.name} 
                      className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-2 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                    />
                  ) : (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center text-3xl font-display font-bold text-primary">
                      {currentPlayer.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="font-display text-2xl font-bold mb-2">{currentPlayer.name}</h3>
                  <Badge className={`${getRoleColor(currentPlayer.role)} border`}>
                    {currentPlayer.role}
                  </Badge>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Base Price: ₹{currentPlayer.basePrice.toLocaleString()}
                  </div>
                </div>

                {/* Current Bid Display */}
                <div className="text-center py-6 bg-secondary/30 rounded-xl">
                  <div className="text-muted-foreground text-sm mb-1">CURRENT BID</div>
                  <div className={`bid-display ${animateBid ? 'animate-bid' : ''}`}>
                    ₹{currentBid.toLocaleString()}
                  </div>
                  {currentBidder && (
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: currentBidder.color }}
                      />
                      <span className="font-medium">{currentBidder.name}</span>
                    </div>
                  )}
                </div>

                {/* Bid Increment Control */}
                <div className="flex items-center justify-center gap-3 p-3 bg-secondary/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Bid Increment:</span>
                  <Input
                    type="number"
                    value={bidIncrement}
                    onChange={(e) => handleBidIncrementChange(e.target.value)}
                    className="w-28 h-8 text-center font-display"
                    min={1}
                  />
                </div>

                {/* Action Buttons */}
                {!isPlayerSold ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        size="lg"
                        onClick={handleBid}
                        disabled={!currentTeam || currentTeam.remainingBudget < currentBid}
                        className="btn-auction bg-primary hover:bg-primary/90"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Bid ₹{(currentBidder ? currentBid + auctionState.bidIncrement : currentBid).toLocaleString()}
                      </Button>
                      <Button
                        size="lg"
                        variant="destructive"
                        onClick={dropFromBidding}
                        className="btn-auction"
                      >
                        <ThumbsDown className="w-5 h-5 mr-2" />
                        Drop
                      </Button>
                    </div>
                    
                    {/* Sell & Unsold Buttons */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                      <Button
                        size="lg"
                        onClick={sellPlayer}
                        disabled={!currentBidder}
                        className="btn-auction bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <Gavel className="w-5 h-5 mr-2" />
                        Sell
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={markUnsold}
                        className="btn-auction border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Unsold
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-2xl font-display text-accent text-gold-glow mb-4">
                      SOLD to {currentBidder?.name}!
                    </div>
                    <Button size="lg" onClick={nextPlayer} className="btn-auction bg-primary">
                      <SkipForward className="w-5 h-5 mr-2" />
                      Next Player
                    </Button>
                  </div>
                )}

              </div>
            )}
          </CardContent>
        </Card>

        {/* Teams Rotation Panel */}
        <Card className="card-stadium">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Bidding Rotation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamsInRotation.map((teamId, index) => {
                const team = teams.find(t => t.id === teamId);
                if (!team) return null;

                const isDropped = droppedTeams.includes(teamId);
                const isActive = teamId === currentTeamId && !isPlayerSold;
                const isFull = team.players.length >= team.maxSize;
                const canAfford = team.remainingBudget >= currentBid;

                return (
                  <div
                    key={teamId}
                    className={`p-3 rounded-lg border transition-all ${
                      isActive 
                        ? 'bg-primary/20 border-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]' 
                        : isDropped 
                          ? 'bg-secondary/30 border-border opacity-50' 
                          : 'bg-secondary/50 border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={`rotation-indicator ${
                          isActive ? 'active' : isDropped ? 'dropped' : 'waiting'
                        }`}
                      />
                      {getImageByCode(team.logoCode) ? (
                        <img 
                          src={getImageByCode(team.logoCode)!} 
                          alt={team.name} 
                          className="w-8 h-8 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: team.color + '30', color: team.color }}
                        >
                          {team.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{team.name}</span>
                          {isFull && (
                            <Badge variant="outline" className="text-xs border-accent text-accent">
                              FULL
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Wallet className="w-3 h-3" />
                          ₹{team.remainingBudget.toLocaleString()}
                          {!canAfford && !isDropped && (
                            <AlertTriangle className="w-3 h-3 text-destructive" />
                          )}
                        </div>
                        <div className="text-xs text-accent mt-1">
                          Max Bid: ₹{calculateMaxBid(team).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {team.players.length}/{team.maxSize}
                      </div>
                    </div>
                    {isDropped && (
                      <div className="mt-2 text-xs text-destructive flex items-center gap-1">
                        <X className="w-3 h-3" />
                        Dropped from this round
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-secondary/50 rounded-lg p-2">
                  <div className="font-display text-lg text-primary">{availablePlayers.length}</div>
                  <div className="text-muted-foreground text-xs">Left</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2">
                  <div className="font-display text-lg text-accent">{soldPlayers.length}</div>
                  <div className="text-muted-foreground text-xs">Sold</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2">
                  <div className="font-display text-lg text-destructive">{unsoldPlayers.length}</div>
                  <div className="text-muted-foreground text-xs">Unsold</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuctionBoard;
