import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth',
        pathMatch: 'full'
    },
    {
        path: 'onboarding',
        loadComponent: () => import('./features/onboarding/onboarding').then(m => m.OnboardingComponent)
    },
    {
        path: 'auth',
        loadComponent: () => import('./features/auth/auth').then(m => m.AuthComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'universities',
        loadComponent: () => import('./features/universities/universities').then(m => m.UniversitiesComponent),
        canActivate: [authGuard]
    },
    {
        path: 'quests',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/quests/quests').then(m => m.QuestsComponent)
            },
            {
                path: 'vocational-test',
                loadComponent: () => import('./features/quests/vocational-test/vocational-test').then(m => m.VocationalTestComponent)
            },
            {
                path: 'personality-test',
                loadComponent: () => import('./features/quests/personality-test/personality-test').then(m => m.PersonalityTestComponent)
            }
        ]
    },
    {
        path: 'training',
        loadComponent: () => import('./features/training/daily-training.component').then(m => m.DailyTrainingComponent),
        canActivate: [authGuard]
    },
    {
        path: 'exams',
        loadComponent: () => import('./features/exams/exams.component').then(m => m.ExamsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    }
];
