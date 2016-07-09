import {
  it,
  describe,
  expect,
  inject,
  beforeEachProviders
} from '@angular/core/testing';
import { TitleCase } from './title-case.pipe';

describe('TitleCase Pipe', () => {
  beforeEachProviders(() => [TitleCase]);

  it('should transform the input', inject([TitleCase], (pipe: TitleCase) => {
      expect(pipe.transform(true)).toBe(null);
  }));
});
