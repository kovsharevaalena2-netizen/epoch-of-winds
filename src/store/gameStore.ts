import { create } from 'zustand';
import { Game, Team, Card, TeamName } from '@/types/game';

interface GameState {
  // Данные игры
  game: Game | null;
  teams: Team[];
  currentCard: Card | null;
  
  // UI состояние
  isLoading: boolean;
  error: string | null;
  
  // Действия
  setGame: (game: Game | null) => void;
  setTeams: (teams: Team[]) => void;
  setCurrentCard: (card: Card | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Получить команду по имени
  getTeamByName: (name: TeamName) => Team | undefined;
  
  // Обновить команду
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  game: null,
  teams: [],
  currentCard: null,
  isLoading: false,
  error: null,
  
  setGame: (game) => set({ game }),
  setTeams: (teams) => set({ teams }),
  setCurrentCard: (card) => set({ currentCard: card }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  getTeamByName: (name) => {
    return get().teams.find(team => team.name === name);
  },
  
  updateTeam: (teamId, updates) => {
    set((state) => ({
      teams: state.teams.map(team =>
        team.id === teamId ? { ...team, ...updates } : team
      ),
    }));
  },
}));
