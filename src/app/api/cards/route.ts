import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const epoch = searchParams.get('epoch');
    const type = searchParams.get('type');

    let query = supabase.from('cards').select('*');

    if (epoch) {
      query = query.eq('epoch', parseInt(epoch));
    }

    if (type) {
      query = query.eq('type', type);
    }

    const { data: cards, error } = await query;

    if (error) throw error;

    return NextResponse.json({ cards });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}
