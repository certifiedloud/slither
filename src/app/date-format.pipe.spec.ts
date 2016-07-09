import {
  it,
  describe,
  expect,
  inject,
  beforeEachProviders
} from '@angular/core/testing';
import { DateFormat } from './date-format.pipe';

describe('DateFormat Pipe', () => {
  beforeEachProviders(() => [DateFormat]);

  it('should transform the input', inject([DateFormat], (pipe: DateFormat) => {
      expect(pipe.transform(true)).toBe(null);
  }));
});
