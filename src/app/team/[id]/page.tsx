'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TEAM_DISPLAY_NAMES, TEAM_COLORS, TEAM_ICONS, TeamName, Answer } from '@/types/game';
import { Coins, Trees, Mountain, Scroll, Store, ArrowRightLeft, Hammer, RotateCcw } from 'lucide-react';

export default function TeamPage() {
  const params = useParams();
  const teamName = params.id as TeamName;
  
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [showShop, setShowShop] = useState(false);
  const [showTrade, setShowTrade] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [tradeAmount, setTradeAmount] = useState('1');
  const [tradeResource, setTradeResource] = useState('gold');
  const [tradeToTeamId, setTradeToTeamId] = useState('');

  // Загрузка данных
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Team ${teamName}: Загружаем данные...`);
      
      // Получаем данные команды из данных игры
      const gameRes = await fetch('/api/game');
      if (gameRes.ok) {
        const gameData = await gameRes.json();
        const teamData = gameData.teams?.find((t: any) => t.name === teamName);
        if (teamData) {
          setTeam(teamData);
          setCurrentCard(gameData.currentCard || null);
          setTeams(gameData.teams || []);
        } else {
          setError('Команда не найдена. Пожалуйста, инициализируйте игру через панель мастера.');
        }
      } else {
        setError('Ошибка при загрузке данных игры');
      }
      
    } catch (err) {
      console.error(`Team ${teamName}: Ошибка загрузки:`, err);
      setError('Ошибка при загрузке данных команды');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Обновляем каждые 10 секунд
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [teamName]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleAnswer = async (answer: Answer) => {
    setSelectedAnswer(answer);
    try {
      const response = await fetch('/api/teams/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: team.id, answer }),
      });
      
      if (response.ok) {
        alert('Ответ отправлен!');
        await loadData();
      } else {
        const data = await response.json();
        alert(`Ошибка: ${data.error}`);
      }
    } catch (error) {
      alert('Ошибка при отправке ответа');
      console.error(error);
    }
  };

  const handleBuyBuilding = async (buildingType: string) => {
    try {
      const prices: Record<string, Record<string, number>> = {
        wall: { gold: 2, wood: 0, stone: 0, blueprints: 0 },
        chizhik: { gold: 3, wood: 0, stone: 0, blueprints: 0 },
        pyaterochka: { gold: 5, wood: 0, stone: 0, blueprints: 0 },
        perekrestok: { gold: 7, wood: 0, stone: 0, blueprints: 0 },
        windmill: { gold: 0, wood: 1, stone: 1, blueprints: 1 },
      };

      const price = prices[buildingType];
      if (!price) return;

      const updates: any = {};
      for (const [resource, amount] of Object.entries(price)) {
        if (amount > 0) {
          updates[resource] = team[resource] - amount;
        }
      }
      updates[buildingType] = (team[buildingType] || 0) + 1;

      const response = await fetch(`/api/teams/by-id/${team.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        alert('Здание куплено!');
        await loadData();
      } else {
        const data = await response.json();
        alert(`Ошибка: ${data.error || 'Недостаточно ресурсов'}`);
      }
    } catch (error) {
      alert('Ошибка при покупке');
      console.error(error);
    }
  };

  const handleDestroyWall = async () => {
    try {
      const response = await fetch(`/api/teams/by-id/${team.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walls: team.walls - 1,
          wood: team.wood + 1,
        }),
      });

      if (response.ok) {
        alert('Стена разрушена!');
        await loadData();
      }
    } catch (error) {
      alert('Ошибка при разрушении стены');
      console.error(error);
    }
  };

  const handleSendTrade = async () => {
    if (!tradeToTeamId || !tradeAmount) {
      alert('Заполните все поля');
      return;
    }

    try {
      const response = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_team_id: team.id,
          to_team_id: tradeToTeamId,
          resource_type: tradeResource,
          amount: parseInt(tradeAmount, 10),
        }),
      });

      if (response.ok) {
        alert('Ресурсы отправлены!');
        setShowTrade(false);
        setTradeToTeamId('');
        setTradeAmount('1');
        await loadData();
      } else {
        const data = await response.json();
        alert(`Ошибка: ${data.error}`);
      }
    } catch (error) {
      alert('Ошибка при отправке ресурсов');
      console.error(error);
    }
  };

  // Проверка валидности имени команды
  if (!['north', 'south', 'east'].includes(teamName)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-2xl">Команда не найдена</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-2xl">Загрузка...</div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">
            {error || 'Команда не найдена'}
          </div>
          <div className="text-gray-400 mb-6">
            Пожалуйста, перейдите на панель мастера и нажмите кнопку "Старт" для инициализации игры.
          </div>
          <a 
            href="/master" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-block"
          >
            Перейти к панели мастера
          </a>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-white/80 text-sm">Прогресс</div>
                <div className="text-4xl font-bold text-white">{team.steps} <span className="text-2xl">шагов</span></div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white p-2 rounded-lg"
              >
                <RotateCcw size={24} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
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
            <div className="text-3xl font-bold text-white">{team.gold}</div>
          </div>
          
          <div className="bg-amber-700/20 border border-amber-600/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trees className="text-amber-500" size={24} />
              <span className="text-amber-500 font-semibold">Дерево</span>
            </div>
            <div className="text-3xl font-bold text-white">{team.wood}</div>
          </div>
          
          <div className="bg-gray-600/20 border border-gray-500/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mountain className="text-gray-400" size={24} />
              <span className="text-gray-400 font-semibold">Камень</span>
            </div>
            <div className="text-3xl font-bold text-white">{team.stone}</div>
          </div>
          
          <div className="bg-blue-600/20 border border-blue-500/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scroll className="text-blue-400" size={24} />
              <span className="text-blue-400 font-semibold">Чертежи</span>
            </div>
            <div className="text-3xl font-bold text-white">{team.blueprints}</div>
          </div>
        </div>

        {/* Инфраструктура */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Инфраструктура</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🧱</div>
              <div className="text-white font-semibold">Стены</div>
              <div className="text-2xl font-bold text-white">{team.walls}</div>
              {team.walls > 0 && (
                <button 
                  onClick={handleDestroyWall}
                  className="mt-2 text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                >
                  Разрушить
                </button>
              )}
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🐦</div>
              <div className="text-white font-semibold">Чижик</div>
              <div className="text-2xl font-bold text-white">{team.chizhik || 0}</div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">5️⃣</div>
              <div className="text-white font-semibold">Пятерочка</div>
              <div className="text-2xl font-bold text-white">{team.pyaterochka || 0}</div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">➕</div>
              <div className="text-white font-semibold">Перекресток</div>
              <div className="text-2xl font-bold text-white">{team.perekrestok || 0}</div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🌬️</div>
              <div className="text-white font-semibold">Мельница</div>
              <div className="text-2xl font-bold text-white">{team.windmill || 0}</div>
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
        {showCard && currentCard && (
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
              <div className="text-purple-400 text-sm mb-2">
                {currentCard.type === 'case' && 'Хроники'}
                {currentCard.type === 'test' && 'Тайны'}
                {currentCard.type === 'decree' && 'Указ'}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{currentCard.title}</h3>
              <p className="text-gray-300 mb-6">{currentCard.description}</p>
              <div className="space-y-3">
                <button 
                  onClick={() => handleAnswer('A')}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedAnswer === 'A' ? 'bg-purple-600' : 'bg-slate-600 hover:bg-slate-500'
                  } text-white`}
                >
                  <span className="font-bold text-purple-400 mr-2">A.</span>
                  {currentCard.option_a}
                </button>
                <button 
                  onClick={() => handleAnswer('B')}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedAnswer === 'B' ? 'bg-purple-600' : 'bg-slate-600 hover:bg-slate-500'
                  } text-white`}
                >
                  <span className="font-bold text-purple-400 mr-2">B.</span>
                  {currentCard.option_b}
                </button>
                <button 
                  onClick={() => handleAnswer('C')}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedAnswer === 'C' ? 'bg-purple-600' : 'bg-slate-600 hover:bg-slate-500'
                  } text-white`}
                >
                  <span className="font-bold text-purple-400 mr-2">C.</span>
                  {currentCard.option_c}
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
                    <button 
                      onClick={() => handleBuyBuilding('wall')}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
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
                    <button 
                      onClick={() => handleBuyBuilding('chizhik')}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
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
                    <button 
                      onClick={() => handleBuyBuilding('pyaterochka')}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
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
                    <button 
                      onClick={() => handleBuyBuilding('perekrestok')}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
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
                    <button 
                      onClick={() => handleBuyBuilding('windmill')}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
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
                  <select 
                    value={tradeToTeamId}
                    onChange={(e) => setTradeToTeamId(e.target.value)}
                    className="w-full bg-slate-700 text-white p-3 rounded-lg"
                  >
                    <option value="">Выберите команду...</option>
                    {teams
                      .filter((t: any) => t.name !== teamName)
                      .map((t: any) => (
                        <option key={t.id} value={t.id}>{TEAM_DISPLAY_NAMES[t.name as TeamName]}</option>
                      ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">Ресурс:</label>
                  <select 
                    value={tradeResource}
                    onChange={(e) => setTradeResource(e.target.value)}
                    className="w-full bg-slate-700 text-white p-3 rounded-lg"
                  >
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
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="w-full bg-slate-700 text-white p-3 rounded-lg"
                  />
                </div>
                
                <button 
                  onClick={handleSendTrade}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-bold"
                >
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
