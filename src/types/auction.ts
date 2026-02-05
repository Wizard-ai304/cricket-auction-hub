export interface Player {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';
  basePrice: number;
  soldPrice?: number;
  soldTo?: string;
  status: 'available' | 'sold' | 'unsold';
  isUnsoldRound?: boolean;
}

export interface Team {
  id: string;
  name: string;
  captain: string;
  budget: number;
  remainingBudget: number;
  maxSize: number;
  players: Player[];
  color: string;
}

export interface AuctionState {
  currentPlayer: Player | null;
  currentBid: number;
  currentBidder: Team | null;
  bidIncrement: number;
  teamsInRotation: string[];
  droppedTeams: string[];
  activeTeamIndex: number;
  isAuctionActive: boolean;
  isPlayerSold: boolean;
}

export type AppStep = 'setup' | 'players' | 'auction' | 'dashboard';
