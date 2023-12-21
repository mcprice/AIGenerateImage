import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiGenerateImageComponent } from './ai-generate-image.component';

describe('AiGenerateImageComponent', () => {
  let component: AiGenerateImageComponent;
  let fixture: ComponentFixture<AiGenerateImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiGenerateImageComponent]
    });
    fixture = TestBed.createComponent(AiGenerateImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
