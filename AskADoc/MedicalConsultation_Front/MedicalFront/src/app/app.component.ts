import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { initFlowbite } from "flowbite";
import { isPlatformBrowser } from "@angular/common";
import { LayoutComponent } from "./components/layout/layout.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { FooterComponent } from "./components/footer/footer.component";


@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    HomePageComponent,
    NavBarComponent,
    FooterComponent
],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "MedicalFront";

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import("flowbite").then(({ initFlowbite }) => {
        initFlowbite();
      });
    }
  }
}
