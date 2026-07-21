import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { LayoutDashboard, Library, LineChart, Flame, Moon, Sun, Brain } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

export default function DashboardLayout() {
  const { theme, setTheme, userStats } = useAppStore();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Banco de Preguntas', href: '/bank', icon: Library },
    { name: 'Estadísticas', href: '/statistics', icon: LineChart },
    { name: 'Simulador', href: '/simulator', icon: Brain },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-900 border-r dark:border-slate-800">
        <div className="p-6 flex items-center gap-2">
          <Brain className="w-8 h-8 text-indigo-600" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            EcoStudy
          </h1>
        </div>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 ${isActive ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-300' : ''}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b dark:border-slate-800">
          <div className="flex items-center gap-4">
            {/* Mobile menu could go here */}
            <div className="md:hidden flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              <span className="font-bold">EcoStudy</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Gamification Stats */}
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1.5 text-orange-500 bg-orange-100 dark:bg-orange-500/10 px-3 py-1.5 rounded-full">
                <Flame className="w-4 h-4" />
                <span>{userStats.streak} días</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full">
                <span>Nvl {userStats.level}</span>
                <span className="text-xs opacity-80">({userStats.xp} XP)</span>
              </div>
            </div>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
