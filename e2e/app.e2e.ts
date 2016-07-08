import { SlitherPage } from './app.po';

describe('slither App', function() {
  let page: SlitherPage;

  beforeEach(() => {
    page = new SlitherPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('slither works!');
  });
});
