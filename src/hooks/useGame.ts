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
    // Периодическое обновление каждые 10 секунд
    const interval = setInterval(() => {
      fetchGameData();
    }, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  async function fetchGameData() {
    try {
      setLoading(true);
      setError(null);
      console.log('useGame: Загружаем данные игры...');

      // Получаем активную игру
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      console.log('useGame: Данные игры:', gameData, 'Ошибка:', gameError);

      if (gameError) {
        if (gameError.code === 'PGRST116') {
          // Нет активной игры - это нормально
          console.log('useGame: Нет активной игры');
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

          console.log('useGame: Данные команд:', teamsData, 'Ошибка:', teamsError);

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
      console.error('useGame: Ошибка загрузки данных:', err);
      setError('Failed to load game data');
    } finally {
      setLoading(false);
    }
  }

  return { game, teams, currentCard, loading, error, refetch: fetchGameData };
}
