import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const teamId = params.id;
    const body = await request.json();

    const { data: updatedTeam, error } = await supabase
      .from('teams')
      .update(body)
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ team: updatedTeam });
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json(
      { error: 'Failed to update team' },
      { status: 500 }
    );
  }
}
