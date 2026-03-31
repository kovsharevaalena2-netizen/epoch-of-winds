import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Получаем активную игру
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (gameError) {
      if (gameError.code === 'PGRST116') {
        // Нет активной игры
        return NextResponse.json({ game: null, teams: [] });
      }
      throw gameError;
    }

    // Получаем команды
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .eq('game_id', game.id);

    if (teamsError) throw teamsError;

    // Получаем текущую карточку
    let currentCard = null;
    if (game.current_card_id) {
      const { data: card } = await supabase
        .from('cards')
        .select('*')
        .eq('id', game.current_card_id)
        .single();
      currentCard = card;
    }

    return NextResponse.json({
      game,
      teams,
      currentCard,
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { current_epoch, current_turn, current_card_id, is_active } = body;

    const { data: game, error } = await supabase
      .from('games')
      .update({
        ...(current_epoch !== undefined && { current_epoch }),
        ...(current_turn !== undefined && { current_turn }),
        ...(current_card_id !== undefined && { current_card_id }),
        ...(is_active !== undefined && { is_active }),
      })
      .eq('is_active', true)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ game });
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}
