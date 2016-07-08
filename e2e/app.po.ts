export class SlitherPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('slither-app h1')).getText();
  }
}
