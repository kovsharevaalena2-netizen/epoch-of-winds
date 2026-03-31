# ЭПОХА ВЕТРОВ: ОБРАЩАЯ В СИЛУ

Многопользовательская пошаговая web-игра (настольно-ролевая бизнес-симуляция).

## Технический стек

- **Frontend**: Next.js 14 (React), Tailwind CSS, Framer Motion, Lucide React
- **Backend/BaaS**: Supabase (PostgreSQL + Realtime subscriptions)
- **State Management**: Zustand
- **Language**: TypeScript

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Настройте Supabase:
   - Создайте проект на [supabase.com](https://supabase.com)
   - Выполните SQL-скрипт из файла `supabase/schema.sql` в SQL Editor Supabase
   - Скопируйте URL и Anon Key из Settings > API
   - Создайте файл `.env.local` и добавьте:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. Запустите проект:
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Структура проекта

```
epoch-of-winds-new/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Главная страница (вход)
│   │   ├── team/[id]/    # Дашборд команды
│   │   ├── master/       # Панель Магистра (Admin)
│   │   └── board/        # Глобальная карта
│   ├── components/       # React компоненты
│   ├── lib/              # Утилиты и клиенты
│   │   └── supabase.ts   # Supabase клиент
│   ├── store/            # Zustand store
│   │   └── gameStore.ts  # Состояние игры
│   ├── types/            # TypeScript типы
│   │   └── game.ts       # Типы игры
│   └── utils/            # Утилиты
│       └── gameMath.ts   # Математика игры
├── supabase/
│   └── schema.sql        # SQL схема БД
└── package.json
```

## Игровые механики

### Команды
- **Север**: 10 Золота, 5 Дерева
- **Юг**: 10 Золота, 5 Камня
- **Восток**: 10 Золота, 5 Чертежей

### Цены в магазине
- Стена: 2 Золота
- Магазин «Чижик»: 3 Золота (+1 шаг за верный ответ)
- Магазин «Пятерочка»: 5 Золота (+2 шага за верный ответ)
- Магазин «Перекресток»: 7 Золота (+3 шага за верный ответ)
- Ветряная Мельница: 1 Дерево + 1 Камень + 1 Чертеж

### Формула расчета шагов
```
Итоговые Шаги = Базовые Шаги + (Чижики * 1) + (Пятерочки * 2) + (Перекрестки * 3) - (Стены * Штраф_Эпохи)
```

- Эпоха 1: Штраф стен = 0
- Эпохи 2-4: Штраф стен = 1 за стену

### Победа
Суммарно более 150 шагов всеми командами.

## Лицензия

MIT
