import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AuthenticatedLayout } from './layouts/authenticated-layout/authenticated-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { Management } from './pages/management/management';
import { AuthGuard } from './guards/auth-guard';
import { NoAuthGuard } from './guards/no-auth-guard';
import { FormEdit } from './pages/form-edit/form-edit';

export const routes: Routes = [
    {
        path: 'form-edit',
        component: FormEdit,
        canActivate: [AuthGuard]
    },
    {
        path: 'form-edit/:id',
        component: FormEdit,
        canActivate: [AuthGuard]
    },
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
        path: 'management',
        component: Management,
        canActivate: [AuthGuard]
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
];