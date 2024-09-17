import { Component } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { CardComponent } from '../../components/card/card.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavBarComponent, HeroComponent, CardComponent, FooterComponent, TestimonialsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
