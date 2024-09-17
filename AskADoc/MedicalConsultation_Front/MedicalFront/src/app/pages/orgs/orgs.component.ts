import { Component, OnInit } from '@angular/core';
import { SearchComponent } from '../../components/search/search.component';
import { OrgcardComponent } from '../../components/orgcard/orgcard.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../services/OrganizationService';
import { Organization } from '../../models/organization.model';
import { OrganizationTypes } from '../../models/organization-types';
import { OrganizationTypesDisplay } from '../../models/organization-types-display';

@Component({
  selector: 'app-orgs',
  standalone: true,
  imports: [OrgcardComponent, SearchComponent, PaginationComponent, CommonModule],
  templateUrl: './orgs.component.html',
  styleUrl: './orgs.component.css'
})
export class OrgsComponent implements OnInit {
  organizations: Organization[] = [];
  filteredOrganizations: Organization[] = [];
  displayedOrganizations: Organization[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  searchCategories: { key: string, value: string }[] = [
    { key: 'All', value: 'All Organizations' },
    ...Object.entries(OrganizationTypesDisplay).map(([key, value]) => ({
      key: key,
      value: value
    }))
  ];
  profileImageUrl: string = '';

  constructor(private organizationService: OrganizationService) {}

  ngOnInit() {
    this.fetchOrganizations();
  }

  fetchOrganizations() {
    this.organizationService.getAllOrganizations().subscribe({
      next: (organizations) => {
        this.organizations = organizations.map(org => {
          if (org['profileImage']) {
            org['profileImageUrl'] = 'data:image/jpeg;base64,' + org['profileImage'];
          }
          return org;
        });
        this.filterOrganizations();
      },
      error: (error) => {
        console.error('Error fetching organizations:', error);
      }
    });
  }

  onSearch(searchTerm: string) {
    this.currentPage = 1;
    this.filterOrganizations(searchTerm);
  }

  onFilter(type: string) {
    this.currentPage = 1;
    this.filterOrganizations(undefined, type as OrganizationTypes | 'All');
  }

  filterOrganizations(searchTerm?: string, type?: OrganizationTypes | 'All') {
    let filtered = this.organizations.filter(org => org.verified === true);

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(org => {
        return org.organizationName.toLowerCase().includes(lowerCaseSearchTerm) ||
               OrganizationTypesDisplay[org.typeOfInstitution].toLowerCase().includes(lowerCaseSearchTerm);
      });
    }

    if (type && type !== 'All') {
      filtered = filtered.filter(org => org.typeOfInstitution === type);
    }

    this.filteredOrganizations = filtered;
    this.totalPages = Math.ceil(this.filteredOrganizations.length / this.pageSize);
    this.updatePagedOrganizations();
  }

  updatePagedOrganizations() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedOrganizations = this.filteredOrganizations.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedOrganizations();
  }
}
