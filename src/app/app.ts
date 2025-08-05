// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class App {
  showSplash = true;

  ngOnInit() {
    setTimeout(() => {
      this.showSplash = false;
    }, 5000); // Show splash for 5 seconds
  }
 }
