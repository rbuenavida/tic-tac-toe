'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

(function IIFE(Game) {
  var ui = {
    squares: document.querySelectorAll('.square'),
    turn1: document.querySelector('.player1'),
    turn2: document.querySelector('.player2'),
    player1: document.querySelector('.player1 .score'),
    player2: document.querySelector('.player2 .score')
  };

  function updateBoard(index, className) {
    if (className) {
      ui.squares[index].querySelector('div').classList.add(className);
    } else {
      ui.squares[index].querySelector('div').className = '';
    }
  }

  function highlightPlayer(playerNumber) {
    if (parseInt(playerNumber) + 1 === 1) {
      ui.turn1.classList.remove('turn');
      ui.turn2.classList.add('turn');
    } else {
      ui.turn2.classList.remove('turn');
      ui.turn1.classList.add('turn');
    }
  }

  function updatePlayerScores(scores) {
    ui.player1.innerHTML = scores[0];
    ui.player2.innerHTML = scores[1];
  }

  function blink(indexes) {
    for (var i = 3; i--;) {
      updateBoard(indexes[i], 'blink');
    }
  }

  function reset() {
    Game.reset();
    var state = Game.getState();
    for (var i = state.board.length; i--;) {
      updateBoard(i);
    }
    highlightPlayer(state.player);
  }

  function squareClicked(index) {
    if (Game.isGameOver()) {
      reset();
      return;
    }

    Game.markSquare(index);

    var state = Game.getState();
    var isWin = state.winningCombo.length > 0;

    updateBoard(index, state.board[index]);
    highlightPlayer(state.player);

    if (isWin) {
      updatePlayerScores(state.playerScores);
      blink(state.winningCombo);
    }
  }

  ui.squares.forEach(function (el, index) {
    el.addEventListener('click', function (e) {
      e.preventDefault();squareClicked(index);
    });
  });
})(function () {
  'use strict';

  var winningCombos = [
  // horizontal
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  // vertical
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  // diagonal
  [0, 4, 8], [2, 4, 6]];

  var state = {
    board: Array(9),
    player: 0,
    players: ['x', 'o'],
    playerScores: [0, 0],
    gameOver: false,
    winningCombo: []
  };

  function reset() {
    state.board = Array(9);
    state.gameOver = false;
  }

  function markSquare(index) {
    var symbol = state.players[state.player];

    if (state.board[index]) return;

    state.board[index] = symbol;
    state.winningCombo = getPlayerWinningCombo(symbol);

    var isWin = state.winningCombo.length > 0;

    state.gameOver = isWin || isBoardFull();
    state.playerScores[state.player] += isWin ? 1 : 0;

    if (state.gameOver) return;

    state.player = +!state.player;
  }

  function isBoardFull() {
    for (var i = 0; i < state.board.length; i++) {
      if (!state.board[i]) return false;
    }
    return true;
  }

  function getPlayerWinningCombo(symbol) {
    for (var ps = 0; ps < winningCombos.length; ps++) {
      var _winningCombos$ps$map = winningCombos[ps].map(function (index) {
        return state.board[index];
      }),
          _winningCombos$ps$map2 = _slicedToArray(_winningCombos$ps$map, 3),
          first = _winningCombos$ps$map2[0],
          second = _winningCombos$ps$map2[1],
          third = _winningCombos$ps$map2[2];

      if (first === symbol && second === symbol && third === symbol) {
        return winningCombos[ps];
      }
    }
    return [];
  }

  function getState() {
    var currentState = _extends({}, state);
    return currentState;
  }

  return {
    markSquare: markSquare,
    getState: getState,
    reset: reset,
    isGameOver: function isGameOver() {
      return state.gameOver;
    }
  };
}());
