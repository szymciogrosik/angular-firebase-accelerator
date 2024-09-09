import {Component} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-photo-slider-second',
  templateUrl: './photo-slider-second.component.html',
  styleUrls: ['./photo-slider-second.component.scss']
})
export class PhotoSliderSecondComponent {
  private basePhotoPath: string = 'assets/images/gallery/';

  constructor() { }
  ngOnInit(): void { }

  title = 'ng-carousel-demo';

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    navText: ['Previous', 'Next'],
    nav: false,
    autoplay: true,
    autoplayTimeout: 10000,
    autoplaySpeed: 1000,
    autoplayHoverPause: true,
  }

  slides = [
    {id: 1, src: this.basePhotoPath + '11.jpg'},
    {id: 2, src: this.basePhotoPath + '12.jpg'},
    {id: 3, src: this.basePhotoPath + '13.jpg'},
    {id: 4, src: this.basePhotoPath + '14.jpg'},
    {id: 5, src: this.basePhotoPath + '15.jpg'},
    {id: 6, src: this.basePhotoPath + '16.jpg'},
    {id: 7, src: this.basePhotoPath + '17.jpg'},
    {id: 8, src: this.basePhotoPath + '18.jpg'},
    {id: 9, src: this.basePhotoPath + '19.jpg'},
    {id: 10, src: this.basePhotoPath + '20.jpg'},
  ];
}
