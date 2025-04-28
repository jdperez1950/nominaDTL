import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InformeService } from './InformeService';

describe('InformeService', () => {
  let service: InformeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InformeService]
    });
    service = TestBed.inject(InformeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call findAll', () => {
    // TODO: Implement test for findAll
  });

  it('should call findById', () => {
    // TODO: Implement test for findById
  });

  it('should call save', () => {
    // TODO: Implement test for save
  });

  it('should call update', () => {
    // TODO: Implement test for update
  });

  it('should call deleteById', () => {
    // TODO: Implement test for deleteById
  });

  it('should call uploadFiles', () => {
    // TODO: Implement test for uploadFiles
  });

});
