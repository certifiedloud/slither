import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { TitleCase } from './title-case.pipe';

@Component({
  moduleId: module.id,
  selector: 'slither-app',
  templateUrl: 'slither.component.html',
  styleUrls: ['slither.component.css'],
  pipes: [TitleCase]
})
export class SlitherAppComponent {
  title = 'slither works!';

  scores: FirebaseListObservable<any[]>;

  topTen = [];
  thisWeek = [];
  personalTop = [];

  fname = '';
  uname = '';
  server = ''; //206.191.154.41:444

  playGame() {
    window.open(`http://slither.io/#name=${this.uname},svn=${this.server},player=${this.fname}`, '_blank');
  }

  constructor(af: AngularFire) {
    this.scores = af.database.list('scores');

    this.scores.forEach(element => {
      var top = element.slice();

      this.thisWeek = top.filter((item) => {
        return item.date > new Date().getDate() - 7;
      }).sort((a, b) => b.score - a.score).slice(0, 5);

      this.topTen = top.slice().sort((a, b) => b.score - a.score).slice(0, 10);

      // TODO: sort personal bests here
      // this.topTen.slice().forEach(topEl => {
      //   for (var i = 0, len = top.slice().length; i < len; i++) {
      //     if (top.slice()[i].player !== topEl.player) {
      //       this.personalTop.push(topEl);
      //     }
      //   }
      // });
    });
  }
}
