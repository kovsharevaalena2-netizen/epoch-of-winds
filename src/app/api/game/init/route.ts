import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { INITIAL_RESOURCES, TeamName } from '@/types/game';

export async function POST() {
  try {
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

    if (gameError) throw gameError;

    // Создаем команды с начальными ресурсами
    const teams: TeamName[] = ['north', 'south', 'east'];
    const teamInserts = teams.map((teamName) => ({
      game_id: game.id,
      name: teamName,
      display_name: teamName === 'north' ? 'СЕВЕР' : teamName === 'south' ? 'ЮГ' : 'ВОСТОК',
      ...INITIAL_RESOURCES[teamName],
    }));

    const { data: createdTeams, error: teamsError } = await supabase
      .from('teams')
      .insert(teamInserts)
      .select();

    if (teamsError) throw teamsError;

    return NextResponse.json({
      game,
      teams: createdTeams,
    });
  } catch (error) {
    console.error('Error initializing game:', error);
    return NextResponse.json(
      { error: 'Failed to initialize game' },
      { status: 500 }
    );
  }
}
