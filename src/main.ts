// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Removed duplicate and erroneous bootstrapApplication call with AppComponent


import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FormsModule),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '548873595438-lprsco12e3enkbhticc329km6cjv5tps.apps.googleusercontent.com'),
          },
        ],
        onError: (err) => {
          console.error('Social Auth Error', err);
        }
      } as SocialAuthServiceConfig,
    },
  ],
});
