// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf],
  template: `
    <!-- Splash Screen -->
    <div *ngIf="showSplash" class="splash-screen">
      <img src="assets/SpeedRush logo.png" alt="App Logo" class="splash-logo" />
    </div>

    <!-- Main App -->
    <div *ngIf="!showSplash">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .splash-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      animation: fadeOut 0.5s ease-in-out forwards;
    }

    .splash-logo {
      width: 150px;
      height: auto;
    }

    @keyframes fadeOut {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }
  `]
})
export class AppComponent {
  showSplash = true;

  ngOnInit() {
    setTimeout(() => {
      this.showSplash = false;
    }, 3000); // Splash stays for 3 seconds
  }
}
