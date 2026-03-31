'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { TEAM_DISPLAY_NAMES, TEAM_COLORS, TEAM_ICONS, TeamName } from '@/types/game';
import { Coins, Trees, Mountain, Scroll, MapPin, Store, ArrowRightLeft, Hammer } from 'lucide-react';

export default function TeamPage() {
  const params = useParams();
  const teamName = params.id as TeamName;
  
  const { teams, getTeamByName, isLoading } = useGameStore();
  const team = getTeamByName(teamName);
  
  const [showShop, setShowShop] = useState(false);
  const [showTrade, setShowTrade] = useState(false);
  const [showCard, setShowCard] = useState(false);

  // Проверка валидности имени команды
  if (!['north', 'south', 'east'].includes(teamName)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-2xl">Команда не найдена</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-2xl">Загрузка...</div>
      </div>
    );
  }

  // Mock данные для демонстрации (будут заменены на реальные данные из Supabase)
  const mockTeam = team || {
    id: '1',
    game_id: '1',
    name: teamName,
    display_name: TEAM_DISPLAY_NAMES[teamName],
    gold: 10,
    wood: teamName === 'north' ? 5 : 0,
    stone: teamName === 'south' ? 5 : 0,
    blueprints: teamName === 'east' ? 5 : 0,
    steps: 0,
    walls: 0,
    chizhik: 0,
    pyaterochka: 0,
    perekrestok: 0,
    windmill: 0,
    current_answer: null,
    created_at: '',
    updated_at: '',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок команды */}
        <div className={`${TEAM_COLORS[teamName]} rounded-xl p-6 mb-6 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{TEAM_ICONS[teamName]}</div>
              <div>
                <h1 className="text-4xl font-bold text-white">{TEAM_DISPLAY_NAMES[teamName]}</h1>
                <p className="text-white/80">Дашборд команды</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/80 text-sm">Прогресс</div>
              <div className="text-4xl font-bold text-white">{mockTeam.steps} <span className="text-2xl">шагов</span></div>
            </div>
          </div>
        </div>

        {/* Ресурсы */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="text-yellow-400" size={24} />
              <span className="text-yellow-400 font-semibold">Золото</span>
            </div>
            <div className="text-3xl font-bold text-white">{mockTeam.gold}</div>
          </div>
          
          <div className="bg-amber-700/20 border border-amber-600/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trees className="text-amber-500" size={24} />
              <span className="text-amber-500 font-semibold">Дерево</span>
            </div>
            <div className="text-3xl font-bold text-white">{mockTeam.wood}</div>
          </div>
          
          <div className="bg-gray-600/20 border border-gray-500/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mountain className="text-gray-400" size={24} />
              <span className="text-gray-400 font-semibold">Камень</span>
            </div>
            <div className="text-3xl font-bold text-white">{mockTeam.stone}</div>
          </div>
          
          <div className="bg-blue-600/20 border border-blue-500/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scroll className="text-blue-400" size={24} />
              <span className="text-blue-400 font-semibold">Чертежи</span>
            </div>
            <div className="text-3xl font-bold text-white">{mockTeam.blueprints}</div>
          </div>
        </div>

        {/* Инфраструктура */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Инфраструктура</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🧱</div>
              <div className="text-white font-semibold">Стены</div>
              <div className="text-2xl font-bold text-white">{mockTeam.walls}</div>
              {mockTeam.walls > 0 && (
                <button className="mt-2 text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">
                  Разрушить
                </button>
              )}
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🐦</div>
              <div className="text-white font-semibold">Чижик</div>
              <div className="text-2xl font-bold text-white">{mockTeam.chizhik}</div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">5️⃣</div>
              <div className="text-white font-semibold">Пятерочка</div>
              <div className="text-2xl font-bold text-white">{mockTeam.pyaterochka}</div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">➕</div>
              <div className="text-white font-semibold">Перекресток</div>
              <div className="text-2xl font-bold text-white">{mockTeam.perekrestok}</div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🌬️</div>
              <div className="text-white font-semibold">Мельница</div>
              <div className="text-2xl font-bold text-white">{mockTeam.windmill}</div>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setShowShop(true)}
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <Store size={32} />
            <div className="text-left">
              <div className="text-xl font-bold">Магазин</div>
              <div className="text-green-100 text-sm">Построить здания</div>
            </div>
          </button>
          
          <button
            onClick={() => setShowTrade(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <ArrowRightLeft size={32} />
            <div className="text-left">
              <div className="text-xl font-bold">Торговля</div>
              <div className="text-blue-100 text-sm">Обмен ресурсами</div>
            </div>
          </button>
          
          <button
            onClick={() => setShowCard(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <Scroll size={32} />
            <div className="text-left">
              <div className="text-xl font-bold">Карточка</div>
              <div className="text-purple-100 text-sm">Ответить на вопрос</div>
            </div>
          </button>
        </div>

        {/* Зона для активной карточки */}
        {showCard && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Активная карточка</h2>
              <button
                onClick={() => setShowCard(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-6">
              <div className="text-purple-400 text-sm mb-2">Хроники</div>
              <h3 className="text-xl font-bold text-white mb-4">Торговый путь</h3>
              <p className="text-gray-300 mb-6">
                Ваш караван встретил разбойников на торговом пути. Что вы сделаете?
              </p>
              <div className="space-y-3">
                <button className="w-full bg-slate-600 hover:bg-slate-500 text-white p-4 rounded-lg text-left transition-all">
                  <span className="font-bold text-purple-400 mr-2">A.</span>
                  Заплатить выкуп и продолжить путь
                </button>
                <button className="w-full bg-slate-600 hover:bg-slate-500 text-white p-4 rounded-lg text-left transition-all">
                  <span className="font-bold text-purple-400 mr-2">B.</span>
                  Сразиться с разбойниками
                </button>
                <button className="w-full bg-slate-600 hover:bg-slate-500 text-white p-4 rounded-lg text-left transition-all">
                  <span className="font-bold text-purple-400 mr-2">C.</span>
                  Обойти путь через горы
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Модалка магазина */}
        {showShop && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Магазин</h2>
                <button
                  onClick={() => setShowShop(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🧱</div>
                    <div>
                      <div className="text-white font-bold">Стена</div>
                      <div className="text-gray-400 text-sm">Защита от угроз</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold">2 💰</div>
                    <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                      Купить
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🐦</div>
                    <div>
                      <div className="text-white font-bold">Магазин «Чижик»</div>
                      <div className="text-gray-400 text-sm">+1 шаг за верный ответ</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold">3 💰</div>
                    <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                      Купить
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">5️⃣</div>
                    <div>
                      <div className="text-white font-bold">Магазин «Пятерочка»</div>
                      <div className="text-gray-400 text-sm">+2 шага за верный ответ</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold">5 💰</div>
                    <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                      Купить
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">➕</div>
                    <div>
                      <div className="text-white font-bold">Магазин «Перекресток»</div>
                      <div className="text-gray-400 text-sm">+3 шага за верный ответ</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold">7 💰</div>
                    <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                      Купить
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🌬️</div>
                    <div>
                      <div className="text-white font-bold">Ветряная Мельница</div>
                      <div className="text-gray-400 text-sm">Требуется для прохода 30 шагов</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-500 font-bold">1 🪵 1 🪨 1 📜</div>
                    <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                      Построить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Модалка торговли */}
        {showTrade && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full animate-slide-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Торговля</h2>
                <button
                  onClick={() => setShowTrade(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">Кому отправить:</label>
                  <select className="w-full bg-slate-700 text-white p-3 rounded-lg">
                    <option value="">Выберите команду...</option>
                    {['north', 'south', 'east']
                      .filter(t => t !== teamName)
                      .map(t => (
                        <option key={t} value={t}>{TEAM_DISPLAY_NAMES[t as TeamName]}</option>
                      ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">Ресурс:</label>
                  <select className="w-full bg-slate-700 text-white p-3 rounded-lg">
                    <option value="">Выберите ресурс...</option>
                    <option value="gold">💰 Золото</option>
                    <option value="wood">🪵 Дерево</option>
                    <option value="stone">🪨 Камень</option>
                    <option value="blueprints">📜 Чертежи</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">Количество:</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-slate-700 text-white p-3 rounded-lg"
                    placeholder="Введите количество"
                  />
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-bold">
                  Отправить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
