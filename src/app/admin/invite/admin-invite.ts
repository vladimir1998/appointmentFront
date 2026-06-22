import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersApiService } from '../../core/services/users-api.service';
import { InviteApiService } from '../../core/services/invite-api.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-admin-invite',
  imports: [FormsModule],
  templateUrl: './admin-invite.html',
  styleUrl: './admin-invite.scss',
})
export class AdminInvite {
  private readonly router = inject(Router);
  private readonly usersApi = inject(UsersApiService);
  private readonly inviteApi = inject(InviteApiService);

  email = '';

  foundUser = signal<User | null>(null);
  searching = signal(false);
  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  onEmailChange(): void {
    this.foundUser.set(null);
    this.success.set(null);
    this.error.set(null);
  }

  searchUser(): void {
    if (!this.email.trim()) return;

    this.searching.set(true);
    this.foundUser.set(null);
    this.error.set(null);

    this.usersApi.getAll(this.email.trim()).subscribe({
      next: (users) => {
        const exact = users.find(u => u.email.toLowerCase() === this.email.trim().toLowerCase());
        if (exact) {
          this.foundUser.set(exact);
        } else {
          this.error.set(`No user found with email "${this.email}"`);
        }
        this.searching.set(false);
      },
      error: () => {
        this.error.set('Failed to search users');
        this.searching.set(false);
      },
    });
  }

  onSubmit(): void {
    const user = this.foundUser();
    if (!user) return;

    this.error.set(null);
    this.success.set(null);
    this.loading.set(true);

    this.inviteApi.create({ userId: user.id }).subscribe({
      next: () => {
        this.success.set(`Invitation sent to ${user.email}`);
        this.email = '';
        this.foundUser.set(null);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to send invitation');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/invites']);
  }
}
