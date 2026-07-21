import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, PlayCircle, Clock, Target, AlertCircle } from 'lucide-react';
import bank from '../data/question_bank.json';

export default function UnitView() {
  const { unitId } = useParams();
  const unit = bank.units.find(u => u.id === unitId);

  if (!unit) {
    return <div>Unidad no encontrada</div>;
  }

  const estimatedTime = Math.ceil(unit.questions.length * 1.5); // 1.5 mins per question

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al Dashboard
      </Link>

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">{unit.title}</h1>
        <p className="text-xl text-muted-foreground">Estás a punto de iniciar una nueva sesión de estudio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Preguntas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-blue-900 dark:text-blue-300">{unit.questions.length}</span>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Tiempo Estimado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">{estimatedTime} min</span>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Dificultad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-amber-900 dark:text-amber-300">Media</span>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-8">
        <Link to={`/quiz/${unit.id}`}>
          <Button size="lg" className="h-16 px-12 text-lg gap-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all bg-indigo-600 hover:bg-indigo-700 text-white">
            <PlayCircle className="w-6 h-6" />
            ¡Comenzar Cuestionario!
          </Button>
        </Link>
      </div>
    </div>
  );
}
