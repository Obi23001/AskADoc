import { Component, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "card",
  standalone: true,
  imports: [CardModule, ButtonModule, MatCardModule, MatButtonModule],
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.css",
})
export class CardComponent {}
