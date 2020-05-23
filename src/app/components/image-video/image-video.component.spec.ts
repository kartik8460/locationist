import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageVideoComponent } from './image-video.component';

describe('ImageVideoComponent', () => {
  let component: ImageVideoComponent;
  let fixture: ComponentFixture<ImageVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
