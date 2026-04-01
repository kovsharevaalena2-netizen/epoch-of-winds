'use client';

import { useState } from 'react';
import { useGame } from '@/hooks/useGame';
import { TEAM_DISPLAY_NAMES, TEAM_COLORS, TEAM_ICONS, TeamName } from '@/types/game';
import { Play, Pause, RotateCcw, Plus, Minus, ArrowRight, Scroll, Crown } from 'lucide-react';

export default function MasterPage() {
  const { game, teams, currentCard, refetch } = useGame();
  
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [cards, setCards] = useState<any[]>([]);

  // Загрузка карточек
  const fetchCards = async () => {
    try {
      const response = await fetch('/api/cards');
      const data = await response.json();
      setCards(data.cards || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const handleStartGame = async () => {
    try {
      const response = await fetch('/api/game/init', { method: 'POST' });
      if (response.ok) {
        await refetch();
        alert('Игра инициализирована!');
      }
    } catch (error) {
      alert('Ошибка при инициализации игры');
      console.error(error);
    }
  };

  const handleNextTurn = async () => {
    if (!game) return;
    
    try {
      const response = await fetch('/api/teams/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: game.id }),
      });
      
      if (response.ok) {
        await refetch();
        alert('Ход рассчитан!');
      }
    } catch (error) {
      alert('Ошибка при расчете хода');
      console.error(error);
    }
  };

  const handleNextEpoch = async () => {
    if (!game) return;
    
    try {
      const response = await fetch('/api/game', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_epoch: game.current_epoch + 1 }),
      });
      
      if (response.ok) {
        await refetch();
        alert('Эпоха переключена!');
      }
    } catch (error) {
      alert('Ошибка при переключении эпохи');
      console.error(error);
    }
  };

  const handleSendCard = async () => {
    if (!game || !selectedCardId) return;
    
    try {
      const response = await fetch('/api/game', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_card_id: selectedCardId }),
      });
      
      if (response.ok) {
        await refetch();
        setShowCardSelector(false);
        alert('Карточка отправлена!');
      }
    } catch (error) {
      alert('Ошибка при отправке карточки');
      console.error(error);
    }
  };

  const handleModifyResource = async (teamId: string, resource: string, delta: number) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/resources`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource, delta }),
      });
      
      if (response.ok) {
        await refetch();
      }
    } catch (error) {
      console.error('Error modifying resource:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="bg-purple-800/50 border border-purple-600 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <Crown className="text-yellow-400" size={48} />
            <div>
              <h1 className="text-4xl font-bold text-white">ПАНЕЛЬ МАГИСТРА</h1>
              <p className="text-purple-200">Управление игрой</p>
            </div>
          </div>
        </div>

        {/* Информация об игре */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Эпоха</div>
            <div className="text-3xl font-bold text-white">{game?.current_epoch || 1} / 4</div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Ход</div>
            <div className="text-3xl font-bold text-white">{game?.current_turn || 1}</div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Статус</div>
            <div className={`text-xl font-bold ${game?.is_active ? 'text-green-400' : 'text-red-400'}`}>
              {game?.is_active ? 'Активна' : 'Пауза'}
            </div>
          </div>
        </div>

        {/* Управление игрой */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Управление игрой</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={handleStartGame}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
            >
              <Play size={20} />
              <span>Старт</span>
            </button>
            
            <button 
              onClick={() => fetch('/api/game', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: false }),
              }).then(refetch)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
            >
              <Pause size={20} />
              <span>Пауза</span>
            </button>
            
            <button 
              onClick={handleNextTurn}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
            >
              <ArrowRight size={20} />
              <span>След. ход</span>
            </button>
            
            <button 
              onClick={handleNextEpoch}
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              <span>Новая эпоха</span>
            </button>
          </div>
        </div>

        {/* Статистика команд */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Статистика команд</h2>
          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team.id} className={`${TEAM_COLORS[team.name]}/20 border ${TEAM_COLORS[team.name]}/50 rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{TEAM_ICONS[team.name]}</div>
                    <div>
                      <div className="text-white font-bold text-lg">{team.display_name}</div>
                      <div className="text-white/70 text-sm">Ответ: {team.current_answer || 'Не выбран'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-2xl">{team.steps} шагов</div>
                    <div className="text-white/70 text-sm">{team.gold} 💰</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="bg-slate-700/50 rounded p-2">
                    <div className="text-amber-500">🪵 {team.wood}</div>
                  </div>
                  <div className="bg-slate-700/50 rounded p-2">
                    <div className="text-gray-400">🪨 {team.stone}</div>
                  </div>
                  <div className="bg-slate-700/50 rounded p-2">
                    <div className="text-blue-400">📜 {team.blueprints}</div>
                  </div>
                  <div className="bg-slate-700/50 rounded p-2">
                    <div className="text-white">🌬️ {team.windmill}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Управление карточками */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Управление карточками</h2>
          <button
            onClick={() => {
              fetchCards();
              setShowCardSelector(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center justify-center gap-2 w-full"
          >
            <Scroll size={24} />
            <span>Отправить карточку командам</span>
          </button>
          {currentCard && (
            <div className="mt-4 bg-slate-700/50 rounded-lg p-4">
              <div className="text-purple-400 text-sm mb-2">
                {currentCard.type === 'case' && 'Хроники'}
                {currentCard.type === 'test' && 'Тайны'}
                {currentCard.type === 'decree' && 'Указ'}
              </div>
              <div className="text-white font-bold">{currentCard.title}</div>
            </div>
          )}
        </div>

        {/* Ручное управление ресурсами */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Ручное управление ресурсами</h2>
          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{TEAM_ICONS[team.name]}</div>
                  <div className="text-white font-bold">{team.display_name}</div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="flex items-center justify-between bg-slate-600/50 rounded p-2">
                    <span className="text-yellow-400">💰</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleModifyResource(team.id, 'gold', -1)}
                        className="bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold">{team.gold}</span>
                      <button 
                        onClick={() => handleModifyResource(team.id, 'gold', 1)}
                        className="bg-green-600 hover:bg-green-700 text-white w-6 h-6 rounded flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-600/50 rounded p-2">
                    <span className="text-amber-500">🪵</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleModifyResource(team.id, 'wood', -1)}
                        className="bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold">{team.wood}</span>
                      <button 
                        onClick={() => handleModifyResource(team.id, 'wood', 1)}
                        className="bg-green-600 hover:bg-green-700 text-white w-6 h-6 rounded flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-600/50 rounded p-2">
                    <span className="text-gray-400">🪨</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleModifyResource(team.id, 'stone', -1)}
                        className="bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold">{team.stone}</span>
                      <button 
                        onClick={() => handleModifyResource(team.id, 'stone', 1)}
                        className="bg-green-600 hover:bg-green-700 text-white w-6 h-6 rounded flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-600/50 rounded p-2">
                    <span className="text-blue-400">📜</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleModifyResource(team.id, 'blueprints', -1)}
                        className="bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold">{team.blueprints}</span>
                      <button 
                        onClick={() => handleModifyResource(team.id, 'blueprints', 1)}
                        className="bg-green-600 hover:bg-green-700 text-white w-6 h-6 rounded flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Модалка выбора карточки */}
        {showCardSelector && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Выберите карточку</h2>
                <button
                  onClick={() => setShowCardSelector(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      setSelectedCardId(card.id);
                      handleSendCard();
                    }}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg text-left transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-purple-400 text-sm mb-1">
                          {card.type === 'case' && 'Хроники'}
                          {card.type === 'test' && 'Тайны'}
                          {card.type === 'decree' && 'Указ'}
                        </div>
                        <div className="font-bold">{card.title}</div>
                      </div>
                      <div className="text-gray-400 text-sm">Эпоха {card.epoch}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
