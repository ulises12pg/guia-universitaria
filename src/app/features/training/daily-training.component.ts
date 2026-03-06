import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { TrainingService, TrainingQuestion } from '../../core/services/training.service';
import { GamificationService } from '../../core/services/gamification.service';

import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-daily-training',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatChipsModule
    ],
    template: `
    <div class="training-container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Entrenamiento Diario</h1>
      </div>

      <div class="quiz-container" *ngIf="!completed">
        <div class="progress-bar">
            <span>Pregunta {{ currentIndex + 1 }} de {{ questions.length }}</span>
            <mat-progress-bar mode="determinate" [value]="((currentIndex + 1) / questions.length) * 100"></mat-progress-bar>
        </div>

        <mat-card class="question-card" [@fadeIn]>
            <div class="question-header">
                <mat-chip-set>
                    <mat-chip [color]="getSubjectColor(currentQuestion.subject)" highlighted>
                        {{ formatSubject(currentQuestion.subject) }}
                    </mat-chip>
                </mat-chip-set>
                <h2>{{ currentQuestion.text }}</h2>
            </div>

            <div class="options-grid">
                <button mat-raised-button 
                    *ngFor="let option of currentQuestion.options; let i = index"
                    class="option-btn"
                    [class.selected]="selectedAnswerIndex === i"
                    [class.correct]="isAnswerChecked && i === currentQuestion.correctAnswer"
                    [class.incorrect]="isAnswerChecked && selectedAnswerIndex === i && i !== currentQuestion.correctAnswer"
                    (click)="selectAnswer(i)"
                    [disabled]="isAnswerChecked">
                    {{ option }}
                    <mat-icon *ngIf="isAnswerChecked && i === currentQuestion.correctAnswer">check_circle</mat-icon>
                    <mat-icon *ngIf="isAnswerChecked && selectedAnswerIndex === i && i !== currentQuestion.correctAnswer">cancel</mat-icon>
                </button>
            </div>

            <div class="actions">
                <button mat-raised-button color="primary" (click)="checkAnswer()" *ngIf="!isAnswerChecked" [disabled]="selectedAnswerIndex === null">
                    Comprobar
                </button>
                <button mat-raised-button color="accent" (click)="nextQuestion()" *ngIf="isAnswerChecked">
                    {{ currentIndex < questions.length - 1 ? 'Siguiente' : 'Finalizar' }}
                </button>
            </div>
        </mat-card>
      </div>

      <div class="results-container" *ngIf="completed" [@fadeIn]>
          <mat-card class="result-card">
              <mat-icon class="score-icon">emoji_events</mat-icon>
              <h2>¡Entrenamiento Completado!</h2>
              <div class="score-circle">
                  <span class="score">{{ score }} / {{ questions.length }}</span>
                  <span class="label">Aciertos</span>
              </div>
              
              <p class="score-message">{{ getFeedbackMessage() }}</p>

              <div class="rewards">
                  <span>+{{ expEarned }} EXP</span>
              </div>

              <div class="bonus-section" *ngIf="!bonusUsed">
                  <button mat-raised-button class="bonus-btn" (click)="watchAdForBonus()">
                      <mat-icon>play_circle</mat-icon>
                      Ver anuncio para +5 preguntas extra
                  </button>
                  <span class="bonus-hint">Gana EXP adicional practicando más</span>
              </div>
              <div class="bonus-section" *ngIf="bonusUsed">
                  <span class="bonus-used">✅ Preguntas extra desbloqueadas</span>
              </div>

              <div class="actions">
                  <button mat-raised-button color="accent" *ngIf="bonusUsed && !bonusCompleted" (click)="startBonus()">Iniciar Preguntas Extra</button>
                  <button mat-raised-button color="primary" (click)="goBack()">Volver al Dashboard</button>
              </div>
          </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .training-container {
        padding: 20px;
        padding-bottom: 80px;
        max-width: 800px;
        margin: 0 auto;
        min-height: 100vh;
        background: #f5f7fa;
    }
    .header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
        color: #2c3e50;
    }
    .progress-bar {
        margin-bottom: 20px;
        text-align: right;
        font-size: 0.9rem;
        color: #666;
    }
    .question-card, .result-card {
        padding: 30px;
        border-radius: 16px;
        background: white;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .question-header {
        margin-bottom: 30px;
        text-align: center;
        h2 { margin-top: 15px; font-size: 1.3rem; }
    }
    .options-grid {
        display: grid;
        gap: 15px;
        margin-bottom: 30px;
    }
    .option-btn {
        padding: 20px;
        text-align: left;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.1rem;
        height: auto;
        white-space: normal;
        
        &.correct { background-color: #d4edda !important; color: #155724; }
        &.incorrect { background-color: #f8d7da !important; color: #721c24; }
        &.selected { border: 2px solid #667eea; background-color: #eef2ff; }
    }
    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        button { padding: 10px 30px; font-size: 1.1rem; height: 50px; }
    }
    .result-card {
        text-align: center;
        .score-icon { font-size: 60px; height: 60px; width: 60px; color: #ffd700; margin-bottom: 20px; }
        .score-circle { 
            background: #667eea; color: white; width: 150px; height: 150px; 
            border-radius: 50%; display: flex; flex-direction: column; 
            align-items: center; justify-content: center; margin: 30px auto;
            .score { font-size: 3rem; font-weight: bold; }
        }
        .rewards { 
            margin: 20px 0; font-size: 1.2rem; font-weight: bold; color: #ff8c00; 
            background: #fff3e0; padding: 10px; border-radius: 8px; display: inline-block;
        }
        .bonus-section {
            margin: 25px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        .bonus-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            padding: 12px 24px !important;
            font-size: 1rem !important;
            height: auto !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            border-radius: 12px !important;
        }
        .bonus-hint {
            font-size: 0.85rem;
            color: #888;
        }
        .bonus-used {
            font-size: 1rem;
            color: #4caf50;
            font-weight: bold;
        }
        .actions { justify-content: center; }
    }
  `],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ])
    ]
})
export class DailyTrainingComponent {
    questions: TrainingQuestion[] = [];
    currentIndex = 0;
    currentQuestion!: TrainingQuestion;
    selectedAnswerIndex: number | null = null;
    isAnswerChecked = false;
    score = 0;
    completed = false;
    expEarned = 0;
    bonusUsed = false;
    bonusCompleted = false;

