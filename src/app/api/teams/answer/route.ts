import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Answer } from '@/types/game';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { team_id, answer } = body;

    if (!team_id || !answer) {
      return NextResponse.json(
        { error: 'team_id and answer are required' },
        { status: 400 }
      );
    }

    // Сохраняем ответ команды
    const { data: team, error } = await supabase
      .from('teams')
      .update({ current_answer: answer })
      .eq('id', team_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
