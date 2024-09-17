import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-testimonials",
  templateUrl: "./testimonials.component.html",
  imports: [CommonModule],
  styleUrls: ["./testimonials.component.css"],
  standalone: true,
})
export class TestimonialsComponent implements OnInit {
  testimonials = [
    {
      image:
        "https://as1.ftcdn.net/v2/jpg/07/02/98/70/1000_F_702987027_NnBUPLoKDppCJl0XJJJRm15E1sQoy9I1.jpg",
      text: "The online consultation was straightforward and incredibly helpful. The doctor was very professional and provided excellent care.",
      author: "John Doe",
    },
    {
      image:
        "https://as1.ftcdn.net/v2/jpg/07/02/98/88/1000_F_702988853_xHlkAc0qFNBSKnQO7RUHXhw6cSG42GQp.jpg",
      text: "I had a great experience with the virtual medical consultation. The process was seamless and the advice was spot-on.",
      author: "Jane Smith",
    },
    {
      image:
        "https://as1.ftcdn.net/v2/jpg/07/02/98/88/1000_F_702988863_kkzhdYGAHOsA0d6AKv1XtxGs4HXazUPV.jpg",
      text: "A very convenient way to get medical advice from the comfort of my home. Highly recommend for anyone needing quick medical guidance.",
      author: "Emily Johnson",
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
