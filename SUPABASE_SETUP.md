# 📖 Подробная инструкция по настройке Supabase

## Шаг 1: Регистрация в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите кнопку **"Start your project"**
3. Войдите через GitHub, Google или email
4. После входа нажмите **"New Project"**

## Шаг 2: Создание проекта

1. Заполните форму создания проекта:
   - **Name**: `epoch-of-winds` (или любое другое имя)
   - **Database Password**: Создайте надежный пароль (сохраните его!)
   - **Region**: Выберите ближайший регион (например, Frankfurt для Европы)
   - **Pricing Plan**: Выберите **Free** (бесплатный план)

2. Нажмите **"Create new project"**
3. Подождите 1-2 минуты пока проект создается

## Шаг 3: Выполнение SQL схемы

1. В левом меню выберите **SQL Editor** (иконка терминала)
2. Нажмите **"New query"**
3. Откройте файл [`supabase/schema.sql`](supabase/schema.sql) в вашем проекте
4. Скопируйте весь код из файла
5. Вставьте код в SQL Editor
6. Нажмите кнопку **"Run"** (или `Ctrl+Enter`)

После выполнения вы увидите сообщение **"Success. No rows returned"**

## Шаг 4: Получение API ключей

1. В левом меню выберите **Settings** (иконка шестеренки) → **API**
2. Скопируйте следующие значения:

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

### anon / public Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Важно**: Используйте именно `anon` ключ, а не `service_role`!

## Шаг 5: Настройка .env.local

1. Откройте файл [`.env.local`](.env.local) в папке проекта
2. Замените значения на свои:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Сохраните файл

## Шаг 6: Проверка Realtime

1. В левом меню выберите **Database** → **Replication**
2. Убедитесь, что следующие таблицы включены:
   - ✅ games
   - ✅ teams
   - ✅ cards
   - ✅ trades
   - ✅ turn_history

Если какая-то таблица не включена:
1. Нажмите на таблицу
2. Переключите тумблер **"Enable Realtime"**

## Шаг 7: Проверка таблиц

1. В левом меню выберите **Table Editor**
2. Вы должны увидеть следующие таблицы:
   - `games` - игры
   - `teams` - команды
   - `cards` - карточки (с 5 тестовыми карточками)
   - `trades` - транзакции торговли
   - `turn_history` - история ходов

3. Нажмите на таблицу `cards` - вы должны увидеть 5 карточек для тестирования

## Шаг 8: Инициализация первой игры

После запуска проекта (`npm run dev`):

1. Откройте http://localhost:3000
2. Для инициализации игры выполните POST запрос:
   ```bash
   curl -X POST http://localhost:3000/api/game/init
   ```

Или используйте Postman/Insomnia:
- Method: POST
- URL: `http://localhost:3000/api/game/init`

Это создаст:
- Новую игру с epoch=1, turn=1
- 3 команды с начальными ресурсами

## Шаг 9: Проверка подключения

1. Запустите проект:
   ```bash
   npm run dev
   ```

2. Откройте браузер на http://localhost:3000

3. Если вы видите главную страницу с кнопками команд - подключение работает! 🎉

## 🔧 Решение проблем

### Ошибка "Invalid API key"
- Проверьте, что используете `anon` ключ, а не `service_role`
- Убедитесь, что ключ скопирован полностью без пробелов

### Ошибка "Database connection failed"
- Проверьте, что проект в Supabase активен (зеленый индикатор)
- Убедитесь, что SQL схема выполнена успешно

### Realtime не работает
- Проверьте, что таблицы включены в Replication
- Убедитесь, что используете правильный URL проекта

### Таблицы пустые
- Выполните SQL схему заново
- Проверьте, что нет ошибок в SQL Editor

## 📝 Дополнительные ресурсы

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/with-nextjs)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)

## 🎯 Следующие шаги

После настройки Supabase:

1. Запустите проект: `npm run dev`
2. Откройте http://localhost:3000
3. Инициализируйте игру через API
4. Откройте дашборды команд на разных устройствах/вкладках
5. Используйте панель Магистра для управления игрой
