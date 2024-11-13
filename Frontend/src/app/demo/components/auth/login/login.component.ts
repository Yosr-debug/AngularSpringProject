import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClientUserService } from 'src/app/demo/service/client-user.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    email: string = '';
  password: string = '';
  isSignupMode: boolean = false;
  newUser: any = { emailUser: '', passwordUser: '', firstName: '', lastName: '' };

  constructor(
    private authService: ClientUserService,
    private router: Router,
    private messageService: MessageService,
    public layoutService: LayoutService
  ) {}

  toggleSignupMode() {
    this.isSignupMode = !this.isSignupMode;
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
        next: (response) => {

            const roleUser = response.roleUser;
            this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome!' });
            console.log(response)
            // Store user data (like userId) in local storage if needed
            localStorage.setItem('userId', response.idUser);

            // Redirect based on the role
            if (roleUser === 'USER') {
                this.router.navigate(['/landing']);
            } else {
                this.router.navigate(['/pages/crud']);
            }
        },
        error: () => {
            this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid email or password.' });
        }
    });
}


  signup() {
    this.newUser.roleUser="USER";
    this.authService.signup(this.newUser).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Signup Successful', detail: 'You can now log in!' });
        this.toggleSignupMode();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Signup Failed', detail: 'Email already exists.' });
      }
    });
  }
}
