const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const pdfDir = path.join(process.cwd(), 'Cuestionarios');
const outputFile = path.join(process.cwd(), 'src', 'data', 'question_bank.json');

async function extractQuestions() {
  const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
  const bank = { units: [] };

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(pdfDir, fileName);
    console.log(`Procesando: ${fileName}`);
    
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({ data: dataBuffer });
      const result = await parser.getText();
      const text = result.text;
      
      const unit = {
        id: `u${i + 1}`,
        title: fileName.replace('.pdf', ''),
        questions: []
      };

      // Expresión regular para extraer bloques de preguntas.
      // Busca "Pregunta X" y captura todo hasta la próxima "Pregunta X" o el final del archivo.
      const questionBlocks = text.split(/Pregunta \d+\n/g).slice(1);
      
      let qIndex = 1;
      for (const block of questionBlocks) {
        // Limpiamos líneas extrañas de paginación o headers/footers si los hubiera
        let cleanedBlock = block.replace(/-- \d+ of \d+ --/g, '');
        
        // 1. Encontrar el inicio del enunciado de la pregunta.
        // Después de "Correcta\nSe puntúa X sobre Y", viene el enunciado (puede tener un número "1. ").
        // Buscamos algo parecido a "Se puntúa .*?\n(.*?)\na\."
        // Una manera más robusta:
        const answerPattern = /La respuesta correcta es:([\s\S]*?)(\n⌃|\nPregunta|$)/;
        const answerMatch = cleanedBlock.match(answerPattern);
        const correctAnswerText = answerMatch ? answerMatch[1].trim().replace(//g, '').trim() : '';

        const optionsPattern = /([a-e]\.)([\s\S]*?)(?=(?:[a-e]\.|$|La respuesta correcta es:))/g;
        let optionMatches = [...cleanedBlock.matchAll(optionsPattern)];
        
        // Si no hay opciones estructuradas a., b., puede que el formato varíe.
        if (optionMatches.length === 0) continue;
        
        // Extraer el enunciado
        // El enunciado es todo lo que está antes de la primera opción "a."
        const firstOptionIndex = cleanedBlock.indexOf(optionMatches[0][0]);
        let rawQuestionText = cleanedBlock.substring(0, firstOptionIndex);
        
        // Limpiamos "Correcta", "Incorrecta", "Se puntúa..." del enunciado
        rawQuestionText = rawQuestionText.replace(/(Correcta|Incorrecta|Finalizado)/g, '');
        rawQuestionText = rawQuestionText.replace(/Se puntúa .*?sobre .*?\n/g, '');
        
        // Eliminamos el número inicial tipo "1. " o "26. " del enunciado
        rawQuestionText = rawQuestionText.replace(/^\s*\d+\.\s*/, '').trim();
        // Unir saltos de línea dentro del enunciado para que quede como un solo párrafo fluido (opcional)
        rawQuestionText = rawQuestionText.replace(/\n/g, ' ').trim();

        if (!rawQuestionText) continue;

        const options = [];
        let correctOptionId = null;

        optionMatches.forEach((match, index) => {
          let optText = match[2].trim();
          
          // Moodle inserta caracteres raros como '' (check icon) o '' (cross icon) en la opción que el usuario seleccionó.
          const isMarkedCorrectByIcon = optText.includes('');
          optText = optText.replace(/[]/g, '').trim();
          optText = optText.replace(/\n/g, ' ').trim();
          
          const optId = `o${index + 1}`;
          options.push({ id: optId, text: optText });

          // Si el texto de la opción coincide con el de "La respuesta correcta es:", marcarla como correcta.
          if (correctAnswerText && correctAnswerText.includes(optText)) {
             correctOptionId = optId;
          }
        });

        // Fallback: Si no se encontró mediante coincidencia de texto, usamos el ícono de Moodle si está presente
        if (!correctOptionId && options.length > 0) {
          const marked = optionMatches.findIndex(m => m[2].includes(''));
          if (marked !== -1) {
            correctOptionId = `o${marked + 1}`;
          } else {
             // Si no hay forma, forzamos la a (fallback)
             correctOptionId = 'o1';
          }
        }

        unit.questions.push({
          id: `q${unit.id}_${qIndex++}`,
          text: rawQuestionText,
          options: options,
          correctOptionId: correctOptionId,
          explanation: "" // Moodle revision doesn't provide detailed explanation in text generally
        });
      }
      
      if (unit.questions.length > 0) {
        bank.units.push(unit);
      }
      
      await parser.destroy();
    } catch (e) {
      console.error(`Error procesando ${fileName}:`, e.message);
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(bank, null, 2), 'utf-8');
  console.log(`\n¡Extracción completada! Se guardaron ${bank.units.length} módulos en question_bank.json`);
}

extractQuestions();
