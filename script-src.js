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
    console.log("adding point")
    var newloc = document.createElement('div');
    newloc.id = 'compass_' + snake.nk.split(' ')[0];
    newloc.className = "snakepos";
    newloc.style.position = "absolute";
    newloc.style.left = "0px";
    newloc.style.top = "0px";
    newloc.style.width = "4px";
    newloc.style.height = "4px";
    newloc.style.backgroundColor = window.snake.csw;
    newloc.style.opacity = 1;
    newloc.style.zIndex = 13;
    loch.appendChild(newloc);

    compass.push({ point: newloc, id: snake.nk.split(' ')[0] });
  }

  /**
   * Calculate offset and update the compass point so you can find your buddies
   */
  function updateCompassPoint(snake) {
    var point = document.querySelector('#compass_' + snake.nk.split(' ')[0]);
    if (point) {
      point.style.left = Math.round(52 + 40 * (snake.xx - grd) / grd - 7) + "px";
      point.style.top = Math.round(52 + 40 * (snake.yy - grd) / grd - 7) + "px";
      point.style.backgroundColor = window.snake.csw;
      if (snake.dead) {
        point.style.backgroundColor = "#FF0000";
      }
    } else {
      return;
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
        console.log("created new snake")

        if (newSnake.room === serverNum && newSnake.nk !== window.snake.nk) {
          console.log("point doesn't exist")
          var pointExists = false;

          for (var point in compass) {
            if (compass[point].id === newSnake.nk.split(' ')[0]) {
              pointExists = true;
              console.log("point exists")
              break;
            }
          }

          if (!pointExists) {
            addCompassPoint(newSnake);
          }
          updateCompassPoint(newSnake);
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
