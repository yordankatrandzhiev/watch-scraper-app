import { TestBed } from '@angular/core/testing';

import { ScrapingServiceService } from './scraping-service.service';

describe('ScrapingServiceService', () => {
  let service: ScrapingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrapingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
