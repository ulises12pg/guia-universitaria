import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/onboarding',
        pathMatch: 'full'
    },
    {
        path: 'onboarding',
        loadComponent: () => import('./features/onboarding/onboarding').then(m => m.OnboardingComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
    },
    {
        path: 'universities',
        loadComponent: () => import('./features/universities/universities').then(m => m.UniversitiesComponent)
    },
    {
        path: 'quests',
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
            },
            {
                path: 'quick-riddles',
                loadComponent: () => import('./features/quests/quick-riddles/quick-riddles').then(m => m.QuickRiddlesComponent)
            }
        ]
    },
    {
        path: 'training',
        loadComponent: () => import('./features/training/daily-training.component').then(m => m.DailyTrainingComponent)
    },
    {
        path: 'exams',
        loadComponent: () => import('./features/exams/exams.component').then(m => m.ExamsComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent)
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];

