// Типы для игры

export type TeamName = 'north' | 'south' | 'east';

export type CardType = 'case' | 'test' | 'decree';

export type ResourceType = 'gold' | 'wood' | 'stone' | 'blueprints';

export type Answer = 'A' | 'B' | 'C';

export interface Game {
  id: string;
  name: string;
  current_epoch: number;
  current_turn: number;
  current_card_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  game_id: string;
  name: TeamName;
  display_name: string;
  gold: number;
  wood: number;
  stone: number;
  blueprints: number;
  steps: number;
  walls: number;
  chizhik: number;
  pyaterochka: number;
  perekrestok: number;
  windmill: number;
  current_answer: Answer | null;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  type: CardType;
  title: string;
  description: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_answer: Answer;
  base_steps: number;
  gold_reward: number;
  gold_penalty: number;
  epoch: number;
  created_at: string;
}

export interface Trade {
  id: string;
  game_id: string;
  from_team_id: string;
  to_team_id: string;
  resource_type: ResourceType;
  amount: number;
  created_at: string;
}

export interface TurnHistory {
  id: string;
  game_id: string;
  team_id: string;
  turn_number: number;
  card_id: string | null;
  answer: Answer | null;
  is_correct: boolean | null;
  steps_gained: number;
  gold_gained: number;
  created_at: string;
}

// Цены в магазине
export const SHOP_PRICES = {
  wall: { gold: 2, wood: 0, stone: 0, blueprints: 0 },
  chizhik: { gold: 3, wood: 0, stone: 0, blueprints: 0 },
  pyaterochka: { gold: 5, wood: 0, stone: 0, blueprints: 0 },
  perekrestok: { gold: 7, wood: 0, stone: 0, blueprints: 0 },
  windmill: { gold: 0, wood: 1, stone: 1, blueprints: 1 },
} as const;

export type BuildingType = keyof typeof SHOP_PRICES;

// Начальные ресурсы для команд
export const INITIAL_RESOURCES = {
  north: { gold: 10, wood: 5, stone: 0, blueprints: 0 },
  south: { gold: 10, wood: 0, stone: 5, blueprints: 0 },
  east: { gold: 10, wood: 0, stone: 0, blueprints: 5 },
} as const;

// Отображаемые названия команд
export const TEAM_DISPLAY_NAMES: Record<TeamName, string> = {
  north: 'СЕВЕР',
  south: 'ЮГ',
  east: 'ВОСТОК',
};

// Отображаемые иконки команд
export const TEAM_ICONS: Record<TeamName, string> = {
  north: '🧊',
  south: '☀️',
  east: '🌲',
};

// Отображаемые цвета команд
export const TEAM_COLORS: Record<TeamName, string> = {
  north: 'bg-blue-600',
  south: 'bg-orange-600',
  east: 'bg-green-600',
};
