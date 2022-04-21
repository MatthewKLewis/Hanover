import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfMapComponent } from './shelf-map.component';

describe('ShelfMapComponent', () => {
  let component: ShelfMapComponent;
  let fixture: ComponentFixture<ShelfMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShelfMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
