import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelSelectionComponent } from './level-selection';

describe('LevelSelection', () => {
  let component: LevelSelectionComponent;
  let fixture: ComponentFixture<LevelSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelSelectionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LevelSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
