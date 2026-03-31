'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TEAM_DISPLAY_NAMES, TEAM_COLORS, TEAM_ICONS, TeamName } from '@/types/game';
import { Play, Pause, RotateCcw, Plus, Minus, ArrowRight, Scroll, Crown } from 'lucide-react';

export default function MasterPage() {
  const { game, teams } = useGameStore();
  
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showCardSelector, setShowCardSelector] = useState(false);

  // Mock данные для демонстрации
  const mockGame = game || {
    id: '1',
    name: 'Эпоха Ветров',
    current_epoch: 1,
    current_turn: 1,
    current_card_id: null,
    is_active: true,
    created_at: '',
    updated_at: '',
  };

  const mockTeams = teams.length > 0 ? teams : [
    {
      id: '1',
      game_id: '1',
      name: 'north' as TeamName,
      display_name: TEAM_DISPLAY_NAMES.north,
      gold: 10,
      wood: 5,
      stone: 0,
      blueprints: 0,
      steps: 0,
      walls: 0,
      chizhik: 0,
      pyaterochka: 0,
      perekrestok: 0,
      windmill: 0,
      current_answer: null,
      created_at: '',
      updated_at: '',
    },
    {
      id: '2',
      game_id: '1',
      name: 'south' as TeamName,
      display_name: TEAM_DISPLAY_NAMES.south,
      gold: 10,
      wood: 0,
      stone: 5,
      blueprints: 0,
      steps: 0,
      walls: 0,
      chizhik: 0,
      pyaterochka: 0,
      perekrestok: 0,
      windmill: 0,
      current_answer: null,
      created_at: '',
      updated_at: '',
    },
    {
      id: '3',
      game_id: '1',
      name: 'east' as TeamName,
      display_name: TEAM_DISPLAY_NAMES.east,
      gold: 10,
      wood: 0,
      stone: 0,
      blueprints: 5,
      steps: 0,
      walls: 0,
      chizhik: 0,
      pyaterochka: 0,
      perekrestok: 0,
      windmill: 0,
      current_answer: null,
      created_at: '',
      updated_at: '',
    },
  ];

  const mockCards = [
    { id: '1', type: 'case', title: 'Хроники: Торговый путь', epoch: 1 },
    { id: '2', type: 'case', title: 'Хроники: Засуха', epoch: 1 },
    { id: '3', type: 'test', title: 'Тайны: Древний договор', epoch: 1 },
    { id: '4', type: 'test', title: 'Тайны: Ресурсы', epoch: 1 },
    { id: '5', type: 'decree', title: 'Указ: Налоговая реформа', epoch: 1 },
  ];

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
            <div className="text-3xl font-bold text-white">{mockGame.current_epoch} / 4</div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Ход</div>
            <div className="text-3xl font-bold text-white">{mockGame.current_turn}</div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Статус</div>
            <div className={`text-xl font-bold ${mockGame.is_active ? 'text-green-400' : 'text-red-400'}`}>
              {mockGame.is_active ? 'Активна' : 'Пауза'}
            </div>
          </div>
        </div>

        {/* Управление игрой */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Управление игрой</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center justify-center gap-2">
              <Play size={20} />
              <span>Старт</span>
            </button>
            
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg flex items-center justify-center gap-2">
              <Pause size={20} />
              <span>Пауза</span>
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-center gap-2">
              <ArrowRight size={20} />
              <span>След. ход</span>
            </button>
            
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center justify-center gap-2">
              <RotateCcw size={20} />
              <span>Новая эпоха</span>
            </button>
          </div>
        </div>

        {/* Статистика команд */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Статистика команд</h2>
          <div className="space-y-4">
            {mockTeams.map((team) => (
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
            onClick={() => setShowCardSelector(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center justify-center gap-2 w-full"
          >
            <Scroll size={24} />
            <span>Отправить карточку командам</span>
          </button>
        </div>

        {/* Ручное управление ресурсами */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Ручное управление ресурсами</h2>
          <div className="space-y-4">
            {mockTeams.map((team) => (
              <div key={team.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{TEAM_ICONS[team.name]}</div>
                  <div className="text-white font-bold">{team.display_name}</div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="flex items-center justify-between bg-slate-600/50 rounded p-2">
                    <span className="text-yellow-400">💰</span>
                    <div className="flex items-center gap-2">
                      <button className="bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded flex items-center justify-center">
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold">{team.gold}</span>
                      <button className="bg-green-600 hover:bg-green-700 text-white w-6 h-6 rounded flex items-center justify-center">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-600/50 rounded p-2">
                    <span className="text-amber-500">🪵</span>
                    <div className="flex items-center gap-2">
                      <button className="bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded flex items-center justify-center">
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold">{team.wood}</span>
                      <button className="bg-green-600 hover:bg-green-700 text-white w-6 h-6 rounded flex items-center justify-center">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-600/50 rounded p-2">
                    <span className="text-gray-400">🪨</span>
                    <div className="flex items-center gap-2">
                      <button className="bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded flex items-center justify-center">
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold">{team.stone}</span>
                      <button className="bg-green-600 hover:bg-green-700 text-white w-6 h-6 rounded flex items-center justify-center">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-600/50 rounded p-2">
                    <span className="text-blue-400">📜</span>
                    <div className="flex items-center gap-2">
                      <button className="bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded flex items-center justify-center">
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold">{team.blueprints}</span>
                      <button className="bg-green-600 hover:bg-green-700 text-white w-6 h-6 rounded flex items-center justify-center">
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
                {mockCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      setSelectedCard(card.id);
                      setShowCardSelector(false);
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
