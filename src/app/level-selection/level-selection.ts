import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-level-selection',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './level-selection.html',
  styleUrls: ['./level-selection.css']
})
export class LevelSelectionComponent {
  userName: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.userName = localStorage.getItem('userName') || '';

    // Prevent back navigation by pushing the same history
    history.pushState(null, '', location.href);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    // Show alert only when user tries to go back from this page
    history.pushState(null, '', location.href);
    alert("Please use the Logout button to exit.");
  }

  logLevel(level: string) {
    console.log('Navigating to level:', level);
  }

  logout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    ['Beginner', 'Average', 'Expert'].forEach(level =>
      localStorage.removeItem(`${level}Performance`)
    );

    this.router.navigate(['/login']);
  }
}
