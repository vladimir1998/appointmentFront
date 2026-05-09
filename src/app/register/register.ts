import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../common/input/input.component';

@Component({
  selector: 'app-register',
  imports: [FormsModule, InputComponent, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = signal<string | null>(null);
  loading = signal(false);
  agreed = signal(false);

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }
    if (!this.agreed()) {
      this.error.set('Please accept the terms of service');
      return;
    }

    this.error.set(null);
    this.loading.set(true);

    // TODO: call register API
    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/login']);
    }, 1000);
  }
}
