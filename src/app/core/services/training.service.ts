import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TrainingQuestion {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number; // Index 0-3
    subject: 'math' | 'reading' | 'logic';
    explanation?: string;
    category?: string; // Added for compatibility with user JSON
    question?: string; // Added for compatibility with user JSON
}

@Injectable({
    providedIn: 'root'
})
export class TrainingService {
    private allQuestions: TrainingQuestion[] = [];

    private staticQuestions: TrainingQuestion[] = [
        {
            id: '1',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Si f(x) = 2x² - 3x + 1, ¿cuál es el valor de f(-2)?',
            text: 'Si f(x) = 2x² - 3x + 1, ¿cuál es el valor de f(-2)?',
            options: ['15', '3', '-1', '5'],
            correctAnswer: 0,
            explanation: 'Sustituyendo x por -2: 2(-2)² - 3(-2) + 1 = 2(4) + 6 + 1 = 8 + 6 + 1 = 15.'
        },
        {
            id: '2',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuál es la pendiente de la recta que pasa por los puntos A(2, 3) y B(6, 11)?',
            text: '¿Cuál es la pendiente de la recta que pasa por los puntos A(2, 3) y B(6, 11)?',
            options: ['2', '0.5', '4', '8'],
            correctAnswer: 0,
            explanation: 'La fórmula es m = (y2 - y1) / (x2 - x1). Sustituyendo: (11 - 3) / (6 - 2) = 8 / 4 = 2.'
        },
        {
            id: '3',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Al lanzar dos dados, ¿cuál es la probabilidad de que la suma de sus caras sea 7?',
            text: 'Al lanzar dos dados, ¿cuál es la probabilidad de que la suma de sus caras sea 7?',
            options: ['1/6', '1/12', '1/36', '5/36'],
            correctAnswer: 0,
            explanation: 'Hay 36 combinaciones totales. Las que suman 7 son: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Son 6 casos favorables. 6/36 = 1/6.'
        },
        {
            id: '4',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Simplifica la expresión: (x² - 9) / (x - 3)',
            text: 'Simplifica la expresión: (x² - 9) / (x - 3)',
            options: ['x + 3', 'x - 3', 'x + 9', 'x'],
            correctAnswer: 0,
            explanation: 'El numerador es una diferencia de cuadrados: (x+3)(x-3). Al dividir entre (x-3), se cancelan los términos, quedando x + 3.'
        },
        {
            id: '5',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Un artículo cuesta $500 más IVA (16%). Si se aplica un descuento del 10% sobre el precio total (con IVA), ¿cuánto paga el cliente?',
            text: 'Un artículo cuesta $500 más IVA (16%). Si se aplica un descuento del 10% sobre el precio total (con IVA), ¿cuánto paga el cliente?',
            options: ['$522', '$500', '$580', '$450'],
            correctAnswer: 0,
            explanation: 'Precio con IVA: 500 * 1.16 = 580. Descuento del 10% de 580 es 58. Precio final: 580 - 58 = 522.'
        },
        {
            id: '6',
            category: 'Lógica',
            subject: 'logic',
            question: 'Completa la serie: 2, 6, 12, 20, 30, ...',
            text: 'Completa la serie: 2, 6, 12, 20, 30, ...',
            options: ['42', '40', '36', '38'],
            correctAnswer: 0,
            explanation: 'La diferencia entre términos aumenta en 2 cada vez: +4, +6, +8, +10. La siguiente diferencia debe ser +12. 30 + 12 = 42.'
        },
        {
            id: '7',
            category: 'Lógica',
            subject: 'logic',
            question: 'Todos los conejos son rápidos. Algunos animales rápidos son marrones. Por lo tanto:',
            text: 'Todos los conejos son rápidos. Algunos animales rápidos son marrones. Por lo tanto:',
            options: ['Algunos conejos son marrones', 'Todos los animales marrones son rápidos', 'No se puede concluir con certeza', 'Todos los conejos son marrones'],
            correctAnswer: 2,
            explanation: 'Que algunos animales rápidos sean marrones no garantiza que los conejos (que son rápidos) estén dentro de ese grupo marrón.'
        },
        {
            id: '8',
            category: 'Lógica',
            subject: 'logic',
            question: 'Si AYER fue el día posterior al LUNES y MAÑANA es el día anterior al VIERNES, ¿qué día es HOY?',
            text: 'Si AYER fue el día posterior al LUNES y MAÑANA es el día anterior al VIERNES, ¿qué día es HOY?',
            options: ['Miércoles', 'Martes', 'Jueves', 'Viernes'],
            correctAnswer: 0,
            explanation: 'Si ayer fue martes (posterior al lunes), hoy es miércoles. Si mañana es jueves (anterior al viernes), hoy es miércoles. Coincide.'
        },
        {
            id: '9',
            category: 'Lógica',
            subject: 'logic',
            question: '¿Qué palabra no pertenece al grupo?',
            text: '¿Qué palabra no pertenece al grupo?',
            options: ['Guitarra', 'Violín', 'Violonchelo', 'Flauta'],
            correctAnswer: 3,
            explanation: 'La guitarra, el violín y el violonchelo son instrumentos de cuerda. La flauta es un instrumento de viento.'
        },
        {
            id: '10',
            category: 'Lógica',
            subject: 'logic',
            question: 'Si A es más alto que B, y C es más bajo que A pero más alto que B, ¿quién es el más bajo?',
            text: 'Si A es más alto que B, y C es más bajo que A pero más alto que B, ¿quién es el más bajo?',
            options: ['B', 'C', 'A', 'No se puede determinar'],
            correctAnswer: 0,
            explanation: 'Ordenando de mayor a menor: A > C > B. Por lo tanto, B es el más bajo.'
        },
        {
            id: '11',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Lectura: "La entropía se puede entender como la medida del desorden en un sistema. En termodinámica, indica la irreversibilidad de los procesos." ¿Cuál es la idea principal?',
            text: 'Lectura: "La entropía se puede entender como la medida del desorden en un sistema. En termodinámica, indica la irreversibilidad de los procesos." ¿Cuál es la idea principal?',
            options: ['La entropía mide el desorden y se relaciona con la irreversibilidad', 'La termodinámica estudia el calor', 'Los procesos reversibles no tienen entropía', 'El desorden siempre es malo'],
            correctAnswer: 0,
            explanation: 'El texto define explícitamente la entropía como medida del desorden y menciona su función de indicar irreversibilidad.'
        },
        {
            id: '12',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Sinónimo contextual: "El orador fue ELOCUENTE durante su discurso, logrando conmover a todos."',
            text: 'Sinónimo contextual: "El orador fue ELOCUENTE durante su discurso, logrando conmover a todos."',
            options: ['Persuasivo y expresivo', 'Ruidoso', 'Aburrido y lento', 'Breve'],
            correctAnswer: 0,
            explanation: 'Elocuente se refiere a la capacidad de hablar o escribir de manera eficaz y persuasiva para deleitar o conmover.'
        },
        {
            id: '13',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Lectura: "A pesar de sus esfuerzos, el equipo no logró la victoria, pero ganó una experiencia invaluable." ¿Qué se infiere del texto?',
            text: 'Lectura: "A pesar de sus esfuerzos, el equipo no logró la victoria, pero ganó una experiencia invaluable." ¿Qué se infiere del texto?',
            options: ['El equipo perdió el partido', 'El equipo no se esforzó lo suficiente', 'La experiencia no sirve de nada', 'Ganaron el campeonato'],
            correctAnswer: 0,
            explanation: 'La frase "no logró la victoria" implica directamente que perdieron, aunque obtuvieron algo positivo (experiencia).'
        },
        {
            id: '14',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Identifica la oración que tiene un error de concordancia:',
            text: 'Identifica la oración que tiene un error de concordancia:',
            options: ['La gente caminaban por la calle', 'El grupo de estudiantes llegó tarde', 'Las sillas y las mesas son nuevas', 'Ella y yo fuimos al cine'],
            correctAnswer: 0,
            explanation: '"Gente" es un sustantivo colectivo singular, por lo que el verbo debe estar en singular: "La gente caminaba".'
        },
        {
            id: '15',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '¿Cuál es el antónimo de la palabra "EFÍMERO"?',
            text: '¿Cuál es el antónimo de la palabra "EFÍMERO"?',
            options: ['Duradero', 'Fugaz', 'Breve', 'Pasajero'],
            correctAnswer: 0,
            explanation: 'Efímero significa que dura muy poco tiempo. Su opuesto es algo que perdura o es duradero.'
        },
        {
            id: '16',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuál es la distancia entre los puntos A(1, 2) y B(4, 6) en el plano cartesiano?',
            text: '¿Cuál es la distancia entre los puntos A(1, 2) y B(4, 6) en el plano cartesiano?',
            options: ['5', '7', '25', '3'],
            correctAnswer: 0,
            explanation: 'Usamos la fórmula de distancia: d = √[(x2-x1)² + (y2-y1)²]. d = √[(4-1)² + (6-2)²] = √[3² + 4²] = √[9+16] = √25 = 5.'
        },
        {
            id: '17',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Resuelve el sistema de ecuaciones:\n2x + y = 10\nx - y = 2',
            text: 'Resuelve el sistema de ecuaciones:\n2x + y = 10\nx - y = 2',
            options: ['x=4, y=2', 'x=6, y=-2', 'x=3, y=4', 'x=4, y=-2'],
            correctAnswer: 0,
            explanation: 'Sumando ambas ecuaciones: (2x + x) + (y - y) = 10 + 2 => 3x = 12 => x = 4. Sustituyendo x en la segunda: 4 - y = 2 => y = 2.'
        },
        {
            id: '18',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Si el perímetro de un cuadrado es 20 cm, ¿cuál es su área?',
            text: 'Si el perímetro de un cuadrado es 20 cm, ¿cuál es su área?',
            options: ['25 cm²', '20 cm²', '16 cm²', '100 cm²'],
            correctAnswer: 0,
            explanation: 'El perímetro es 4 veces el lado (4L = 20), por lo tanto L = 5. El área es L² = 5² = 25 cm².'
        },
        {
            id: '19',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuál es el resultado de (3x²y)(2xy³)?',
            text: '¿Cuál es el resultado de (3x²y)(2xy³)?',
            options: ['6x³y⁴', '5x³y⁴', '6x²y³', '5x²y³'],
            correctAnswer: 0,
            explanation: 'Se multiplican los coeficientes (3*2=6) y se suman los exponentes de las bases iguales: x^(2+1) y y^(1+3) => 6x³y⁴.'
        },
        {
            id: '20',
            category: 'Matemáticas',
            subject: 'math',
            question: 'En una caja hay 3 bolas rojas y 2 bolas azules. Si sacas una sin mirar, ¿cuál es la probabilidad de que sea roja?',
            text: 'En una caja hay 3 bolas rojas y 2 bolas azules. Si sacas una sin mirar, ¿cuál es la probabilidad de que sea roja?',
            options: ['60%', '40%', '30%', '50%'],
            correctAnswer: 0,
            explanation: 'Total de bolas = 5. Bolas rojas = 3. Probabilidad = 3/5 = 0.60, que equivale al 60%.'
        },
        {
            id: '21',
            category: 'Lógica',
            subject: 'logic',
            question: 'Elige la figura que continúa la serie: ▲, ■, ▲, ■, ...',
            text: 'Elige la figura que continúa la serie: ▲, ■, ▲, ■, ...',
            options: ['▲', '■', '●', '▼'],
            correctAnswer: 0,
            explanation: 'Es una secuencia simple alterna de dos elementos. Después del cuadrado sigue el triángulo.'
        },
        {
            id: '22',
            category: 'Lógica',
            subject: 'logic',
            question: 'Ningún pez respira aire. Todas las ballenas respiran aire. Por lo tanto:',
            text: 'Ningún pez respira aire. Todas las ballenas respiran aire. Por lo tanto:',
            options: ['Ninguna ballena es un pez', 'Algunas ballenas son peces', 'Todos los peces son ballenas', 'No se puede concluir nada'],
            correctAnswer: 0,
            explanation: 'Si A (peces) y B (respirar aire) son disjuntos, y C (ballenas) está contenido en B, entonces A y C no pueden tocarse.'
        },
        {
            id: '23',
            category: 'Lógica',
            subject: 'logic',
            question: 'Analoga verbal: MÉDICO es a HOSPITAL como PROFESOR es a...',
            text: 'Analoga verbal: MÉDICO es a HOSPITAL como PROFESOR es a...',
            options: ['ESCUELA', 'LIBRO', 'ALUMNO', 'APRENDER'],
            correctAnswer: 0,
            explanation: 'La relación es de "sujeto - lugar de trabajo". El médico trabaja en un hospital; el profesor trabaja en una escuela.'
        },
        {
            id: '24',
            category: 'Lógica',
            subject: 'logic',
            question: '¿Cuál de las siguientes opciones representa una rotación de 90 grados a la derecha de la letra "L"?',
            text: '¿Cuál de las siguientes opciones representa una rotación de 90 grados a la derecha de la letra "L"?',
            options: ['Una "L" acostada con el pie hacia abajo', 'Una "L" invertida', 'Una "J"', 'Una "V"'],
            correctAnswer: 0,
            explanation: 'Al girar la L (eje vertical y pie a la derecha) 90 grados horario, el eje queda horizontal y el pie apunta hacia abajo.'
        },
        {
            id: '25',
            category: 'Lógica',
            subject: 'logic',
            question: 'Si "CASA" se codifica como "DBTB", ¿cómo se codifica "GATO"?',
            text: 'Si "CASA" se codifica como "DBTB", ¿cómo se codifica "GATO"?',
            options: ['HBUP', 'HBTP', 'FZSN', 'IBUP'],
            correctAnswer: 0,
            explanation: 'El código consiste en reemplazar cada letra por la siguiente en el alfabeto (+1). G->H, A->B, T->U, O->P.'
        },
        {
            id: '26',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Ortografía: Selecciona la palabra escrita correctamente.',
            text: 'Ortografía: Selecciona la palabra escrita correctamente.',
            options: ['Decisión', 'Desición', 'Decición', 'Desisión'],
            correctAnswer: 0,
            explanation: 'La palabra correcta se escribe con "c" primero y "s" después. Viene del latín "decisio".'
        },
        {
            id: '27',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Lectura: "Pedro no tenía dinero, así que decidió caminar los 10 km hasta su casa bajo la lluvia". ¿Qué se puede inferir sobre Pedro?',
            text: 'Lectura: "Pedro no tenía dinero, así que decidió caminar los 10 km hasta su casa bajo la lluvia". ¿Qué se puede inferir sobre Pedro?',
            options: ['Está determinado y no le importa mojarse con tal de llegar', 'Le gusta mucho la lluvia', 'Odia el transporte público', 'Es un atleta profesional'],
            correctAnswer: 0,
            explanation: 'La inferencia más lógica y directa es que su necesidad de llegar supera la incomodidad de la lluvia y la distancia, mostrando determinación ante la falta de dinero.'
        },
        {
            id: '28',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Antónimo contextual: "Su argumento fue tan ENDEBLE que nadie le creyó".',
            text: 'Antónimo contextual: "Su argumento fue tan ENDEBLE que nadie le creyó".',
            options: ['Sólido', 'Débil', 'Largo', 'Mentiroso'],
            correctAnswer: 0,
            explanation: 'Endeble significa débil o sin fuerza. En el contexto de un argumento, su opuesto sería algo fuerte, convincente o "sólido".'
        },
        {
            id: '29',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Identifica el sujeto en la oración: "Ayer por la tarde, corrieron por el parque los perros de mi vecina".',
            text: 'Identifica el sujeto en la oración: "Ayer por la tarde, corrieron por el parque los perros de mi vecina".',
            options: ['Los perros de mi vecina', 'Ayer por la tarde', 'El parque', 'Corrieron'],
            correctAnswer: 0,
            explanation: 'El sujeto es quien realiza la acción. ¿Quiénes corrieron? Los perros de mi vecina.'
        },
        {
            id: '30',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Lectura: "El agua es un recurso finito. Si no cambiamos nuestros hábitos de consumo, las próximas guerras no serán por petróleo, sino por el líquido vital". ¿Cuál es el tono del autor?',
            text: 'Lectura: "El agua es un recurso finito. Si no cambiamos nuestros hábitos de consumo, las próximas guerras no serán por petróleo, sino por el líquido vital". ¿Cuál es el tono del autor?',
            options: ['De advertencia y preocupación', 'Alegre y optimista', 'Indiferente', 'Científico y técnico'],
            correctAnswer: 0,
            explanation: 'El autor usa frases como "si no cambiamos" y menciona "guerras", lo que denota una clara advertencia sobre un futuro negativo.'
        },
        // Exercises 31-45
        {
            id: '31',
            category: 'Matemáticas',
            subject: 'math',
            question: 'En un triángulo rectángulo, si los catetos miden 3 cm y 4 cm, ¿cuánto mide la hipotenusa?',
            text: 'En un triángulo rectángulo, si los catetos miden 3 cm y 4 cm, ¿cuánto mide la hipotenusa?',
            options: ['5 cm', '7 cm', '6 cm', '12 cm'],
            correctAnswer: 0,
            explanation: 'Usando el Teorema de Pitágoras (a² + b² = c²): 3² + 4² = 9 + 16 = 25. La raíz cuadrada de 25 es 5.'
        },
        {
            id: '32',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuál es la factorización correcta de la expresión: x² - 5x + 6?',
            text: '¿Cuál es la factorización correcta de la expresión: x² - 5x + 6?',
            options: ['(x - 3)(x - 2)', '(x + 3)(x + 2)', '(x - 6)(x + 1)', '(x - 1)(x - 5)'],
            correctAnswer: 0,
            explanation: 'Buscamos dos números que multiplicados den +6 y sumados den -5. Esos números son -3 y -2.'
        },
        {
            id: '33',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Si sen(x) = 1/2 y x es un ángulo agudo, ¿cuál es el valor de x?',
            text: 'Si sen(x) = 1/2 y x es un ángulo agudo, ¿cuál es el valor de x?',
            options: ['30°', '45°', '60°', '90°'],
            correctAnswer: 0,
            explanation: 'En trigonometría básica, el seno de 30 grados es 0.5 o 1/2.'
        },
        {
            id: '34',
            category: 'Matemáticas',
            subject: 'math',
            question: "¿Cuál es el valor de 'x' en la ecuación: 3(x - 2) = 2x + 5?",
            text: "¿Cuál es el valor de 'x' en la ecuación: 3(x - 2) = 2x + 5?",
            options: ['11', '7', '9', '1'],
            correctAnswer: 0,
            explanation: '3x - 6 = 2x + 5. Pasamos las x a un lado: 3x - 2x = 5 + 6. Entonces x = 11.'
        },
        {
            id: '35',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Calcula el promedio (media aritmética) de los siguientes datos: 12, 15, 18, 12, 13.',
            text: 'Calcula el promedio (media aritmética) de los siguientes datos: 12, 15, 18, 12, 13.',
            options: ['14', '13', '12', '15'],
            correctAnswer: 0,
            explanation: 'Suma de los datos: 12+15+18+12+13 = 70. Dividido entre el número de datos (5): 70 / 5 = 14.'
        },
        {
            id: '36',
            category: 'Lógica',
            subject: 'logic',
            question: 'Selecciona el número que rompe el patrón: 4, 8, 12, 16, 19, 24.',
            text: 'Selecciona el número que rompe el patrón: 4, 8, 12, 16, 19, 24.',
            options: ['19', '16', '24', '4'],
            correctAnswer: 0,
            explanation: 'La serie va sumando 4 en cada paso (múltiplos de 4). El 19 rompe la serie, debería ser 20.'
        },
        {
            id: '37',
            category: 'Lógica',
            subject: 'logic',
            question: 'Si todos los BLOOP son ZORG, y algunos ZORG son FLIP. ¿Podemos afirmar que algunos BLOOP son FLIP?',
            text: 'Si todos los BLOOP son ZORG, y algunos ZORG son FLIP. ¿Podemos afirmar que algunos BLOOP son FLIP?',
            options: ['No necesariamente', 'Sí, definitivamente', 'Solo si son verdes', 'Nunca'],
            correctAnswer: 0,
            explanation: 'Es un silogismo clásico. Que los grupos se intersecten en un nivel superior no garantiza que se intersecten en el nivel inferior.'
        },
        {
            id: '38',
            category: 'Lógica',
            subject: 'logic',
            question: '¿Cuántas caras tiene un cubo?',
            text: '¿Cuántas caras tiene un cubo?',
            options: ['6', '8', '12', '4'],
            correctAnswer: 0,
            explanation: 'Un cubo es un hexaedro regular, tiene 6 caras cuadradas iguales.'
        },
        {
            id: '39',
            category: 'Lógica',
            subject: 'logic',
            question: 'Analogía: PÁGINA es a LIBRO como TECLA es a...',
            text: 'Analogía: PÁGINA es a LIBRO como TECLA es a...',
            options: ['PIANO', 'CANTAR', 'MÚSICA', 'SONIDO'],
            correctAnswer: 0,
            explanation: 'Relación parte-todo. Una página es una parte física de un libro; una tecla es una parte física de un piano.'
        },
        {
            id: '40',
            category: 'Lógica',
            subject: 'logic',
            question: 'Juan es más alto que Pedro. Luis es más bajo que Juan pero más alto que Pedro. ¿Quién es el más bajo?',
            text: 'Juan es más alto que Pedro. Luis es más bajo que Juan pero más alto que Pedro. ¿Quién es el más bajo?',
            options: ['Pedro', 'Luis', 'Juan', 'Son iguales'],
            correctAnswer: 0,
            explanation: 'Orden: Juan > Luis > Pedro. El más bajo es Pedro.'
        },
        {
            id: '41',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Ortografía: ¿Cuál palabra lleva acento diacrítico correctamente?',
            text: 'Ortografía: ¿Cuál palabra lleva acento diacrítico correctamente?',
            options: ['Tú eres mi amigo', 'Tu eres mi amigo', 'El libro es de él', 'A y C son correctas'],
            correctAnswer: 3,
            explanation: "'Tú' (pronombre) lleva tilde para diferenciarse de 'tu' (posesivo). 'Él' (pronombre) lleva tilde para diferenciarse de 'el' (artículo)."
        },
        {
            id: '42',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: "Sinónimo de la palabra: 'EFICAZ'",
            text: "Sinónimo de la palabra: 'EFICAZ'",
            options: ['Competente', 'Inútil', 'Lento', 'Costoso'],
            correctAnswer: 0,
            explanation: 'Eficaz significa que logra el efecto deseado. Competente es el sinónimo más cercano en este contexto.'
        },
        {
            id: '43',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: "Identifica el tipo de texto: 'Mezclar la harina con los huevos y batir durante 5 minutos...'",
            text: "Identifica el tipo de texto: 'Mezclar la harina con los huevos y batir durante 5 minutos...'",
            options: ['Instructivo', 'Narrativo', 'Argumentativo', 'Periodístico'],
            correctAnswer: 0,
            explanation: 'El texto da órdenes o pasos a seguir para realizar una tarea, característica de los textos instructivos.'
        },
        {
            id: '44',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: "Lectura: 'El cielo estaba plomizo y el aire olía a tierra mojada'. ¿Qué situación describe?",
            text: "Lectura: 'El cielo estaba plomizo y el aire olía a tierra mojada'. ¿Qué situación describe?",
            options: ['Va a llover pronto', 'Es de noche', 'Hay un incendio', 'Es un día soleado'],
            correctAnswer: 0,
            explanation: "'Cielo plomizo' (gris oscuro) y 'olor a tierra mojada' (petricor) son indicios clásicos de lluvia inminente."
        },
        {
            id: '45',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: "Completa la oración: 'No ______ venir ayer porque estaba enfermo'.",
            text: "Completa la oración: 'No ______ venir ayer porque estaba enfermo'.",
            options: ['pude', 'pube', 'pudé', 'podía'],
            correctAnswer: 0,
            explanation: 'Es la conjugación correcta del verbo poder en pretérito perfecto simple, primera persona.'
        },
        // Exercises 46-60
        {
            id: '46',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Resuelve la siguiente desigualdad: 2x - 5 > 3',
            text: 'Resuelve la siguiente desigualdad: 2x - 5 > 3',
            options: ['x > 4', 'x < 4', 'x > -1', 'x < -1'],
            correctAnswer: 0,
            explanation: 'Sumamos 5 a ambos lados: 2x > 8. Luego dividimos entre 2: x > 4.'
        },
        {
            id: '47',
            category: 'Matemáticas',
            subject: 'math',
            question: 'En un salón hay 15 mujeres y 10 hombres. Si se elige un estudiante al azar, ¿cuál es la probabilidad de que sea hombre?',
            text: 'En un salón hay 15 mujeres y 10 hombres. Si se elige un estudiante al azar, ¿cuál es la probabilidad de que sea hombre?',
            options: ['2/5', '3/5', '1/10', '10/15'],
            correctAnswer: 0,
            explanation: 'El total de estudiantes es 25. La probabilidad de elegir a un hombre es 10/25. Simplificando la fracción (dividiendo entre 5) obtenemos 2/5.'
        },
        {
            id: '48',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuál es el volumen aproximado de un cilindro con radio de 3 cm y altura de 10 cm? (Considera π ≈ 3.14)',
            text: '¿Cuál es el volumen aproximado de un cilindro con radio de 3 cm y altura de 10 cm? (Considera π ≈ 3.14)',
            options: ['282.6 cm³', '94.2 cm³', '188.4 cm³', '31.4 cm³'],
            correctAnswer: 0,
            explanation: 'La fórmula del volumen de un cilindro es V = πr²h. Sustituyendo: V = 3.14 * (3)² * 10 = 3.14 * 9 * 10 = 28.26 * 10 = 282.6 cm³.'
        },
        {
            id: '49',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuáles son las raíces de la ecuación cuadrática x² - 16 = 0?',
            text: '¿Cuáles son las raíces de la ecuación cuadrática x² - 16 = 0?',
            options: ['x=4 y x=-4', 'x=16 y x=-16', 'x=4 y x=0', 'x=-4 y x=0'],
            correctAnswer: 0,
            explanation: 'Despejando x² = 16. Al sacar raíz cuadrada en ambos lados, obtenemos dos posibles soluciones: x = 4 y x = -4, ya que ambos al cuadrado dan 16.'
        },
        {
            id: '50',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Si el 20% de un número misterioso es 40, ¿cuál es ese número?',
            text: 'Si el 20% de un número misterioso es 40, ¿cuál es ese número?',
            options: ['200', '80', '100', '400'],
            correctAnswer: 0,
            explanation: 'Podemos plantear una regla de tres o una ecuación: 0.20 * x = 40. Despejando: x = 40 / 0.20 = 200.'
        },
        {
            id: '51',
            category: 'Lógica',
            subject: 'logic',
            question: 'Analogía verbal: PINTOR es a PINCEL como ESCRITOR es a...',
            text: 'Analogía verbal: PINTOR es a PINCEL como ESCRITOR es a...',
            options: ['PLUMA', 'LIBRO', 'PAPEL', 'PALABRA'],
            correctAnswer: 0,
            explanation: "La relación es de 'profesión - herramienta principal'. El pintor usa el pincel para crear; el escritor usa la pluma (o teclado, pero pluma es la opción clásica)."
        },
        {
            id: '52',
            category: 'Lógica',
            subject: 'logic',
            question: '¿Qué término sigue en la sucesión alfanumérica? A1, C4, E9, G16, ...',
            text: '¿Qué término sigue en la sucesión alfanumérica? A1, C4, E9, G16, ...',
            options: ['I25', 'H25', 'J25', 'I20'],
            correctAnswer: 0,
            explanation: 'Las letras saltan de una en una (A, C, E, G... sigue la I). Los números son cuadrados perfectos (1², 2², 3², 4²... sigue 5² que es 25).'
        },
        {
            id: '53',
            category: 'Lógica',
            subject: 'logic',
            question: 'Un coche viaja 5 km al norte, luego 3 km al este, y finalmente 5 km al sur. ¿A qué distancia y en qué dirección se encuentra de su punto de partida?',
            text: 'Un coche viaja 5 km al norte, luego 3 km al este, y finalmente 5 km al sur. ¿A qué distancia y en qué dirección se encuentra de su punto de partida?',
            options: ['3 km al este', '3 km al oeste', '5 km al norte', '0 km'],
            correctAnswer: 0,
            explanation: 'Al viajar 5 km al norte y luego 5 km al sur, la posición en el eje Y se anula (regresa a la misma latitud). Solo queda el desplazamiento de 3 km al este en el eje X.'
        },
        {
            id: '54',
            category: 'Lógica',
            subject: 'logic',
            question: 'Si llueve, entonces el patio se moja. El patio NO está mojado. Por lo tanto, lógicamente:',
            text: 'Si llueve, entonces el patio se moja. El patio NO está mojado. Por lo tanto, lógicamente:',
            options: ['No llovió', 'Llovió poco', 'El patio está techado', 'No se puede saber'],
            correctAnswer: 0,
            explanation: "Este es un razonamiento deductivo válido llamado 'Modus tollens'. Si A implica B, y B es falso, entonces A debe ser falso."
        },
        {
            id: '55',
            category: 'Lógica',
            subject: 'logic',
            question: '¿Qué parentesco tiene conmigo el hijo de la hermana de mi madre?',
            text: '¿Qué parentesco tiene conmigo el hijo de la hermana de mi madre?',
            options: ['Mi primo', 'Mi tío', 'Mi sobrino', 'Mi hermano'],
            correctAnswer: 0,
            explanation: 'La hermana de mi madre es mi tía. El hijo de mi tía es mi primo.'
        },
        {
            id: '56',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Elige la oración escrita con ortografía correcta:',
            text: 'Elige la oración escrita con ortografía correcta:',
            options: ['El ciervo corría por el bosque.', 'El siervo corría por el bosque.', 'El ciervo corría por el vosque.', 'El siervo corría por el vosque.'],
            correctAnswer: 0,
            explanation: "'Ciervo' con 'c' se refiere al animal; 'siervo' con 's' es un esclavo o sirviente. 'Bosque' siempre se escribe con 'b'."
        },
        {
            id: '57',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: "Lectura inferencial: 'El ocaso tiñó de naranja las nubes, avisando a los pescadores que la jornada había terminado.' ¿Qué momento del día es?",
            text: "Lectura inferencial: 'El ocaso tiñó de naranja las nubes, avisando a los pescadores que la jornada había terminado.' ¿Qué momento del día es?",
            options: ['Atardecer', 'Amanecer', 'Mediodía', 'Medianoche'],
            correctAnswer: 0,
            explanation: "La palabra 'ocaso' significa la puesta del sol, que marca el final del día o atardecer."
        },
        {
            id: '58',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: "Completa la oración con el conector lógico adecuado: 'Quería ir al cine, _________ no tenía dinero.'",
            text: "Completa la oración con el conector lógico adecuado: 'Quería ir al cine, _________ no tenía dinero.'",
            options: ['sin embargo', 'por lo tanto', 'es decir', 'además'],
            correctAnswer: 0,
            explanation: 'Se necesita un conector de adversidad u oposición, ya que el deseo de ir al cine choca con la realidad de no tener dinero.'
        },
        {
            id: '59',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: "¿Cuál es el sinónimo más cercano de la palabra 'PRAGMÁTICO'?",
            text: "¿Cuál es el sinónimo más cercano de la palabra 'PRAGMÁTICO'?",
            options: ['Práctico', 'Teórico', 'Soñador', 'Confuso'],
            correctAnswer: 0,
            explanation: 'Una persona pragmática es aquella que se enfoca en la utilidad práctica de las cosas y las acciones, más que en la teoría.'
        },
        {
            id: '60',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Un artículo de opinión en un periódico tiene como función principal:',
            text: 'Un artículo de opinión en un periódico tiene como función principal:',
            options: ['Persuadir al lector sobre un punto de vista.', 'Informar objetivamente un hecho.', 'Entretener con una historia ficticia.', 'Enseñar los pasos para hacer algo.'],
            correctAnswer: 0,
            explanation: 'A diferencia de la nota informativa (que es objetiva), el artículo de opinión busca argumentar y convencer al lector sobre la postura del autor respecto a un tema.'
        },
        // ===== PREGUNTAS 61-120 =====
        // --- MATEMÁTICAS (61-80) ---
        {
            id: '61',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuál es el resultado de log₁₀(1000)?',
            text: '¿Cuál es el resultado de log₁₀(1000)?',
            options: ['3', '10', '100', '30'],
            correctAnswer: 0,
            explanation: 'log₁₀(1000) pregunta: ¿a qué potencia hay que elevar 10 para obtener 1000? 10³ = 1000, por lo tanto la respuesta es 3.'
        },
        {
            id: '62',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Si un triángulo tiene ángulos de 45° y 90°, ¿cuánto mide el tercer ángulo?',
            text: 'Si un triángulo tiene ángulos de 45° y 90°, ¿cuánto mide el tercer ángulo?',
            options: ['45°', '90°', '60°', '30°'],
            correctAnswer: 0,
            explanation: 'La suma de los ángulos internos de un triángulo siempre es 180°. Entonces: 180° - 45° - 90° = 45°.'
        },
        {
            id: '63',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuál es la derivada de f(x) = 3x² + 2x - 5?',
            text: '¿Cuál es la derivada de f(x) = 3x² + 2x - 5?',
            options: ['6x + 2', '3x + 2', '6x² + 2', '6x - 5'],
            correctAnswer: 0,
            explanation: 'Aplicando la regla de la potencia: la derivada de 3x² es 6x, la de 2x es 2, y la de -5 (constante) es 0. Entonces f\'(x) = 6x + 2.'
        },
        {
            id: '64',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Un capital de $10,000 se invierte al 5% de interés simple anual durante 3 años. ¿Cuánto interés se genera?',
            text: 'Un capital de $10,000 se invierte al 5% de interés simple anual durante 3 años. ¿Cuánto interés se genera?',
            options: ['$1,500', '$1,000', '$500', '$15,000'],
            correctAnswer: 0,
            explanation: 'La fórmula de interés simple es I = C × r × t. I = 10,000 × 0.05 × 3 = $1,500.'
        },
        {
            id: '65',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuál es el Máximo Común Divisor (MCD) de 36 y 48?',
            text: '¿Cuál es el Máximo Común Divisor (MCD) de 36 y 48?',
            options: ['12', '6', '24', '8'],
            correctAnswer: 0,
            explanation: 'Factorizando: 36 = 2² × 3² y 48 = 2⁴ × 3. El MCD toma los factores comunes con menor exponente: 2² × 3 = 4 × 3 = 12.'
        },
        {
            id: '66',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Si cos(60°) = 1/2, ¿cuál es el valor de cos(120°)?',
            text: 'Si cos(60°) = 1/2, ¿cuál es el valor de cos(120°)?',
            options: ['-1/2', '1/2', '0', '-1'],
            correctAnswer: 0,
            explanation: '120° está en el segundo cuadrante donde el coseno es negativo. cos(120°) = cos(180° - 60°) = -cos(60°) = -1/2.'
        },
        {
            id: '67',
            category: 'Matemáticas',
            subject: 'math',
            question: 'En una progresión aritmética, si el primer término es 3 y la diferencia común es 5, ¿cuál es el sexto término?',
            text: 'En una progresión aritmética, si el primer término es 3 y la diferencia común es 5, ¿cuál es el sexto término?',
            options: ['28', '30', '25', '33'],
            correctAnswer: 0,
            explanation: 'La fórmula del término n-ésimo es aₙ = a₁ + (n-1)d. a₆ = 3 + (6-1)(5) = 3 + 25 = 28.'
        },
        {
            id: '68',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuál es el área de un círculo con diámetro de 10 cm? (Usa π ≈ 3.14)',
            text: '¿Cuál es el área de un círculo con diámetro de 10 cm? (Usa π ≈ 3.14)',
            options: ['78.5 cm²', '31.4 cm²', '314 cm²', '157 cm²'],
            correctAnswer: 0,
            explanation: 'El radio es la mitad del diámetro: r = 5 cm. Área = πr² = 3.14 × 25 = 78.5 cm².'
        },
        {
            id: '69',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Simplifica: √(50)',
            text: 'Simplifica: √(50)',
            options: ['5√2', '2√5', '10√5', '25√2'],
            correctAnswer: 0,
            explanation: '√50 = √(25 × 2) = √25 × √2 = 5√2.'
        },
        {
            id: '70',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Si f(x) = x³ - 2x, ¿cuál es el valor de f(3) - f(1)?',
            text: 'Si f(x) = x³ - 2x, ¿cuál es el valor de f(3) - f(1)?',
            options: ['22', '20', '18', '24'],
            correctAnswer: 0,
            explanation: 'f(3) = 27 - 6 = 21. f(1) = 1 - 2 = -1. f(3) - f(1) = 21 - (-1) = 22.'
        },
        {
            id: '71',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuántas formas diferentes hay de acomodar 3 libros distintos en una repisa?',
            text: '¿Cuántas formas diferentes hay de acomodar 3 libros distintos en una repisa?',
            options: ['6', '3', '9', '12'],
            correctAnswer: 0,
            explanation: 'Se trata de permutaciones. 3! = 3 × 2 × 1 = 6 formas diferentes.'
        },
        {
            id: '72',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Convierte 3/4 a porcentaje.',
            text: 'Convierte 3/4 a porcentaje.',
            options: ['75%', '34%', '43%', '60%'],
            correctAnswer: 0,
            explanation: 'Para convertir una fracción a porcentaje se multiplica por 100: (3/4) × 100 = 75%.'
        },
        {
            id: '73',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Si la mediana de los datos {2, 5, 8, 11, 14} es 8, ¿cuál es la mediana de {2, 5, 8, 11, 14, 17}?',
            text: 'Si la mediana de los datos {2, 5, 8, 11, 14} es 8, ¿cuál es la mediana de {2, 5, 8, 11, 14, 17}?',
            options: ['9.5', '8', '11', '10'],
            correctAnswer: 0,
            explanation: 'Con un número par de datos, la mediana es el promedio de los dos valores centrales: (8 + 11) / 2 = 9.5.'
        },
        {
            id: '74',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuál es el valor de la expresión: (-2)³ + (-3)²?',
            text: '¿Cuál es el valor de la expresión: (-2)³ + (-3)²?',
            options: ['1', '-17', '17', '-1'],
            correctAnswer: 0,
            explanation: '(-2)³ = -8 (negativo porque el exponente es impar). (-3)² = 9 (positivo porque el exponente es par). -8 + 9 = 1.'
        },
        {
            id: '75',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Un rectángulo tiene un perímetro de 30 cm y uno de sus lados mide 8 cm. ¿Cuál es su área?',
            text: 'Un rectángulo tiene un perímetro de 30 cm y uno de sus lados mide 8 cm. ¿Cuál es su área?',
            options: ['56 cm²', '64 cm²', '48 cm²', '120 cm²'],
            correctAnswer: 0,
            explanation: 'Perímetro = 2(largo + ancho). 30 = 2(8 + ancho). 15 = 8 + ancho. Ancho = 7 cm. Área = 8 × 7 = 56 cm².'
        },
        {
            id: '76',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuál es el resultado de (2/3) ÷ (4/5)?',
            text: '¿Cuál es el resultado de (2/3) ÷ (4/5)?',
            options: ['5/6', '8/15', '10/12', '3/4'],
            correctAnswer: 0,
            explanation: 'Dividir entre una fracción es multiplicar por su recíproco: (2/3) × (5/4) = 10/12 = 5/6.'
        },
        {
            id: '77',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Si tan(θ) = 1 y θ es un ángulo agudo, ¿cuánto vale θ?',
            text: 'Si tan(θ) = 1 y θ es un ángulo agudo, ¿cuánto vale θ?',
            options: ['45°', '30°', '60°', '90°'],
            correctAnswer: 0,
            explanation: 'tan(θ) = sen(θ)/cos(θ). Para que tan(θ) = 1, seno y coseno deben ser iguales, lo cual ocurre en θ = 45°.'
        },
        {
            id: '78',
            category: 'Matemáticas',
            subject: 'math',
            question: 'En una bolsa hay 4 canicas rojas, 3 azules y 5 verdes. ¿Cuál es la probabilidad de NO sacar una canica verde?',
            text: 'En una bolsa hay 4 canicas rojas, 3 azules y 5 verdes. ¿Cuál es la probabilidad de NO sacar una canica verde?',
            options: ['7/12', '5/12', '1/3', '2/3'],
            correctAnswer: 0,
            explanation: 'Total = 12. Canicas no verdes = 4 + 3 = 7. Probabilidad = 7/12.'
        },
        {
            id: '79',
            category: 'Matemáticas',
            subject: 'math',
            question: '¿Cuál es la ecuación de la recta que pasa por el punto (0, 3) con pendiente m = -2?',
            text: '¿Cuál es la ecuación de la recta que pasa por el punto (0, 3) con pendiente m = -2?',
            options: ['y = -2x + 3', 'y = 2x + 3', 'y = -2x - 3', 'y = 3x - 2'],
            correctAnswer: 0,
            explanation: 'Usando la forma pendiente-intercepto: y = mx + b. El punto (0,3) indica que b = 3. Entonces y = -2x + 3.'
        },
        {
            id: '80',
            category: 'Matemáticas',
            subject: 'math',
            question: 'Si un auto viaja a 80 km/h, ¿cuánto tarda en recorrer 200 km?',
            text: 'Si un auto viaja a 80 km/h, ¿cuánto tarda en recorrer 200 km?',
            options: ['2.5 horas', '2 horas', '3 horas', '1.5 horas'],
            correctAnswer: 0,
            explanation: 'Tiempo = Distancia / Velocidad = 200 / 80 = 2.5 horas.'
        },
        // --- LÓGICA (81-100) ---
        {
            id: '81',
            category: 'Lógica',
            subject: 'logic',
            question: 'Completa la serie numérica: 1, 1, 2, 3, 5, 8, ...',
            text: 'Completa la serie numérica: 1, 1, 2, 3, 5, 8, ...',
            options: ['13', '11', '10', '12'],
            correctAnswer: 0,
            explanation: 'Es la sucesión de Fibonacci. Cada número es la suma de los dos anteriores: 5 + 8 = 13.'
        },
        {
            id: '82',
            category: 'Lógica',
            subject: 'logic',
            question: 'Un reloj marca las 3:15. ¿Cuál es el ángulo que forman las manecillas?',
            text: 'Un reloj marca las 3:15. ¿Cuál es el ángulo que forman las manecillas?',
            options: ['7.5°', '0°', '90°', '15°'],
            correctAnswer: 0,
            explanation: 'A las 3:15, el minutero está en el 3 (90°). La manecilla de la hora ha avanzado 1/4 del espacio entre 3 y 4 (7.5°). Ángulo = 90° - 82.5° = 7.5°.'
        },
        {
            id: '83',
            category: 'Lógica',
            subject: 'logic',
            question: 'Si María tiene el doble de edad que Pedro, y Pedro tiene 5 años más que Ana que tiene 10 años, ¿cuántos años tiene María?',
            text: 'Si María tiene el doble de edad que Pedro, y Pedro tiene 5 años más que Ana que tiene 10 años, ¿cuántos años tiene María?',
            options: ['30', '25', '20', '35'],
            correctAnswer: 0,
            explanation: 'Ana = 10. Pedro = 10 + 5 = 15. María = 15 × 2 = 30 años.'
        },
        {
            id: '84',
            category: 'Lógica',
            subject: 'logic',
            question: '¿Cuál es el número que falta? 3, 9, 27, 81, ___',
            text: '¿Cuál es el número que falta? 3, 9, 27, 81, ___',
            options: ['243', '162', '108', '324'],
            correctAnswer: 0,
            explanation: 'Es una progresión geométrica donde cada término se multiplica por 3. 81 × 3 = 243.'
        },
        {
            id: '85',
            category: 'Lógica',
            subject: 'logic',
            question: 'Si miro hacia el norte y giro 90° a la derecha, luego 180°, ¿hacia dónde miro?',
            text: 'Si miro hacia el norte y giro 90° a la derecha, luego 180°, ¿hacia dónde miro?',
            options: ['Oeste', 'Este', 'Sur', 'Norte'],
            correctAnswer: 0,
            explanation: 'Empiezo mirando al Norte. 90° a la derecha = Este. 180° más = Oeste.'
        },
        {
            id: '86',
            category: 'Lógica',
            subject: 'logic',
            question: 'En una familia, el padre tiene 4 hijos. Cada hijo tiene una hermana. ¿Cuántos hijos tiene el padre en total?',
            text: 'En una familia, el padre tiene 4 hijos. Cada hijo tiene una hermana. ¿Cuántos hijos tiene el padre en total?',
            options: ['5', '8', '4', '9'],
            correctAnswer: 0,
            explanation: 'Es un acertijo clásico. Cada hijo tiene la MISMA hermana, así que hay 4 hijos varones + 1 hermana = 5 hijos en total.'
        },
        {
            id: '87',
            category: 'Lógica',
            subject: 'logic',
            question: 'Analogía: OJO es a VER como OÍDO es a...',
            text: 'Analogía: OJO es a VER como OÍDO es a...',
            options: ['OÍR', 'HABLAR', 'SONIDO', 'OREJA'],
            correctAnswer: 0,
            explanation: 'La relación es órgano-función. El ojo cumple la función de ver; el oído cumple la función de oír.'
        },
        {
            id: '88',
            category: 'Lógica',
            subject: 'logic',
            question: 'Si en un estante hay libros de rojo, azul y verde, y el libro azul está entre el rojo y el verde, y el rojo está a la izquierda, ¿cuál está a la derecha?',
            text: 'Si en un estante hay libros de rojo, azul y verde, y el libro azul está entre el rojo y el verde, y el rojo está a la izquierda, ¿cuál está a la derecha?',
            options: ['Verde', 'Rojo', 'Azul', 'No se puede determinar'],
            correctAnswer: 0,
            explanation: 'Si el rojo está a la izquierda y el azul está en medio, entonces el verde debe estar a la derecha. Orden: Rojo - Azul - Verde.'
        },
        {
            id: '89',
            category: 'Lógica',
            subject: 'logic',
            question: 'Todos los perros ladran. Rex ladra. ¿Podemos concluir que Rex es un perro?',
            text: 'Todos los perros ladran. Rex ladra. ¿Podemos concluir que Rex es un perro?',
            options: ['No necesariamente, podría ser otro animal que ladra', 'Sí, definitivamente es un perro', 'Sí, porque todos los que ladran son perros', 'No, Rex no existe'],
            correctAnswer: 0,
            explanation: 'Esto es la falacia de afirmación del consecuente. Que todos los perros ladren no significa que solo los perros ladren. Otros animales podrían ladrar también.'
        },
        {
            id: '90',
            category: 'Lógica',
            subject: 'logic',
            question: '¿Qué letra continúa la serie? A, D, G, J, ...',
            text: '¿Qué letra continúa la serie? A, D, G, J, ...',
            options: ['M', 'K', 'L', 'N'],
            correctAnswer: 0,
            explanation: 'Las letras avanzan de 3 en 3: A(1), D(4), G(7), J(10). La siguiente es M(13).'
        },
        {
            id: '91',
            category: 'Lógica',
            subject: 'logic',
            question: 'Pedro dice: "El lunes siempre miento". Si hoy es lunes, ¿está Pedro mintiendo o diciendo la verdad?',
            text: 'Pedro dice: "El lunes siempre miento". Si hoy es lunes, ¿está Pedro mintiendo o diciendo la verdad?',
            options: ['Es una paradoja, no se puede determinar', 'Está mintiendo', 'Dice la verdad', 'Solo miente los martes'],
            correctAnswer: 0,
            explanation: 'Si dice la verdad, entonces miente los lunes (contradicción). Si miente, entonces no miente los lunes (también contradicción). Es una paradoja lógica.'
        },
        {
            id: '92',
            category: 'Lógica',
            subject: 'logic',
            question: 'Analogía: SEMILLA es a ÁRBOL como HUEVO es a...',
            text: 'Analogía: SEMILLA es a ÁRBOL como HUEVO es a...',
            options: ['AVE', 'NIDO', 'CÁSCARA', 'GALLINA'],
            correctAnswer: 0,
            explanation: 'La relación es de origen a resultado. De la semilla crece un árbol; del huevo nace un ave.'
        },
        {
            id: '93',
            category: 'Lógica',
            subject: 'logic',
            question: 'Si 5 máquinas producen 5 piezas en 5 minutos, ¿cuánto tardan 100 máquinas en producir 100 piezas?',
            text: 'Si 5 máquinas producen 5 piezas en 5 minutos, ¿cuánto tardan 100 máquinas en producir 100 piezas?',
            options: ['5 minutos', '100 minutos', '20 minutos', '1 minuto'],
            correctAnswer: 0,
            explanation: 'Cada máquina produce 1 pieza en 5 minutos. Con 100 máquinas, cada una hace 1 pieza simultáneamente, así que 100 piezas se producen en 5 minutos.'
        },
        {
            id: '94',
            category: 'Lógica',
            subject: 'logic',
            question: '¿Cuál de las siguientes opciones no pertenece al grupo? Manzana, Pera, Zanahoria, Uva',
            text: '¿Cuál de las siguientes opciones no pertenece al grupo? Manzana, Pera, Zanahoria, Uva',
            options: ['Zanahoria', 'Manzana', 'Pera', 'Uva'],
            correctAnswer: 0,
            explanation: 'Manzana, pera y uva son frutas. La zanahoria es una verdura/hortaliza, por lo que no pertenece al grupo.'
        },
        {
            id: '95',
            category: 'Lógica',
            subject: 'logic',
            question: 'Un granjero tiene 17 ovejas. Todas menos 9 se escapan. ¿Cuántas ovejas le quedan?',
            text: 'Un granjero tiene 17 ovejas. Todas menos 9 se escapan. ¿Cuántas ovejas le quedan?',
            options: ['9', '8', '17', '0'],
            correctAnswer: 0,
            explanation: '"Todas menos 9 se escapan" significa que 9 NO se escaparon, así que le quedan 9 ovejas.'
        },
        {
            id: '96',
            category: 'Lógica',
            subject: 'logic',
            question: 'Si A → B y B → C, entonces:',
            text: 'Si A → B y B → C, entonces:',
            options: ['A → C', 'C → A', 'A → B solamente', 'No se puede concluir nada'],
            correctAnswer: 0,
            explanation: 'Esta es la propiedad transitiva del condicional. Si A implica B y B implica C, entonces A implica C (silogismo hipotético).'
        },
        {
            id: '97',
            category: 'Lógica',
            subject: 'logic',
            question: '¿Cuántos cubos se necesitan para construir una pirámide de 3 niveles? (1 cubo arriba, 4 en medio, 9 abajo)',
            text: '¿Cuántos cubos se necesitan para construir una pirámide de 3 niveles? (1 cubo arriba, 4 en medio, 9 abajo)',
            options: ['14', '12', '13', '15'],
            correctAnswer: 0,
            explanation: 'Nivel 1 (arriba): 1² = 1. Nivel 2 (medio): 2² = 4. Nivel 3 (abajo): 3² = 9. Total = 1 + 4 + 9 = 14.'
        },
        {
            id: '98',
            category: 'Lógica',
            subject: 'logic',
            question: 'Si "AZUL" se escribe como 1-26-21-12, ¿cómo se escribe "ROJO"?',
            text: 'Si "AZUL" se escribe como 1-26-21-12, ¿cómo se escribe "ROJO"?',
            options: ['18-15-10-15', '17-14-10-14', '18-16-10-16', '19-15-11-15'],
            correctAnswer: 0,
            explanation: 'El código asigna a cada letra su posición en el alfabeto: R=18, O=15, J=10, O=15.'
        },
        {
            id: '99',
            category: 'Lógica',
            subject: 'logic',
            question: 'Hay 3 cajas: una dice "Manzanas", otra "Naranjas" y otra "Manzanas y Naranjas". TODAS las etiquetas están EQUIVOCADAS. Si de la caja "Manzanas y Naranjas" sacas una manzana, ¿qué contiene realmente esa caja?',
            text: 'Hay 3 cajas: una dice "Manzanas", otra "Naranjas" y otra "Manzanas y Naranjas". TODAS las etiquetas están EQUIVOCADAS. Si de la caja "Manzanas y Naranjas" sacas una manzana, ¿qué contiene realmente esa caja?',
            options: ['Solo manzanas', 'Solo naranjas', 'Manzanas y naranjas', 'Está vacía'],
            correctAnswer: 0,
            explanation: 'Como TODAS las etiquetas están mal, la caja "Manzanas y Naranjas" NO puede tener ambas. Si sacamos una manzana, debe contener solo manzanas.'
        },
        {
            id: '100',
            category: 'Lógica',
            subject: 'logic',
            question: 'Completa la serie: 2, 6, 18, 54, ...',
            text: 'Completa la serie: 2, 6, 18, 54, ...',
            options: ['162', '108', '72', '216'],
            correctAnswer: 0,
            explanation: 'Es una progresión geométrica donde cada término se multiplica por 3. 54 × 3 = 162.'
        },
        // --- COMPRENSIÓN LECTORA (101-120) ---
        {
            id: '101',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '¿Cuál es el significado de la palabra "UBICUO"?',
            text: '¿Cuál es el significado de la palabra "UBICUO"?',
            options: ['Que está presente en todas partes', 'Que es muy raro', 'Que está escondido', 'Que se mueve rápido'],
            correctAnswer: 0,
            explanation: 'Ubicuo proviene del latín "ubique" (en todas partes). Se usa para describir algo que parece estar en todos los lugares al mismo tiempo.'
        },
        {
            id: '102',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Lectura: "La Revolución Industrial transformó radicalmente la producción, pasando del trabajo artesanal al mecánico. Sin embargo, también generó graves problemas sociales como la explotación laboral." ¿Cuál es la postura del autor?',
            text: 'Lectura: "La Revolución Industrial transformó radicalmente la producción, pasando del trabajo artesanal al mecánico. Sin embargo, también generó graves problemas sociales como la explotación laboral." ¿Cuál es la postura del autor?',
            options: ['Presenta una visión equilibrada con pros y contras', 'Está completamente en contra de la industrialización', 'Solo destaca los beneficios', 'Es indiferente al tema'],
            correctAnswer: 0,
            explanation: 'El autor reconoce la transformación (positivo) pero señala sus consecuencias negativas. Esto muestra una postura equilibrada.'
        },
        {
            id: '103',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Selecciona la oración que utiliza correctamente los signos de puntuación:',
            text: 'Selecciona la oración que utiliza correctamente los signos de puntuación:',
            options: ['María, Juan y Pedro fueron al cine; sin embargo, Ana se quedó en casa.', 'María Juan, y Pedro fueron al cine, sin embargo Ana se quedó en casa.', 'María; Juan y Pedro fueron al cine sin embargo, Ana se quedó en casa.', 'María Juan y Pedro, fueron al cine sin embargo Ana, se quedó en casa.'],
            correctAnswer: 0,
            explanation: 'La primera opción usa correctamente la coma enumerativa, el punto y coma antes de "sin embargo", y la coma después de la expresión adversativa.'
        },
        {
            id: '104',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '¿Qué figura retórica se usa en: "Sus ojos eran dos luceros que iluminaban la noche"?',
            text: '¿Qué figura retórica se usa en: "Sus ojos eran dos luceros que iluminaban la noche"?',
            options: ['Metáfora', 'Hipérbole', 'Ironía', 'Onomatopeya'],
            correctAnswer: 0,
            explanation: 'Es una metáfora porque compara directamente los ojos con luceros (estrellas) sin usar "como" o "parecido a".'
        },
        {
            id: '105',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '¿Cuál es el antónimo de "PROLIJO"?',
            text: '¿Cuál es el antónimo de "PROLIJO"?',
            options: ['Descuidado', 'Meticuloso', 'Extenso', 'Ordenado'],
            correctAnswer: 0,
            explanation: 'Prolijo significa detallado, minucioso o cuidadoso. Su antónimo es descuidado o negligente.'
        },
        {
            id: '106',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Lectura: "El calentamiento global no es una amenaza futura; es una crisis actual. Los glaciares retroceden, los océanos se acidifican y las temperaturas baten récords año tras año." El tipo de texto es:',
            text: 'Lectura: "El calentamiento global no es una amenaza futura; es una crisis actual. Los glaciares retroceden, los océanos se acidifican y las temperaturas baten récords año tras año." El tipo de texto es:',
            options: ['Expositivo-argumentativo', 'Narrativo', 'Lírico', 'Instructivo'],
            correctAnswer: 0,
            explanation: 'El texto expone datos sobre el calentamiento global y argumenta que es una crisis actual, combinando exposición con argumentación.'
        },
        {
            id: '107',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '¿Cuál de las siguientes palabras es esdrújula?',
            text: '¿Cuál de las siguientes palabras es esdrújula?',
            options: ['Matemáticas', 'Reloj', 'Canción', 'Mesa'],
            correctAnswer: 0,
            explanation: 'Las palabras esdrújulas llevan el acento en la antepenúltima sílaba: Ma-te-MÁ-ti-cas. Siempre llevan tilde.'
        },
        {
            id: '108',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '"A buen entendedor, pocas palabras bastan." ¿Qué tipo de texto es este?',
            text: '"A buen entendedor, pocas palabras bastan." ¿Qué tipo de texto es este?',
            options: ['Refrán', 'Metáfora', 'Hipérbole', 'Adivinanza'],
            correctAnswer: 0,
            explanation: 'Es un refrán: una frase popular de origen antiguo que expresa una enseñanza o consejo de manera breve y memorable.'
        },
        {
            id: '109',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Lectura: "Los videojuegos, lejos de ser una mera distracción, pueden desarrollar habilidades cognitivas como la resolución de problemas y la coordinación mano-ojo." ¿Cuál es la intención comunicativa?',
            text: 'Lectura: "Los videojuegos, lejos de ser una mera distracción, pueden desarrollar habilidades cognitivas como la resolución de problemas y la coordinación mano-ojo." ¿Cuál es la intención comunicativa?',
            options: ['Cambiar una percepción negativa sobre los videojuegos', 'Promover la venta de videojuegos', 'Criticar a quienes juegan videojuegos', 'Describir la historia de los videojuegos'],
            correctAnswer: 0,
            explanation: 'El texto busca desafiar la idea de que los videojuegos son "mera distracción", presentando sus beneficios cognitivos para cambiar la percepción del lector.'
        },
        {
            id: '110',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '¿Cuál es el significado de la expresión "dar gato por liebre"?',
            text: '¿Cuál es el significado de la expresión "dar gato por liebre"?',
            options: ['Engañar dando algo de menor valor', 'Regalar un animal', 'Cocinar un platillo exótico', 'Ser muy generoso'],
            correctAnswer: 0,
            explanation: 'Es una expresión que significa engañar a alguien entregándole algo de menor calidad o valor de lo acordado.'
        },
        {
            id: '111',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '¿Cuál de las siguientes oraciones contiene un verbo en modo subjuntivo?',
            text: '¿Cuál de las siguientes oraciones contiene un verbo en modo subjuntivo?',
            options: ['Espero que vengas mañana', 'Ayer fui al mercado', 'Ella canta muy bien', 'El perro corre rápido'],
            correctAnswer: 0,
            explanation: '"Vengas" es un verbo en modo subjuntivo, que expresa deseo, duda o posibilidad. Las demás opciones usan indicativo.'
        },
        {
            id: '112',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Lectura: "La procrastinación es el hábito de postergar tareas importantes por actividades más placenteras o menos urgentes." ¿Qué significa "postergar"?',
            text: 'Lectura: "La procrastinación es el hábito de postergar tareas importantes por actividades más placenteras o menos urgentes." ¿Qué significa "postergar"?',
            options: ['Aplazar o dejar para después', 'Terminar rápidamente', 'Olvidar por completo', 'Realizar con esmero'],
            correctAnswer: 0,
            explanation: 'Postergar significa dejar algo para después, aplazarlo. Es la acción central que define la procrastinación.'
        },
        {
            id: '113',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '¿Qué figura retórica se utiliza en "Tengo tanta hambre que me comería un elefante"?',
            text: '¿Qué figura retórica se utiliza en "Tengo tanta hambre que me comería un elefante"?',
            options: ['Hipérbole', 'Metáfora', 'Simil', 'Personificación'],
            correctAnswer: 0,
            explanation: 'Es una hipérbole porque exagera la realidad (nadie puede comerse un elefante) para dar énfasis a lo que se siente.'
        },
        {
            id: '114',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '¿Cuál es la diferencia principal entre "haya", "halla" y "allá"?',
            text: '¿Cuál es la diferencia principal entre "haya", "halla" y "allá"?',
            options: ['Haya es del verbo haber, halla del verbo hallar, allá es un adverbio de lugar', 'Son sinónimos', 'Halla es del verbo haber, haya del verbo hallar', 'No existe diferencia gramatical'],
            correctAnswer: 0,
            explanation: '"Haya" es del verbo haber (espero que haya). "Halla" es del verbo hallar/encontrar (él halla la solución). "Allá" indica lugar (voy allá).'
        },
        {
            id: '115',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Lectura: "Don Quijote cabalgaba junto a Sancho Panza, soñando con hazañas que solo existían en su imaginación." El narrador de este fragmento es:',
            text: 'Lectura: "Don Quijote cabalgaba junto a Sancho Panza, soñando con hazañas que solo existían en su imaginación." El narrador de este fragmento es:',
            options: ['Narrador omnisciente en tercera persona', 'Narrador protagonista', 'Narrador testigo', 'Narrador en segunda persona'],
            correctAnswer: 0,
            explanation: 'El narrador habla en tercera persona ("cabalgaba") y conoce los pensamientos del personaje ("soñando"), lo que lo hace omnisciente.'
        },
        {
            id: '116',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '¿Cuál es el sinónimo más cercano de "ACUCIOSO"?',
            text: '¿Cuál es el sinónimo más cercano de "ACUCIOSO"?',
            options: ['Diligente', 'Perezoso', 'Tímido', 'Dudoso'],
            correctAnswer: 0,
            explanation: 'Acucioso significa que actúa con diligencia, interés y cuidado. Diligente es el sinónimo más cercano.'
        },
        {
            id: '117',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '¿Qué tipo de palabra es "rápidamente"?',
            text: '¿Qué tipo de palabra es "rápidamente"?',
            options: ['Adverbio', 'Adjetivo', 'Sustantivo', 'Verbo'],
            correctAnswer: 0,
            explanation: 'Las palabras terminadas en "-mente" son adverbios de modo. Modifican al verbo indicando cómo se realiza la acción.'
        },
        {
            id: '118',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Lectura: "Aunque la inteligencia artificial ha avanzado enormemente, los expertos debaten si alguna vez podrá experimentar emociones genuinas." La función de la palabra "aunque" es:',
            text: 'Lectura: "Aunque la inteligencia artificial ha avanzado enormemente, los expertos debaten si alguna vez podrá experimentar emociones genuinas." La función de la palabra "aunque" es:',
            options: ['Introducir una concesión o contraste', 'Indicar causa', 'Señalar consecuencia', 'Agregar información'],
            correctAnswer: 0,
            explanation: '"Aunque" es una conjunción concesiva que introduce una idea que contrasta o se opone a lo que sigue en la oración.'
        },
        {
            id: '119',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: '¿Cuál es el antónimo de "BENEVOLENTE"?',
            text: '¿Cuál es el antónimo de "BENEVOLENTE"?',
            options: ['Malévolo', 'Bondadoso', 'Amable', 'Generoso'],
            correctAnswer: 0,
            explanation: 'Benevolente significa que tiene buena voluntad hacia los demás. Su opuesto es malévolo, que implica mala intención.'
        },
        {
            id: '120',
            category: 'Comprensión Lectora',
            subject: 'reading',
            question: 'Identifica el error en la siguiente oración: "Hubieron muchas personas en la fiesta".',
            text: 'Identifica el error en la siguiente oración: "Hubieron muchas personas en la fiesta".',
            options: ['El verbo "haber" usado como impersonal debe ir en singular: "Hubo"', 'Falta una coma después de "Hubieron"', '"Personas" debería ser "gente"', 'No hay ningún error'],
            correctAnswer: 0,
            explanation: 'El verbo "haber" cuando se usa como impersonal (indicando existencia) siempre va en singular, sin importar que el complemento sea plural. Lo correcto es: "Hubo muchas personas".'
        }
    ];

