import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { SlitherAppComponent } from '../app/slither.component';

beforeEachProviders(() => [SlitherAppComponent]);

describe('App: Slither', () => {
  it('should create the app',
      inject([SlitherAppComponent], (app: SlitherAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'slither works!\'',
      inject([SlitherAppComponent], (app: SlitherAppComponent) => {
    expect(app.title).toEqual('slither works!');
  }));
});
