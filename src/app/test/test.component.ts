import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  stars = [1,2,3,4,5];
  hovered: number;
  rating: number;

  constructor() { }

  ngOnInit() {
  }

  rated(star: number){
    this.rating = star;
  }
  onAddImage(event: any){
    const file = event.target.files[0];
    const _url = URL.createObjectURL(file);
    setTimeout(()=> {
      URL.revokeObjectURL(_url);
    },5000)
  }
}
