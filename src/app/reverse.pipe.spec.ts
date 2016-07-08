import {
  it,
  describe,
  expect,
  inject,
  beforeEachProviders
} from '@angular/core/testing';
import { Reverse } from './reverse.pipe';

describe('Reverse Pipe', () => {
  beforeEachProviders(() => [Reverse]);

  it('should transform the input', inject([Reverse], (pipe: Reverse) => {
      expect(pipe.transform(true)).toBe(null);
  }));
});
