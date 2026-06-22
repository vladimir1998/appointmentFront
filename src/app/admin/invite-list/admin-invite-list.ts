import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InviteApiService, Invite } from '../../core/services/invite-api.service';

@Component({
  selector: 'app-admin-invite-list',
  imports: [RouterLink],
  templateUrl: './admin-invite-list.html',
  styleUrl: './admin-invite-list.scss',
})
export class AdminInviteList implements OnInit {
  private readonly api = inject(InviteApiService);

  invites = signal<Invite[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  filter = signal<'all' | 'pending' | 'accepted'>('all');

  filtered = computed(() => {
    const f = this.filter();
    return this.invites().filter(i =>
      f === 'all' ? true : f === 'accepted' ? !!i.acceptedAt : !i.acceptedAt
    );
  });

  counts = computed(() => ({
    all:      this.invites().length,
    pending:  this.invites().filter(i => !i.acceptedAt).length,
    accepted: this.invites().filter(i => !!i.acceptedAt).length,
  }));

  ngOnInit(): void {
    this.api.getAll().subscribe({
      next: (data) => {
        this.invites.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load invites');
      },
    });
  }

  userName(invite: Invite): string {
    const { firstName, lastName, email } = invite.user;
    if (firstName || lastName) return `${firstName ?? ''} ${lastName ?? ''}`.trim();
    return email;
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}
