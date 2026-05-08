import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { InputComponent } from '../common/input/input.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, InputComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);

  email = '';
  password = '';
  error = signal<string | null>(null);
  loading = signal(false);
  rememberMe = signal(false);

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      error: () => {
        this.error.set('Invalid email or password');
        this.loading.set(false);
      },
    });
  }
}
