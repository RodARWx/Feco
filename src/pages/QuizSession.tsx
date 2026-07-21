import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle2, Bookmark } from 'lucide-react';
import { db } from '../storage/db';
import { useAppStore } from '../store/useAppStore';
import bank from '../data/question_bank.json';

export default function QuizSession() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const addXP = useAppStore(state => state.addXP);
  const updateStreak = useAppStore(state => state.updateStreak);
  
  const unit = bank.units.find(u => u.id === unitId);
  const questions = unit?.questions || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime] = useState<Date>(new Date());
  
  if (!unit || questions.length === 0) return <div>No hay preguntas</div>;
  
  const currentQ = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
  
  const handleSelect = (optionId: string) => {
    setAnswers({ ...answers, [currentQ.id]: optionId });
  };
  
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleFinish = async () => {
    // Calculate results
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    
    questions.forEach(q => {
      const userAns = answers[q.id];
      if (!userAns) unanswered++;
      else if (userAns === q.correctOptionId) correct++;
      else incorrect++;
    });
    
    const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    const score = Math.round((correct / questions.length) * 100);
    
    const attemptId = await db.attempts.add({
      unitId: unit.id,
      date: new Date(),
      score,
      totalQuestions: questions.length,
      timeSpent,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unanswered,
      answers
    });
    
    // Update stats
    addXP(score * 2); // basic calculation
    updateStreak();
    
    navigate(`/report/${attemptId}`);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pt-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/unit/${unit.id}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Salir
        </Button>
        <span className="font-medium text-muted-foreground">Pregunta {currentIndex + 1} de {questions.length}</span>
        <Button variant="outline" size="sm">
          <Bookmark className="w-4 h-4 mr-2" /> Marcar
        </Button>
      </div>
      
      <Progress value={progress} className="h-2 mb-8" />
      
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 leading-tight">
              {currentQ.text}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.id;
                return (
                  <Card 
                    key={opt.id}
                    className={`cursor-pointer transition-all duration-200 border-2 ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-transparent hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => handleSelect(opt.id)}
                  >
                    <CardContent className="p-6 flex items-center justify-between">
                      <span className={`text-lg ${isSelected ? 'font-medium text-indigo-900 dark:text-indigo-100' : ''}`}>
                        {opt.text}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-indigo-600"
                        >
                          <CheckCircle2 className="w-6 h-6" />
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between items-center py-6 border-t mt-auto">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
        >
          Anterior
        </Button>
        
        {currentIndex < questions.length - 1 ? (
          <Button size="lg" onClick={handleNext} disabled={!answers[currentQ.id]} className="px-8">
            Siguiente <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button size="lg" onClick={handleFinish} disabled={!answers[currentQ.id]} className="bg-emerald-600 hover:bg-emerald-700 px-8 text-white">
            Finalizar Cuestionario
          </Button>
        )}
      </div>
    </div>
  );
}
