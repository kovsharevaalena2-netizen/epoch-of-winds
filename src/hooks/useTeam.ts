import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Team, Answer } from '@/types/game';

export function useTeam(teamName: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeam();
    // Периодическое обновление каждые 10 секунд
    const interval = setInterval(() => {
      fetchTeam();
    }, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, [teamName]);

  async function fetchTeam() {
    try {
      setLoading(true);
      setError(null);
      console.log(`useTeam: Загружаем команду ${teamName}...`);
      
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('name', teamName)
        .single();

      console.log(`useTeam: Данные команды:`, data, 'Ошибка:', error);

      if (error) {
        if (error.code === 'PGRST116') {
          // Команда не найдена
          console.log(`useTeam: Команда ${teamName} не найдена`);
          setError('Команда не найдена. Пожалуйста, инициализируйте игру через панель мастера.');
        } else {
          throw error;
        }
      } else {
        setTeam(data);
      }
    } catch (err) {
      console.error(`useTeam: Ошибка загрузки команды ${teamName}:`, err);
      setError('Ошибка при загрузке данных команды');
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer(answer: Answer) {
    if (!team) return;

    console.log(`useTeam: Отправляем ответ ${answer} для команды ${team.id}`);
    const { error } = await supabase
      .from('teams')
      .update({ current_answer: answer })
      .eq('id', team.id);

    if (error) throw error;
  }

  async function buyBuilding(buildingType: string) {
    if (!team) return;

    const prices: Record<string, Record<string, number>> = {
      wall: { gold: 2, wood: 0, stone: 0, blueprints: 0 },
      chizhik: { gold: 3, wood: 0, stone: 0, blueprints: 0 },
      pyaterochka: { gold: 5, wood: 0, stone: 0, blueprints: 0 },
      perekrestok: { gold: 7, wood: 0, stone: 0, blueprints: 0 },
      windmill: { gold: 0, wood: 1, stone: 1, blueprints: 1 },
    };

    const price = prices[buildingType];
    if (!price) return;

    const updates: any = {};
    for (const [resource, amount] of Object.entries(price)) {
      if (amount > 0) {
        updates[resource] = (team[resource as keyof Team] as number) - amount;
      }
    }
    updates[buildingType] = (team[buildingType as keyof Team] as number) + 1;

    console.log(`useTeam: Покупаем ${buildingType} для команды ${team.id}`);
    const { error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', team.id);

    if (error) throw error;
  }

  async function destroyWall() {
    if (!team || team.walls <= 0) return;

    console.log(`useTeam: Разрушаем стену для команды ${team.id}`);
    const { error } = await supabase
      .from('teams')
      .update({
        walls: team.walls - 1,
        wood: team.wood + 1,
      })
      .eq('id', team.id);

    if (error) throw error;
  }

  async function sendTrade(toTeamId: string, resourceType: string, amount: number) {
    if (!team) return;

    console.log(`useTeam: Отправляем ${amount} ${resourceType} от ${team.id} к ${toTeamId}`);
    const response = await fetch('/api/trade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_team_id: team.id,
        to_team_id: toTeamId,
        resource_type: resourceType,
        amount: Number(amount),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Trade failed');
    }
  }

  return {
    team,
    loading,
    error,
    submitAnswer,
    buyBuilding,
    destroyWall,
    sendTrade,
    refetch: fetchTeam,
  };
}
