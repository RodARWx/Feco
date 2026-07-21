import React from 'react';
import bankData from '../data/question_bank.json';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

export default function QuestionBank() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Banco de Preguntas</h1>
        <p className="text-muted-foreground">Explora todas las preguntas extraídas de tus PDFs organizadas por cuestionario.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bankData.units.map(unit => (
          <Card key={unit.id} className="border-border">
            <CardHeader className="bg-muted/50 rounded-t-lg border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{unit.title}</CardTitle>
                <Badge variant="secondary">{unit.questions.length} preguntas</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-6 space-y-6">
                  {unit.questions.map((q, i) => (
                    <div key={q.id} className="space-y-4">
                      <div className="flex gap-4">
                        <span className="font-mono text-muted-foreground font-semibold bg-muted px-2 py-1 rounded-md h-fit">
                          Q{i + 1}
                        </span>
                        <div className="space-y-3 flex-1">
                          <p className="text-sm font-medium leading-relaxed">{q.text}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map(opt => (
                              <div 
                                key={opt.id} 
                                className={`text-xs p-3 rounded-md border ${
                                  opt.id === q.correctOptionId 
                                    ? 'bg-primary/10 border-primary text-primary font-medium' 
                                    : 'bg-muted/30 border-transparent text-muted-foreground'
                                }`}
                              >
                                {opt.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {i < unit.questions.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
