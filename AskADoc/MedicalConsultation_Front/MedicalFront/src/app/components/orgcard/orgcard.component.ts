import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationTypes } from '../../models/organization-types';
import { OrganizationTypesDisplay } from '../../models/organization-types-display';

@Component({
  selector: 'app-orgcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orgcard.component.html',
  styleUrl: './orgcard.component.css'
})
export class OrgcardComponent {
  @Input() image: string = '';
  @Input() name: string = '';
  @Input() type: OrganizationTypes = OrganizationTypes.HOSPITAL;
  @Input() description: string = '';
  @Input() facilityCity: string = '';

  get typeDisplay(): string {
    return OrganizationTypesDisplay[this.type];
  }
}