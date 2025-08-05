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
    // Hide splash screen after 3 seconds
    setTimeout(() => {
      this.showSplash = false;
    }, 3000); // adjust duration here
  }
 }
