import { TestBed } from '@angular/core/testing';

import { NgxDrawService } from './ngx-draw.service';

describe('NgxDrawService', () => {
  let service: NgxDrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxDrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
