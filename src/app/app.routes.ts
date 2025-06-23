// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { TypingTestComponent } from './typing-test/typing-test';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { LevelSelectionComponent } from './level-selection/level-selection';
import { AverageComponent } from './average/average';
import { ExpertComponent } from './expert/expert';

export const routes: Routes = [
    { path: '', redirectTo: 'signup', pathMatch: 'full' }, // ✅ Entry point
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'level-selection', component: LevelSelectionComponent },
    { path: 'typing-test', component: TypingTestComponent },
    { path: 'average', component: AverageComponent },
    { path: 'expert', component: ExpertComponent },
];
