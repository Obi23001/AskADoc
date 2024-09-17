import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from "rxjs";
import { Router } from '@angular/router';
import { OrganizationService } from '../../services/OrganizationService';
import { User } from '../../models/user.model'; // Import the User model

interface ExtendedUser extends User {
  fullName: string;
}

@Component({
  selector: "nav-bar",
  standalone: true,
  imports: [NgbModule, CommonModule, RouterModule],
  templateUrl: "./nav-bar.component.html",
  styleUrl: "./nav-bar.component.css",
})
export class NavBarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  user: ExtendedUser | null = null;
  userEmail: string = '';
  private authSubscription!: Subscription;
  isDropdownOpen: boolean = false;
  isLoading: boolean = true; // Add a loading state
  profileImageUrl: string = 'https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg';
  isMoreDropdownOpen: boolean = false;

  constructor(public authService: AuthService, private router: Router, private organizationService: OrganizationService) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        if (isAuthenticated) {
          this.authService.getUserProfile().subscribe((currentUser: User) => {
            this.user = { 
              ...currentUser, // Spread the currentUser object to include all properties
              fullName: currentUser.firstName + ' ' + currentUser.lastName || 'User'
            };
            this.userEmail = currentUser.email || '';
            this.isLoading = false; // Set loading to false once user data is loaded
          });
        } else {
          this.user = null;
          this.userEmail = '';
          this.isLoading = false; // Set loading to false if not authenticated
        }
      }
    );
    this.loadUserProfile();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  getUserRole(): string {
    const role = this.authService.getUserRole();
    return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      },
      complete: () => {
        this.isDropdownOpen = false;
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMoreDropdown() {
    this.isMoreDropdownOpen = !this.isMoreDropdownOpen;
  }


  getDashboardLink(): string {
    const role = this.authService.getUserRole();
    switch (role?.toLowerCase()) {
      case 'doctor':
        return '/doctor-dashboard';
      case 'patient':
        return '/patient-dashboard';
      case 'organization':
        return '/organization-dashboard';
      default:
        return '/dashboard';
    }
  }

  redirectToDashboard() {
    const dashboardLink = this.getDashboardLink();
    this.router.navigate([dashboardLink]);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const dropdownContainer = document.getElementById('dropdownContainer');
    if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }

  loadUserProfile() {
    this.authService.getUserProfile().subscribe({
      next: (user: User) => {
        if (user.profileImage) {
          this.profileImageUrl = 'data:image/jpeg;base64,' + user.profileImage;
        }
      },
      error: (error: any) => {
        console.error('Error loading organization profile:', error);
      }
    });
  }
}