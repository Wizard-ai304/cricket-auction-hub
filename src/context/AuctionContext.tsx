import React, { createContext, useContext, useState, useCallback } from 'react';
import { Player, Team, AuctionState, AppStep } from '@/types/auction';

interface AuctionContextType {
  step: AppStep;
  setStep: (step: AppStep) => void;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  basePrice: number;
  setBasePrice: (price: number) => void;
  bidIncrement: number;
  setBidIncrement: (increment: number) => void;
  updateBidIncrement: (increment: number) => void;
  maxTeamSize: number;
  setMaxTeamSize: (size: number) => void;
  auctionState: AuctionState;
  setAuctionState: React.Dispatch<React.SetStateAction<AuctionState>>;
  startAuction: () => void;
  nextPlayer: () => void;
  placeBid: () => void;
  bidByTeam: (teamId: string) => void;
  dropFromBidding: () => void;
  sellPlayer: () => void;
  markUnsold: () => void;
  startUnsoldRound: () => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

const TEAM_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
];

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState<AppStep>('setup');
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [basePrice, setBasePrice] = useState<number>(500);
  const [bidIncrement, setBidIncrement] = useState<number>(50);
  const [maxTeamSize, setMaxTeamSize] = useState<number>(11);
  
  const [auctionState, setAuctionState] = useState<AuctionState>({
    currentPlayer: null,
    currentBid: 0,
    currentBidder: null,
    bidIncrement: 50,
    teamsInRotation: [],
    droppedTeams: [],
    activeTeamIndex: 0,
    isAuctionActive: false,
    isPlayerSold: false,
  });

  const getAvailableTeams = useCallback(() => {
    return teams.filter(t => t.players.length < t.maxSize);
  }, [teams]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getNextAvailablePlayer = useCallback((unsoldRound: boolean = false) => {
    const availablePlayers = players.filter(p => {
      if (unsoldRound) {
        return p.status === 'unsold';
      }
      return p.status === 'available';
    });
    
    if (availablePlayers.length === 0) return null;
    
    const shuffled = shuffleArray(availablePlayers);
    return shuffled[0];
  }, [players]);

  const startAuction = useCallback(() => {
    const availableTeams = getAvailableTeams();
    const shuffledTeamIds = shuffleArray(availableTeams.map(t => t.id));
    const firstPlayer = getNextAvailablePlayer();
    
    if (!firstPlayer) return;
    
    setAuctionState({
      currentPlayer: firstPlayer,
      currentBid: firstPlayer.basePrice,
      currentBidder: null,
      bidIncrement,
      teamsInRotation: shuffledTeamIds,
      droppedTeams: [],
      activeTeamIndex: 0,
      isAuctionActive: true,
      isPlayerSold: false,
    });
  }, [getAvailableTeams, getNextAvailablePlayer, bidIncrement]);

  const nextPlayer = useCallback(() => {
    const hasUnsoldPlayers = players.some(p => p.status === 'unsold');
    const hasAvailablePlayers = players.some(p => p.status === 'available');
    
    let nextP: Player | null = null;
    let isUnsoldRound = false;
    
    if (hasAvailablePlayers) {
      nextP = getNextAvailablePlayer(false);
    } else if (hasUnsoldPlayers) {
      nextP = getNextAvailablePlayer(true);
      isUnsoldRound = true;
    }
    
    if (!nextP) {
      setAuctionState(prev => ({
        ...prev,
        currentPlayer: null,
        isAuctionActive: false,
      }));
      return;
    }

    const availableTeams = getAvailableTeams();
    const shuffledTeamIds = shuffleArray(availableTeams.map(t => t.id));
    
    if (isUnsoldRound) {
      nextP = { ...nextP, isUnsoldRound: true };
    }
    
    setAuctionState({
      currentPlayer: nextP,
      currentBid: nextP.basePrice,
      currentBidder: null,
      bidIncrement,
      teamsInRotation: shuffledTeamIds,
      droppedTeams: [],
      activeTeamIndex: 0,
      isAuctionActive: true,
      isPlayerSold: false,
    });
  }, [players, getNextAvailablePlayer, getAvailableTeams, bidIncrement]);

  const placeBid = useCallback(() => {
    const { teamsInRotation, droppedTeams, activeTeamIndex, currentBid } = auctionState;
    
    const activeTeamIds = teamsInRotation.filter(id => !droppedTeams.includes(id));
    if (activeTeamIds.length === 0) return;
    
    const currentTeamId = activeTeamIds[activeTeamIndex % activeTeamIds.length];
    const currentTeam = teams.find(t => t.id === currentTeamId);
    
    if (!currentTeam) return;
    
    const newBid = auctionState.currentBidder ? currentBid + bidIncrement : currentBid;
    
    if (currentTeam.remainingBudget < newBid) {
      // Auto-drop if can't afford
      dropFromBidding();
      return;
    }
    
    setAuctionState(prev => ({
      ...prev,
      currentBid: newBid,
      currentBidder: currentTeam,
      activeTeamIndex: (activeTeamIndex + 1) % activeTeamIds.length,
    }));
  }, [auctionState, teams, bidIncrement]);

  const dropFromBidding = useCallback(() => {
    const { teamsInRotation, droppedTeams, activeTeamIndex } = auctionState;
    
    const activeTeamIds = teamsInRotation.filter(id => !droppedTeams.includes(id));
    if (activeTeamIds.length === 0) return;
    
    const currentTeamId = activeTeamIds[activeTeamIndex % activeTeamIds.length];
    const newDroppedTeams = [...droppedTeams, currentTeamId];
    const newActiveTeamIds = teamsInRotation.filter(id => !newDroppedTeams.includes(id));
    
    // If only one team left and they have a bid, auto-sell
    if (newActiveTeamIds.length === 1 && auctionState.currentBidder) {
      sellPlayer();
      return;
    }
    
    // If no teams left and no bidder, mark unsold
    if (newActiveTeamIds.length === 0 && !auctionState.currentBidder) {
      markUnsold();
      return;
    }
    
    setAuctionState(prev => ({
      ...prev,
      droppedTeams: newDroppedTeams,
      activeTeamIndex: prev.activeTeamIndex % Math.max(newActiveTeamIds.length, 1),
    }));
  }, [auctionState]);

  const sellPlayer = useCallback(() => {
    const { currentPlayer, currentBid, currentBidder } = auctionState;
    
    if (!currentPlayer || !currentBidder) return;
    
    setPlayers(prev => prev.map(p => 
      p.id === currentPlayer.id 
        ? { ...p, status: 'sold' as const, soldPrice: currentBid, soldTo: currentBidder.id }
        : p
    ));
    
    setTeams(prev => prev.map(t => 
      t.id === currentBidder.id
        ? {
            ...t,
            remainingBudget: t.remainingBudget - currentBid,
            players: [...t.players, { ...currentPlayer, status: 'sold' as const, soldPrice: currentBid, soldTo: currentBidder.id }]
          }
        : t
    ));
    
    setAuctionState(prev => ({
      ...prev,
      isPlayerSold: true,
    }));
  }, [auctionState]);

  const markUnsold = useCallback(() => {
    const { currentPlayer } = auctionState;
    
    if (!currentPlayer) return;
    
    setPlayers(prev => prev.map(p => 
      p.id === currentPlayer.id 
        ? { ...p, status: 'unsold' as const }
        : p
    ));
    
    setAuctionState(prev => ({
      ...prev,
      isPlayerSold: false,
    }));
    
    // Move to next player after a brief delay
    setTimeout(() => nextPlayer(), 1500);
  }, [auctionState, nextPlayer]);

  const startUnsoldRound = useCallback(() => {
    const unsoldPlayers = players.filter(p => p.status === 'unsold');
    if (unsoldPlayers.length === 0) return;
    
    // Reset unsold players for re-auction
    setPlayers(prev => prev.map(p => 
      p.status === 'unsold' ? { ...p, isUnsoldRound: true } : p
    ));
    
    nextPlayer();
  }, [players, nextPlayer]);

  const updateBidIncrement = useCallback((increment: number) => {
    setBidIncrement(increment);
    setAuctionState(prev => ({
      ...prev,
      bidIncrement: increment,
    }));
  }, []);

  const bidByTeam = useCallback((teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    const { currentBid, currentBidder } = auctionState;
    
    // Calculate the new bid: if there's already a bidder, increment; otherwise use current (base) price
    const newBid = currentBidder ? currentBid + bidIncrement : currentBid;
    
    // Check if team can afford it
    if (team.remainingBudget < newBid) return;
    
    // Check if team is full
    if (team.players.length >= team.maxSize) return;
    
    setAuctionState(prev => ({
      ...prev,
      currentBid: newBid,
      currentBidder: team,
    }));
  }, [auctionState, teams, bidIncrement]);

  return (
    <AuctionContext.Provider value={{
      step,
      setStep,
      teams,
      setTeams,
      players,
      setPlayers,
      basePrice,
      setBasePrice,
      bidIncrement,
      setBidIncrement,
      updateBidIncrement,
      maxTeamSize,
      setMaxTeamSize,
      auctionState,
      setAuctionState,
      startAuction,
      nextPlayer,
      placeBid,
      bidByTeam,
      dropFromBidding,
      sellPlayer,
      markUnsold,
      startUnsoldRound,
    }}>
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within AuctionProvider');
  }
  return context;
};

export { TEAM_COLORS };
