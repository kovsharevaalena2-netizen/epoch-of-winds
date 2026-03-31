import Link from "next/link";
import { TEAM_DISPLAY_NAMES, TEAM_ICONS, TEAM_COLORS } from "@/types/game";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-white mb-4 tracking-wider">
          ЭПОХА ВЕТРОВ
        </h1>
        <p className="text-2xl text-purple-200 mb-8 font-light">
          ОБРАЩАЯ В СИЛУ
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <Link
            href="/team/north"
            className={`${TEAM_COLORS.north} hover:opacity-90 text-white p-8 rounded-xl shadow-lg transition-all transform hover:scale-105`}
          >
            <div className="text-4xl mb-4">{TEAM_ICONS.north}</div>
            <h2 className="text-2xl font-bold mb-2">{TEAM_DISPLAY_NAMES.north}</h2>
            <p className="text-blue-100">Вход для команды</p>
          </Link>
          
          <Link
            href="/team/south"
            className={`${TEAM_COLORS.south} hover:opacity-90 text-white p-8 rounded-xl shadow-lg transition-all transform hover:scale-105`}
          >
            <div className="text-4xl mb-4">{TEAM_ICONS.south}</div>
            <h2 className="text-2xl font-bold mb-2">{TEAM_DISPLAY_NAMES.south}</h2>
            <p className="text-orange-100">Вход для команды</p>
          </Link>
          
          <Link
            href="/team/east"
            className={`${TEAM_COLORS.east} hover:opacity-90 text-white p-8 rounded-xl shadow-lg transition-all transform hover:scale-105`}
          >
            <div className="text-4xl mb-4">{TEAM_ICONS.east}</div>
            <h2 className="text-2xl font-bold mb-2">{TEAM_DISPLAY_NAMES.east}</h2>
            <p className="text-green-100">Вход для команды</p>
          </Link>
        </div>
        
        <div className="mt-12 space-y-4">
          <Link
            href="/master"
            className="block bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 text-xl font-bold"
          >
            🔮 ПАНЕЛЬ МАГИСТРА
          </Link>
          
          <Link
            href="/board"
            className="block bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 text-xl font-bold"
          >
            🗺️ ГЛОБАЛЬНАЯ КАРТА
          </Link>
        </div>
      </div>
    </main>
  );
}
