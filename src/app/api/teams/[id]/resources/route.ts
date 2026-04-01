import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamId = params.id;
    const { resource, delta } = await request.json();

    // Получаем текущие данные команды
    const { data: team, error: fetchError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (fetchError || !team) {
      return NextResponse.json({ error: 'Команда не найдена' }, { status: 404 });
    }

    // Обновляем ресурс
    const updateData: any = {};
    updateData[resource] = (team[resource] || 0) + delta;

    const { error: updateError } = await supabase
      .from('teams')
      .update(updateData)
      .eq('id', teamId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
