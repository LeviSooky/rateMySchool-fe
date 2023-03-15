import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFailedComponent } from './resource-failed.component';

describe('ResourceFailedComponent', () => {
  let component: ResourceFailedComponent;
  let fixture: ComponentFixture<ResourceFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceFailedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
