import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { INITIAL_RESOURCES, TeamName } from '@/types/game';

export async function POST() {
  try {
    console.log('API: Начинаем инициализацию игры...');
    
    // Сначала деактивируем все существующие игры
    await supabase
      .from('games')
      .update({ is_active: false })
      .eq('is_active', true);
    
    console.log('API: Создаем новую игру...');
    // Создаем новую игру
    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({
        name: 'Эпоха Ветров',
        current_epoch: 1,
        current_turn: 1,
        is_active: true,
      })
      .select()
      .single();

    if (gameError) {
      console.error('API: Ошибка создания игры:', gameError);
      throw gameError;
    }
    
    console.log('API: Игра создана:', game.id);

    // Создаем команды с начальными ресурсами
    const teams: TeamName[] = ['north', 'south', 'east'];
    const teamInserts = teams.map((teamName) => ({
      game_id: game.id,
      name: teamName,
      display_name: teamName === 'north' ? 'СЕВЕР' : teamName === 'south' ? 'ЮГ' : 'ВОСТОК',
      ...INITIAL_RESOURCES[teamName],
    }));

    console.log('API: Создаем команды:', teamInserts);
    const { data: createdTeams, error: teamsError } = await supabase
      .from('teams')
      .insert(teamInserts)
      .select();

    if (teamsError) {
      console.error('API: Ошибка создания команд:', teamsError);
      throw teamsError;
    }
    
    console.log('API: Команды созданы:', createdTeams);

    return NextResponse.json({
      game,
      teams: createdTeams,
    });
  } catch (error) {
    console.error('API: Ошибка инициализации игры:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize game' },
      { status: 500 }
    );
  }
}
