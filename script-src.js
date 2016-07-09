(function() {
  'use strict';

  var config = {
    apiKey: "AIzaSyBOZlu3pZWL8LYL0_IVYBcLKAYXVOnOvis",
    authDomain: "igslither.firebaseapp.com",
    databaseURL: "https://igslither.firebaseio.com",
    storageBucket: "igslither.appspot.com"
  };

  var compass = [];
  var hash = window.location.hash.substring(1);
  var nickname = '';
  var serverIP = '';
  var player = '';
  var serverNum = 0;
  var retry = 0;

  firebase.initializeApp(config);
  var snakesRef = firebase.database().ref('snakes');

  if (hash) {
    nickname = hash.split(',')[0].split('=')[1];
    serverNum = hash.split(',')[1].split('=')[1];
    player = hash.split(',')[2].split('=')[1];
  }

  function connectionStatus() {
    if (!window.connecting || retry == 10) {
      window.forcing = false;
      retry = 0;
      return;
    }
    retry++;
    setTimeout(connectionStatus, 1000);
  }

  function quickConnect(ip) {
    var a = ip.split(':')[0];
    var b = ip.split(':')[1];

    sos = [];
    forcing = true;
    bso = {};
    bso.ip = a;
    bso.po = b;
    bso.ac = 999;
    sos.push(bso);

    window.connect();
  }

  /**
   * We save the whole `snake` object in Firebase (only the most recent copy), so that we can coordinate positions.
   */
  function savePosition() {
    if (window.snake.nk.length > 0) {
      firebase.database().ref('snakes/' + window.snake.nk.split(' ')[0]).set({
        snake: {
          xx: window.snake.xx,
          yy: window.snake.yy,
          nk: window.snake.nk,
          room: serverNum,
          csw: window.snake.csw
        }
      });
    }
  }

  /**
   * Taken from the game code - calculates your length
   */
  function calculateScore() {
    return (Math.floor(15 * (fpsls[snake.sct] + snake.fam / fmlts[snake.sct] - 1) - 5) / 1);
  }

  /**
   * Add a new compass point for each new player in your posse
   */
  function addCompassPoint(snake) {
    var newPoint = document.createElement('div');

    newPoint.id = 'compass_' + snake.nk.split(' ')[0];
    newPoint.className = 'compassPoint';
    newPoint.style.position = 'absolute';
    newPoint.style.top = '50px';
    newPoint.style.left = ((compass.length + 1) * 50) + 'px';
    newPoint.style.zIndex = '99998';
    newPoint.style.webkitTransition = 'all 0.5s ease-in-out';
    newPoint.style.transition = 'all 0.5s ease-in-out';
    newPoint.style.opacity = '1.0';
    newPoint.innerHTML = '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/><path d="M0-.25h24v24H0z" fill="none"/></svg>';
    newPoint.fill = '#ffffff';

    document.getElementsByTagName('body')[0].appendChild(newPoint);
    compass.push({ point: newPoint, id: snake.nk.split(' ')[0] });
  }

  /**
   * Calculate offset and update the compass point so you can find your buddies
   */
  function updateCompassPoint(deg, snake) {
    var point = document.querySelector('#compass_' + snake.nk.split(' ')[0]);

    if (point) {
      point.style.webkitTransform = 'rotate(' + deg + 'deg)';
      point.style.webkitTransform = 'rotate(' + deg + 'deg)';
      point.style.fill = snake.csw;
      point.style.opacity = '1.0';
    } else {
      return;
    }

    if (snake.dead) {
      point.style.opacity = '.2';
    }
  }

  /**
   * Once you die, your score is saved so that we can track high scores.
   */
  function saveScore() {
    firebase.database().ref('scores').push({
      score: calculateScore(),
      player: window.snake.nk,
      owner: player.toLowerCase(),
      date: Date.now()
    });
  }

  /**
   * Query Firebase for other snakes in the clan and report their positions.
   * Since this is a listener, and Firebase is smart, we don't have to worry
   * about reinitilizing it too many times.
   */
  function findFriends() {
    snakesRef.once('value').then(function(data) {
      for (var i in data.val()) {
        var newSnake = data.val()[i].snake;

        if (newSnake.room === serverNum && newSnake.nk !== window.snake.nk) {
          var pointExists = false;

          for (var point in compass) {
            if (compass[point].id === newSnake.nk.split(' ')[0]) {
              pointExists = true;
              break;
            }
          }

          if (!pointExists) {
            addCompassPoint(newSnake);
          }

          var newX = newSnake.xx;
          var newY = newSnake.yy;

          var posX = window.snake.xx;
          var posY = window.snake.yy;

          var angle = Math.atan2(newY - posY, newX - posX) * 180 / Math.PI;

          updateCompassPoint(angle, newSnake);
        }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function(event) {
    snakesRef.remove();

    if (hash) {
      setTimeout(function() {
        document.getElementById("nick").value = nickname;
        quickConnect(sos[serverNum].ip + ":" + sos[serverNum].po);
        connect();
      }, 1000);
    }

    /**
     * Until we can find a more elegant way to monitor the game's state, this works fine.
     */
    setInterval(function() {
      if (window.snake) {
        savePosition();

        if (!window.snake.dead) {
          findFriends();
        }

        if (window.snake.dead) {
          // TODO: empty compass + DOM
          saveScore();
        }
      }
    }, 5000);
  });
})();
