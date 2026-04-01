'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TEAM_DISPLAY_NAMES, TEAM_COLORS, TEAM_ICONS, TeamName } from '@/types/game';
import { MapPin, Trophy, Flag } from 'lucide-react';

export default function BoardPage() {
  const { teams } = useGameStore();
  const [animatedSteps, setAnimatedSteps] = useState<Record<TeamName, number>>({
    north: 0,
    south: 0,
    east: 0,
  });

  // Mock данные для демонстрации
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

  const totalSteps = mockTeams.reduce((sum, team) => sum + team.steps, 0);
  const victoryThreshold = 150;
  const progressPercentage = Math.min((totalSteps / victoryThreshold) * 100, 100);

  // Анимация шагов
  useEffect(() => {
    mockTeams.forEach((team) => {
      const targetSteps = team.steps;
      const currentSteps = animatedSteps[team.name];
      
      if (currentSteps !== targetSteps) {
        const duration = 500;
        const steps = targetSteps - currentSteps;
        const interval = duration / Math.abs(steps);
        
        const timer = setInterval(() => {
          setAnimatedSteps((prev) => {
            const newSteps = { ...prev };
            if (newSteps[team.name] < targetSteps) {
              newSteps[team.name] += 1;
            } else if (newSteps[team.name] > targetSteps) {
              newSteps[team.name] -= 1;
            }
            return newSteps;
          });
        }, interval);
        
        return () => clearInterval(timer);
      }
    });
  }, [mockTeams]);

  const MAX_STEPS = 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-2">ГЛОБАЛЬНАЯ КАРТА</h1>
          <p className="text-2xl text-indigo-200">Путь к Столице</p>
        </div>

        {/* Общий прогресс */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-400" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-white">Общий прогресс</h2>
                <p className="text-gray-400">Цель: {victoryThreshold} шагов</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-white">{totalSteps}</div>
              <div className="text-gray-400">шагов</div>
            </div>
          </div>
          
          <div className="bg-slate-700 rounded-full h-8 overflow-hidden">
            <div
              className="progress-bar bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full flex items-center justify-end pr-4"
              style={{ width: `${progressPercentage}%` }}
            >
              <span className="text-white font-bold text-sm">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>

        {/* Треки команд */}
        <div className="space-y-6">
          {mockTeams.map((team) => (
            <div key={team.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{TEAM_ICONS[team.name]}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{team.display_name}</h3>
                    <p className="text-gray-400">{animatedSteps[team.name]} / {MAX_STEPS} шагов</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{team.steps}</div>
                  <div className="text-gray-400">шагов</div>
                </div>
              </div>

              {/* Визуальный трек */}
              <div className="relative">
                {/* Линия трека */}
                <div className="bg-slate-700 rounded-full h-12 overflow-hidden relative">
                  {/* Прогресс-бар */}
                  <div
                    className={`progress-bar ${TEAM_COLORS[team.name]} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${(animatedSteps[team.name] / MAX_STEPS) * 100}%` }}
                  />
                  
                  {/* Метки на треке */}
                  <div className="absolute inset-0 flex items-center justify-between px-2">
                    {[0, 10, 20, 30, 40, 50].map((step) => (
                      <div
                        key={step}
                        className="relative"
                        style={{ left: `${(step / MAX_STEPS) * 100}%` }}
                      >
                        <div className="w-1 h-6 bg-white/30 rounded" />
                        {step === 30 && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            Гейтвей
                          </div>
                        )}
                        {step === 50 && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap flex items-center gap-1">
                            <Flag size={12} />
                            Столица
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Фишка команды */}
                <div
                  className="token absolute top-1/2 transform -translate-y-1/2 transition-all duration-500"
                  style={{ left: `${Math.min((animatedSteps[team.name] / MAX_STEPS) * 100, 100)}%` }}
                >
                  <div className={`${TEAM_COLORS[team.name]} rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-4 border-white`}>
                    <span className="text-xl">{TEAM_ICONS[team.name]}</span>
                  </div>
                </div>
              </div>

              {/* Статус гейтвея */}
              {animatedSteps[team.name] >= 30 && team.windmill === 0 && (
                <div className="mt-4 bg-red-600/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-3">
                  <MapPin className="text-red-400" size={24} />
                  <div>
                    <div className="text-red-400 font-bold">Гейтвей заблокирован!</div>
                    <div className="text-red-300 text-sm">Требуется Ветряная Мельница для прохода</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Легенда */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Легенда</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-purple-600 rounded" />
              <span className="text-gray-300">Гейтвей (30 шагов) - требуется Мельница</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-600 rounded" />
              <span className="text-gray-300">Столица (50 шагов) - финальная цель</span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-400" size={20} />
              <span className="text-gray-300">Победа: более 150 шагов суммарно</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
