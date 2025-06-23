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
  logLevel(level: string) {
    console.log('Navigating to level:', level);
  }
  userName: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    {
      this.userName = localStorage.getItem('userName') || '';
    }
    this.userName = localStorage.getItem('userName') || '';
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      window.close(); // Close the tab when back is pressed
      history.pushState(null, '', location.href); // Push again just in case
    };
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
      alert("Please use the Logout button to exit.");
    };

  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    // If user presses back, close the tab/window
    window.close();
  }


  logout() {
    // Clear user info
    localStorage.removeItem('userName');
    localStorage.removeItem('token'); // if using JWT
    // Clear other user-specific data
    ['Beginner', 'Average', 'Expert'].forEach(level =>
      localStorage.removeItem(`${level}Performance`)
    );

    // Redirect to login
    this.router.navigate(['/login']);
  }
}
