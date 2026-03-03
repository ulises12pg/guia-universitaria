import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
    selector: 'app-exams',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatListModule
    ],
    templateUrl: './exams.component.html',
    styleUrls: ['./exams.component.scss']
})
export class ExamsComponent {

    constructor(private router: Router) { }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    goToTraining() {
        this.router.navigate(['/training']);
    }
}