    constructor(
        private trainingService: TrainingService,
        private gamificationService: GamificationService,
        private router: Router
    ) {
        this.questions = this.trainingService.getDailyChallenge(15);
        this.currentQuestion = this.questions[0];
    }

    getSubjectColor(subject: string): string {
        switch (subject) {
            case 'math': return 'primary';
            case 'reading': return 'accent';
            case 'logic': return 'warn';
            default: return 'primary';
        }
    }

    formatSubject(subject: string): string {
        switch (subject) {
            case 'math': return 'Matemáticas';
            case 'reading': return 'Lectura';
            case 'logic': return 'Lógica';
            default: return subject;
        }
    }

    selectAnswer(index: number) {
        if (!this.isAnswerChecked) {
            this.selectedAnswerIndex = index;
        }
    }

    checkAnswer() {
        if (this.selectedAnswerIndex === null) return;
        this.isAnswerChecked = true;
        if (this.selectedAnswerIndex === this.currentQuestion.correctAnswer) {
            this.score++;
        }
    }

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.currentQuestion = this.questions[this.currentIndex];
            this.selectedAnswerIndex = null;
            this.isAnswerChecked = false;
        } else {
            this.finishTraining();
        }
    }

    finishTraining() {
        this.completed = true;
        // Recalibrated: Base 100 + 20 per correct answer
        this.expEarned = 100 + (this.score * 20);
        this.gamificationService.registrarEntrenamientoCompletado(this.expEarned);

    }

    /**
     * Muestra un anuncio rewarded para desbloquear 5 preguntas extra
     */
    async watchAdForBonus() {
        this.bonusUsed = true;
    }

    /**
     * Inicia las 5 preguntas bonus después de ver el anuncio
     */
    startBonus() {
        // Obtener 5 preguntas nuevas
        const bonusQuestions = this.trainingService.getDailyChallenge(5);
        this.questions = bonusQuestions;
        this.currentIndex = 0;
        this.currentQuestion = this.questions[0];
        this.selectedAnswerIndex = null;
        this.isAnswerChecked = false;
        this.score = 0;
        this.completed = false;
        this.bonusCompleted = true;
        this.expEarned = 0;
    }

    getFeedbackMessage(): string {
        const percentage = (this.score / this.questions.length) * 100;
        if (percentage === 100) return '¡Perfecto! Eres un genio.';
        if (percentage >= 80) return '¡Excelente trabajo!';
        if (percentage >= 60) return 'Bien hecho, sigue practicando.';
        return 'Buen intento, ¡mañana será mejor!';
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }
}
