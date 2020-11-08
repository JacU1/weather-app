import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherCompComponent } from './weather-comp.component';

describe('WeatherCompComponent', () => {
  let component: WeatherCompComponent;
  let fixture: ComponentFixture<WeatherCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeatherCompComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
