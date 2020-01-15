import { TestBed } from '@angular/core/testing';

import { AgendaService } from './agenda.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgendaService', () => {
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
