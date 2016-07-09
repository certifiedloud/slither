import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { TitleCase } from './title-case.pipe';
import { DateFormat } from './date-format.pipe';

@Component({
  moduleId: module.id,
  selector: 'slither-app',
  templateUrl: 'slither.component.html',
  styleUrls: ['slither.component.css'],
  pipes: [TitleCase, DateFormat]
})
export class SlitherAppComponent {
  title = 'slither works!';

  scores: FirebaseListObservable<any[]>;

  topTen = [];
  thisWeek = [];
  personalTop = [];

  fname = '';
  uname = '';
  server = '';

  playGame() {
    localStorage.setItem('fullName', this.fname);
    window.open(`http://slither.io/#name=${this.uname},svn=${this.server},player=${this.fname}`, '_blank');
  }

  constructor(af: AngularFire) {
    this.scores = af.database.list('scores');

    if (localStorage.getItem('fullName')) {
      this.fname = localStorage.getItem('fullName');
    }

    this.scores.forEach(element => {
      var top = element.slice();
      var names = [];

      // All time top 10
      this.topTen = top.slice().sort((a, b) => b.score - a.score).slice(0, 10);

      // Weekly top 5
      this.thisWeek = top.filter((item) => {
        return item.date > new Date().getDate() - 7;
      }).sort((a, b) => b.score - a.score).slice(0, 5);

      // Personal bests
      top.forEach(topEl => {
        var alreadyExists = false;

        for (var i = 0; i < names.length; i++) {
          if (names[i].owner === topEl.owner) {
            alreadyExists = true;

            if (names[i].score < topEl.score) {
              names.splice(i, 1);
              alreadyExists = false;
            }
            break;
          }
        }

        if (!alreadyExists && topEl.owner.length > 0) {
          names.push(topEl);
        }
      });

      this.personalTop = names;
    });
  }
}
