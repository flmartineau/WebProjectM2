import { TestBed } from '@angular/core/testing';

import { ContactService } from './agenda.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContactService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [AgendaService]
  }));

  it('should be created', () => {
    const service: AgendaService = TestBed.get(AgendaService);
    expect(service).toBeTruthy();
  });
});
