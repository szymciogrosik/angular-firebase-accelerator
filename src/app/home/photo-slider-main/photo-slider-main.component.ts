import {Component} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-photo-slider-main',
  templateUrl: './photo-slider-main.component.html',
  styleUrls: ['./photo-slider-main.component.scss']
})
export class PhotoSliderMainComponent {
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
    {id: 1, src: this.basePhotoPath + '1.jpg'},
    {id: 2, src: this.basePhotoPath + '2.jpg'},
    {id: 3, src: this.basePhotoPath + '3.jpg'},
    {id: 4, src: this.basePhotoPath + '4.jpg'},
    {id: 5, src: this.basePhotoPath + '5.jpg'},
    {id: 6, src: this.basePhotoPath + '6.jpg'},
    {id: 7, src: this.basePhotoPath + '7.jpg'},
    {id: 8, src: this.basePhotoPath + '8.jpg'},
    {id: 9, src: this.basePhotoPath + '9.jpg'},
    {id: 10, src: this.basePhotoPath + '10.jpg'},
  ];

}
