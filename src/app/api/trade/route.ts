import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ResourceType } from '@/types/game';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from_team_id, to_team_id, resource_type, amount } = body;

    if (!from_team_id || !to_team_id || !resource_type || !amount) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be positive' },
        { status: 400 }
      );
    }

    // Получаем отправителя
    const { data: fromTeam, error: fromError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', from_team_id)
      .single();

    if (fromError) throw fromError;

    // Проверяем достаточно ли ресурсов
    if (fromTeam[resource_type] < amount) {
      return NextResponse.json(
        { error: 'Not enough resources' },
        { status: 400 }
      );
    }

    // Получаем игру
    const { data: game } = await supabase
      .from('games')
      .select('*')
      .eq('id', fromTeam.game_id)
      .single();

    // Выполняем транзакцию
    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .insert({
        game_id: game.id,
        from_team_id,
        to_team_id,
        resource_type,
        amount,
      })
      .select()
      .single();

    if (tradeError) throw tradeError;

    // Обновляем ресурсы команд
    await supabase.rpc('transfer_resource', {
      p_from_team_id: from_team_id,
      p_to_team_id: to_team_id,
      p_resource_type: resource_type,
      p_amount: amount,
    });

    return NextResponse.json({ trade });
  } catch (error) {
    console.error('Error processing trade:', error);
    return NextResponse.json(
      { error: 'Failed to process trade' },
      { status: 500 }
    );
  }
}
