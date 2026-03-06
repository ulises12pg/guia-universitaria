import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LegalModalComponent } from './shared/components/legal-modal/legal-modal.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, MatSlideToggleModule, MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('InnovaUni 1.2');

  constructor(
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
  }

  openLegal(type: 'terms' | 'data' | 'privacy') {
    let title = '';
    let content = '';

    switch (type) {
      case 'terms':
        title = 'Términos y Condiciones';
        content = `
          <p>Bienvenido a InnovaUni 1.2. Al usar esta aplicación, aceptas nuestros términos.</p>
          <p>1. <strong>Uso Personal:</strong> Esta herramienta es para orientación vocacional personal.</p>
          <p>2. <strong>Sin Garantías:</strong> Los resultados son sugerencias basadas en tus respuestas y no garantizan admisión a ninguna institución.</p>
          <p>3. <strong>Propiedad Intelectual:</strong> Todo el contenido es propiedad de InnovaUni 1.2 2026.</p>
        `;
        break;
      case 'data':
        title = 'Uso de Datos';
        content = `
          <p>Entendemos la importancia de tus datos.</p>
          <p>Utilizamos almacenamiento local (LocalStorage) en tu dispositivo para guardar tu progreso. No enviamos tus datos personales a servidores externos sin tu consentimiento explícito.</p>
          <p>Los datos recopilados (edad, escuela, preferencias) se usan exclusivamente para personalizar tu experiencia.</p>
        `;
        break;
      case 'privacy':
        title = 'Aviso de Privacidad';
        content = `
          <p>Tu privacidad es nuestra prioridad.</p>
          <p>De acuerdo con la normativa vigente de protección de datos personales:</p>
          <ul>
            <li>No compartimos tu información con terceros.</li>
            <li>Tienes derecho a borrar todos tus datos usando la opción "Hard Reset" en el Dashboard.</li>
            <li>Para cualquier duda, contáctanos en privacidad@innovauni.mx.</li>
          </ul>
        `;
        break;
    }

    this.dialog.open(LegalModalComponent, {
      data: { title, content },
      width: '600px'
    });
  }
}
