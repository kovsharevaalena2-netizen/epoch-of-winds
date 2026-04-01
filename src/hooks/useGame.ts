import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Game, Team, Card } from '@/types/game';

export function useGame() {
  const [game, setGame] = useState<Game | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGameData();

    // Подписка на изменения в реальном времени
    const gameSubscription = supabase
      .channel('game-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
        },
        (payload) => {
          if (payload.new) {
            setGame(payload.new as Game);
          }
        }
      )
      .subscribe();

    const teamsSubscription = supabase
      .channel('teams-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams',
        },
        (payload) => {
          if (payload.new && 'id' in payload.new) {
            setTeams((prev) => {
              const index = prev.findIndex((t) => t.id === (payload.new as any).id);
              if (index >= 0) {
                const updated = [...prev];
                updated[index] = payload.new as Team;
                return updated;
              }
              return [...prev, payload.new as Team];
            });
          }
        }
      )
      .subscribe();

    return () => {
      gameSubscription.unsubscribe();
      teamsSubscription.unsubscribe();
    };
  }, []);

  async function fetchGameData() {
    try {
      setLoading(true);
      setError(null);

      // Получаем активную игру
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (gameError) {
        if (gameError.code === 'PGRST116') {
          // Нет активной игры - это нормально
          setGame(null);
          setTeams([]);
          setCurrentCard(null);
        } else {
          throw gameError;
        }
      } else {
        setGame(gameData);

        if (gameData) {
          // Получаем команды
          const { data: teamsData, error: teamsError } = await supabase
            .from('teams')
            .select('*')
            .eq('game_id', gameData.id);

          if (teamsError) throw teamsError;
          setTeams(teamsData || []);

          // Получаем текущую карточку
          if (gameData.current_card_id) {
            const { data: cardData } = await supabase
              .from('cards')
              .select('*')
              .eq('id', gameData.current_card_id)
              .single();

            setCurrentCard(cardData);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching game data:', err);
      setError('Failed to load game data');
    } finally {
      setLoading(false);
    }
  }

  return { game, teams, currentCard, loading, error, refetch: fetchGameData };
}
