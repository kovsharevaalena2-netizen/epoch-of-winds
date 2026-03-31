import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateSteps, calculateGoldChange, getRandomResource } from '@/utils/gameMath';
import { Answer } from '@/types/game';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { game_id } = body;

    // Получаем игру
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('id', game_id)
      .single();

    if (gameError) throw gameError;

    // Получаем текущую карточку
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select('*')
      .eq('id', game.current_card_id)
      .single();

    if (cardError) throw cardError;

    // Получаем все команды
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .eq('game_id', game_id);

    if (teamsError) throw teamsError;

    // Рассчитываем результаты для каждой команды
    const results = await Promise.all(
      teams.map(async (team) => {
        const answer = team.current_answer as Answer | null;
        
        if (!answer) {
          return { team_id: team.id, steps_gained: 0, gold_gained: 0 };
        }

        const stepsGained = calculateSteps(team, card, answer, game.current_epoch);
        const goldGained = calculateGoldChange(card, answer);

        // Обновляем команду
        const updates: any = {
          steps: team.steps + stepsGained,
          gold: team.gold + goldGained,
          current_answer: null,
        };

        // Для указов добавляем случайный ресурс
        if (card.type === 'decree' && answer === card.correct_answer) {
          const randomResource = getRandomResource();
          updates[randomResource] = team[randomResource] + 1;
        }

        const { data: updatedTeam } = await supabase
          .from('teams')
          .update(updates)
          .eq('id', team.id)
          .select()
          .single();

        // Записываем в историю
        await supabase.from('turn_history').insert({
          game_id: game.id,
          team_id: team.id,
          turn_number: game.current_turn,
          card_id: card.id,
          answer,
          is_correct: answer === card.correct_answer,
          steps_gained: stepsGained,
          gold_gained: goldGained,
        });

        return {
          team_id: team.id,
          steps_gained: stepsGained,
          gold_gained: goldGained,
          updated_team: updatedTeam,
        };
      })
    );

    // Увеличиваем номер хода
    await supabase
      .from('games')
      .update({ current_turn: game.current_turn + 1 })
      .eq('id', game.id);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error calculating turn:', error);
    return NextResponse.json(
      { error: 'Failed to calculate turn' },
      { status: 500 }
    );
  }
}
