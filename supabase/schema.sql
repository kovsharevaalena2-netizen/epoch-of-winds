-- Включение расширения для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица игр
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  current_epoch INTEGER DEFAULT 1,
  current_turn INTEGER DEFAULT 1,
  current_card_id UUID,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица команд
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL, -- 'north', 'south', 'east'
  display_name VARCHAR(100) NOT NULL,
  
  -- Ресурсы
  gold INTEGER DEFAULT 0,
  wood INTEGER DEFAULT 0,
  stone INTEGER DEFAULT 0,
  blueprints INTEGER DEFAULT 0,
  
  -- Прогресс
  steps INTEGER DEFAULT 0,
  
  -- Инфраструктура
  walls INTEGER DEFAULT 0,
  chizhik INTEGER DEFAULT 0,      -- Магазин "Чижик"
  pyaterochka INTEGER DEFAULT 0,  -- Магазин "Пятерочка"
  perekrestok INTEGER DEFAULT 0,  -- Магазин "Перекресток"
  windmill INTEGER DEFAULT 0,     -- Ветряная мельница
  
  -- Ответ на текущую карточку
  current_answer VARCHAR(10),     -- 'A', 'B', 'C' или null
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(game_id, name)
);

-- Таблица карточек
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL, -- 'case', 'test', 'decree'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  correct_answer VARCHAR(10) NOT NULL, -- 'A', 'B', 'C'
  base_steps INTEGER DEFAULT 0,
  gold_reward INTEGER DEFAULT 0,
  gold_penalty INTEGER DEFAULT 0,
  epoch INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица транзакций торговли
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  from_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  to_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  resource_type VARCHAR(20) NOT NULL, -- 'gold', 'wood', 'stone', 'blueprints'
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица истории ходов
CREATE TABLE turn_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  turn_number INTEGER NOT NULL,
  card_id UUID REFERENCES cards(id),
  answer VARCHAR(10),
  is_correct BOOLEAN,
  steps_gained INTEGER DEFAULT 0,
  gold_gained INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для оптимизации
CREATE INDEX idx_teams_game_id ON teams(game_id);
CREATE INDEX idx_cards_epoch ON cards(epoch);
CREATE INDEX idx_trades_game_id ON trades(game_id);
CREATE INDEX idx_turn_history_game_id ON turn_history(game_id);

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Включение Realtime для таблиц
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE cards;
ALTER PUBLICATION supabase_realtime ADD TABLE trades;
ALTER PUBLICATION supabase_realtime ADD TABLE turn_history;

-- Начальные данные: карточки для тестирования
INSERT INTO cards (type, title, description, option_a, option_b, option_c, correct_answer, base_steps, gold_reward, gold_penalty, epoch) VALUES
-- Кейсы (Хроники) - Эпоха 1
('case', 'Хроники: Торговый путь', 'Ваш караван встретил разбойников на торговом пути. Что вы сделаете?', 'Заплатить выкуп и продолжить путь', 'Сразиться с разбойниками', 'Обойти путь через горы', 'A', 2, 3, 1, 1),
('case', 'Хроники: Засуха', 'На ваших полях началась засуха. Урожай под угрозой.', 'Построить ирригационную систему', 'Импортировать продовольствие', 'Переселить крестьян', 'B', 2, 3, 1, 1),
-- Тесты (Тайны) - Эпоха 1
('test', 'Тайны: Древний договор', 'Какой документ регулирует торговые отношения между королевствами?', 'Хартия вольностей', 'Торговый договор', 'Манифест независимости', 'B', 1, 2, 2, 1),
('test', 'Тайны: Ресурсы', 'Какой ресурс необходим для строительства Ветряной Мельницы?', 'Только золото', 'Дерево, камень и чертежи', 'Только камень', 'B', 1, 2, 2, 1),
-- Указы (Физика) - Эпоха 1
('decree', 'Указ: Налоговая реформа', 'Магистр объявляет налоговую реформу. Команды получают бонусы.', 'Принять реформу', 'Отказаться', 'Протестовать', 'A', 0, 5, 0, 1);

-- Функция для перевода ресурсов между командами
CREATE OR REPLACE FUNCTION transfer_resource(
  p_from_team_id UUID,
  p_to_team_id UUID,
  p_resource_type VARCHAR,
  p_amount INTEGER
)
RETURNS VOID AS $$
BEGIN
  -- Вычитаем ресурсы у отправителя
  EXECUTE format(
    'UPDATE teams SET %I = %I - $1 WHERE id = $2',
    p_resource_type, p_resource_type
  )
  USING p_amount, p_from_team_id;
  
  -- Добавляем ресурсы получателю
  EXECUTE format(
    'UPDATE teams SET %I = %I + $1 WHERE id = $2',
    p_resource_type, p_resource_type
  )
  USING p_amount, p_to_team_id;
END;
$$ LANGUAGE plpgsql;
