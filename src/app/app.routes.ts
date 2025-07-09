import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AuthenticatedLayout } from './layouts/authenticated-layout/authenticated-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { AuthGuard } from './guards/auth-guard';
import { NoAuthGuard } from './guards/no-auth-guard';
import { TasksComponent } from './pages/tasks/tasks.component';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
        canActivate: [NoAuthGuard]
    },
    {
        path: 'register',
        component: Register,
        canActivate: [NoAuthGuard]
    },
    {
        path: '',
        component: AuthenticatedLayout,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'profile',
                component: Profile
            },
            {
                path: 'projects',
                component: Dashboard // Temporal
            },
            {
                path: 'filters',
                component: Dashboard // Temporal
            },
            {
                path: 'panels',
                component: Dashboard // Temporal
            },
            {
                path: 'schedules',
                component: Dashboard // Temporal
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/login'

    },
    {
        path: 'tasks',
        component: TasksComponent,
        canActivate: [NoAuthGuard]
    },
];