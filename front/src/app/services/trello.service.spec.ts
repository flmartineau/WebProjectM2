import { TestBed } from '@angular/core/testing';

import { TrelloService } from './trello.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TrelloService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [TrelloService]
  }));

  it('should be created', () => {
    const service: TrelloService = TestBed.get(TrelloService);
    expect(service).toBeTruthy();
  });
});
