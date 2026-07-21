import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Clock, PlayCircle, BookOpen } from 'lucide-react';
import { db } from '../storage/db';
import bank from '../data/question_bank.json';

export default function Dashboard() {
  const [stats, setStats] = useState<Record<string, { total: number, maxScore: number, lastDate: string | null }>>({});
  
  useEffect(() => {
    async function loadStats() {
      const attempts = await db.attempts.toArray();
      const newStats: Record<string, any> = {};
      
      for (const unit of bank.units) {
        const unitAttempts = attempts.filter(a => a.unitId === unit.id);
        const maxScore = unitAttempts.length > 0 ? Math.max(...unitAttempts.map(a => a.score)) : 0;
        const lastDate = unitAttempts.length > 0 
          ? new Date(Math.max(...unitAttempts.map(a => new Date(a.date).getTime()))).toLocaleDateString()
          : null;
          
        newStats[unit.id] = {
          total: unit.questions.length,
          maxScore,
          lastDate
        };
      }
      setStats(newStats);
    }
    loadStats();
  }, []);

  // Calculate global progress
  const totalQuestions = bank.units.reduce((acc, u) => acc + u.questions.length, 0);
  const totalMastered = Object.values(stats).reduce((acc, s) => acc + (s.maxScore > 80 ? s.total : 0), 0); // Consider mastered if >80% score? Or just progress. Let's do a simple ratio.
  const globalProgress = totalQuestions > 0 ? Math.round((totalMastered / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo</h2>
        <p className="text-muted-foreground mt-2">
          Continúa donde te quedaste y alcanza el nivel Excelente.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Progreso General</CardTitle>
          <CardDescription className="text-indigo-100">Dominio de la materia basado en tus mejores puntajes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={globalProgress} className="h-4 bg-indigo-950/30" />
            <span className="font-bold text-xl">{globalProgress}%</span>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          Unidades de Estudio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bank.units.map(unit => {
            const unitStat = stats[unit.id] || { total: unit.questions.length, maxScore: 0, lastDate: null };
            
            return (
              <Card key={unit.id} className="flex flex-col hover:shadow-md transition-shadow dark:bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{unit.title}</CardTitle>
                  <CardDescription>{unitStat.total} Preguntas</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mejor puntaje</span>
                      <span className="font-medium">{unitStat.maxScore}%</span>
                    </div>
                    <Progress value={unitStat.maxScore} className="h-2" />
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Última vez: {unitStat.lastDate || 'Nunca'}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/unit/${unit.id}`} className="w-full">
                    <Button className="w-full gap-2">
                      <PlayCircle className="w-4 h-4" />
                      Resolver
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
