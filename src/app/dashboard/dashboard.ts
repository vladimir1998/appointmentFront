import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrganizationContextService } from '../core/services/organization-context.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orgContext = inject(OrganizationContextService);

  ngOnInit(): void {
    const orgId = this.route.snapshot.paramMap.get('orgId');
    if (orgId) {
      this.orgContext.set(orgId);
    }
  }
}
