import { TestBed } from '@angular/core/testing';

import { DiscordService } from './discord.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DiscordService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [DiscordService]
  }));

  it('should be created', () => {
    const service: DiscordService = TestBed.get(DiscordService);
    expect(service).toBeTruthy();
  });
});
