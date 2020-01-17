import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloComponent } from './trello.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('TrelloComponent', () => {
  let component: TrelloComponent;
  let fixture: ComponentFixture<TrelloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrelloComponent ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrelloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