    constructor() {
        this.initializeQuestions();
    }

    getDailyChallenge(count: number = 15): TrainingQuestion[] {
        // 1. Shuffle the list of questions first
        const shuffledQuestions = [...this.allQuestions].sort(() => 0.5 - Math.random());

        // 2. Select the subset
        const selectedQuestions = shuffledQuestions.slice(0, Math.min(count, this.allQuestions.length));

        // 3. Shuffle options for each selected question
        return selectedQuestions.map(q => this.shuffleOptionsForQuestion(q));
    }

    private shuffleOptionsForQuestion(question: TrainingQuestion): TrainingQuestion {
        // Store the correct answer value before shuffling
        const correctAnswerValue = question.options[question.correctAnswer];

        // Create a copy of options and shuffle them
        const shuffledOptions = [...question.options].sort(() => 0.5 - Math.random());

        // Find the new index of the correct answer
        const newCorrectIndex = shuffledOptions.indexOf(correctAnswerValue);

        // Return a new question object with shuffled options and updated index
        return {
            ...question,
            options: shuffledOptions,
            correctAnswer: newCorrectIndex
        };
    }

    private initializeQuestions() {
        // Use the 120 high-quality static questions (IDs 1-120)
        // to ensure the "Reto del Día" is curated and high-quality.
        // Covers Matemáticas, Lógica and Comprensión Lectora.
        this.allQuestions = [...this.staticQuestions];
    }
}
