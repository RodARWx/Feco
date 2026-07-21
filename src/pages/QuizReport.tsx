import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../storage/db';
import bank from '../data/question_bank.json';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { CheckCircle2, XCircle, ArrowLeft, Lightbulb, Trophy } from 'lucide-react';

export default function QuizReport() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState<any>(null);
  const [unit, setUnit] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      if (!attemptId) return;
      const att = await db.attempts.get(Number(attemptId));
      if (att) {
        setAttempt(att);
        const u = bank.units.find(u => u.id === att.unitId);
        setUnit(u);
      }
    }
    loadData();
  }, [attemptId]);

  if (!attempt || !unit) return <div className="p-8 text-center">Cargando reporte...</div>;

  const isExcellent = attempt.score >= 90;
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Dashboard
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline">Exportar a PDF</Button>
        </div>
      </div>

      {/* Header Summary */}
      <div className="text-center space-y-4 py-8">
        {isExcellent && (
          <div className="inline-flex justify-center items-center p-4 bg-yellow-100 text-yellow-600 rounded-full mb-4">
            <Trophy className="w-12 h-12" />
          </div>
        )}
        <h1 className="text-4xl font-extrabold tracking-tight">Reporte de Resultados</h1>
        <p className="text-xl text-muted-foreground">{unit.title}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-indigo-50 dark:bg-indigo-900/10 border-none shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">Puntaje</div>
            <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-100">{attempt.score}%</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-none shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Correctas</div>
            <div className="text-4xl font-bold text-emerald-900 dark:text-emerald-100">{attempt.correctAnswers}</div>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 dark:bg-rose-900/10 border-none shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-sm font-medium text-rose-600 dark:text-rose-400 mb-1">Incorrectas</div>
            <div className="text-4xl font-bold text-rose-900 dark:text-rose-100">{attempt.incorrectAnswers}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-100 dark:bg-slate-800 border-none shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-sm font-medium text-slate-500 mb-1">Tiempo</div>
            <div className="text-4xl font-bold text-slate-700 dark:text-slate-200">
              {Math.floor(attempt.timeSpent / 60)}:{(attempt.timeSpent % 60).toString().padStart(2, '0')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nivel Alcanzado</CardTitle>
          <CardDescription>Basado en tu rendimiento en esta unidad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={attempt.score} className="h-4 flex-1" />
            <span className="font-bold w-24 text-right">
              {attempt.score >= 90 ? 'Excelente' : attempt.score >= 70 ? 'Avanzado' : attempt.score >= 40 ? 'Intermedio' : 'Principiante'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <h3 className="text-2xl font-bold mt-12 mb-6">Retroalimentación Detallada</h3>
      <div className="space-y-6">
        {unit.questions.map((q: any, i: number) => {
          const userAnsId = attempt.answers[q.id];
          const isCorrect = userAnsId === q.correctOptionId;
          const userOption = q.options.find((o:any) => o.id === userAnsId);
          const correctOption = q.options.find((o:any) => o.id === q.correctOptionId);

          return (
            <Card key={q.id} className={`border-l-4 ${isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
                  )}
                  <div>
                    <CardTitle className="text-lg leading-snug">{i + 1}. {q.text}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pl-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20' : 'bg-rose-50 border-rose-200 dark:bg-rose-900/20'}`}>
                    <div className="text-xs font-semibold uppercase mb-1 opacity-70">Tu Respuesta</div>
                    <div className="font-medium">{userOption?.text || 'Sin responder'}</div>
                  </div>
                  {!isCorrect && (
                    <div className="p-4 rounded-lg border bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20">
                      <div className="text-xs font-semibold uppercase mb-1 opacity-70 text-emerald-700">Respuesta Correcta</div>
                      <div className="font-medium text-emerald-900 dark:text-emerald-100">{correctOption?.text}</div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border flex gap-3 mt-4">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold block mb-1 text-slate-900 dark:text-slate-100">Explicación:</span>
                    {q.explanation}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
