import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Типы для Supabase
export type Database = {
  public: {
    Tables: {
      games: {
        Row: {
          id: string
          name: string
          current_epoch: number
          current_turn: number
          current_card_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          current_epoch?: number
          current_turn?: number
          current_card_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          current_epoch?: number
          current_turn?: number
          current_card_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          game_id: string
          name: string
          display_name: string
          gold: number
          wood: number
          stone: number
          blueprints: number
          steps: number
          walls: number
          chizhik: number
          pyaterochka: number
          perekrestok: number
          windmill: number
          current_answer: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          game_id: string
          name: string
          display_name: string
          gold?: number
          wood?: number
          stone?: number
          blueprints?: number
          steps?: number
          walls?: number
          chizhik?: number
          pyaterochka?: number
          perekrestok?: number
          windmill?: number
          current_answer?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          name?: string
          display_name?: string
          gold?: number
          wood?: number
          stone?: number
          blueprints?: number
          steps?: number
          walls?: number
          chizhik?: number
          pyaterochka?: number
          perekrestok?: number
          windmill?: number
          current_answer?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          type: string
          title: string
          description: string
          option_a: string
          option_b: string
          option_c: string
          correct_answer: string
          base_steps: number
          gold_reward: number
          gold_penalty: number
          epoch: number
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          title: string
          description: string
          option_a: string
          option_b: string
          option_c: string
          correct_answer: string
          base_steps?: number
          gold_reward?: number
          gold_penalty?: number
          epoch?: number
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          title?: string
          description?: string
          option_a?: string
          option_b?: string
          option_c?: string
          correct_answer?: string
          base_steps?: number
          gold_reward?: number
          gold_penalty?: number
          epoch?: number
          created_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          game_id: string
          from_team_id: string
          to_team_id: string
          resource_type: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          from_team_id: string
          to_team_id: string
          resource_type: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          from_team_id?: string
          to_team_id?: string
          resource_type?: string
          amount?: number
          created_at?: string
        }
      }
      turn_history: {
        Row: {
          id: string
          game_id: string
          team_id: string
          turn_number: number
          card_id: string | null
          answer: string | null
          is_correct: boolean | null
          steps_gained: number
          gold_gained: number
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          team_id: string
          turn_number: number
          card_id?: string | null
          answer?: string | null
          is_correct?: boolean | null
          steps_gained?: number
          gold_gained?: number
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          team_id?: string
          turn_number?: number
          card_id?: string | null
          answer?: string | null
          is_correct?: boolean | null
          steps_gained?: number
          gold_gained?: number
          created_at?: string
        }
      }
    }
  }
}
