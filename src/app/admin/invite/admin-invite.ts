import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../common/input/input.component';

@Component({
  selector: 'app-admin-invite',
  imports: [FormsModule, InputComponent],
  templateUrl: './admin-invite.html',
  styleUrl: './admin-invite.scss',
})
export class AdminInvite {
  private readonly router = inject(Router);

  email = '';
  role = 'EMPLOYEE';

  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  onSubmit(): void {
    this.error.set(null);
    this.success.set(null);
    this.loading.set(true);

    // TODO: call invite API
    setTimeout(() => {
      this.success.set(`Invitation sent to ${this.email}`);
      this.email = '';
      this.loading.set(false);
    }, 800);
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }
}
