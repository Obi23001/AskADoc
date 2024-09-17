import { Component } from "@angular/core";
import { FooterComponent } from "../footer/footer.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [FooterComponent, NavBarComponent],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css",
})
export class LayoutComponent {}
