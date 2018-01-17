(function IIFE (Game) {
  var ui = {
    squares: document.querySelectorAll('.square'),
    turn1: document.querySelector('.player1'),
    turn2: document.querySelector('.player2'),
    player1: document.querySelector('.player1 .score'),
    player2: document.querySelector('.player2 .score')
  }

  function updateBoard (index, className) {
    if (className) {
      ui.squares[index].querySelector('div').classList.add(className)
    } else {
      ui.squares[index].querySelector('div').className = ''
    }
  }

  function highlightPlayer (playerNumber) {
    if ((parseInt(playerNumber) + 1) === 1) {
      ui.turn1.classList.remove('turn')
      ui.turn2.classList.add('turn')
    } else {
      ui.turn2.classList.remove('turn')
      ui.turn1.classList.add('turn')
    }
  }

  function updatePlayerScores (scores) {
    ui.player1.innerHTML = scores[0]
    ui.player2.innerHTML = scores[1]
  }

  function blink (indexes) {
    for (var i = 3; i--;) {
      updateBoard(indexes[i], 'blink')
    }
  }

  function reset () {
    Game.reset()
    let state = Game.getState()
    for (var i = state.board.length; i--;) {
      updateBoard(i)
    }
    highlightPlayer(state.player)
  }

  function squareClicked (index) {
    if (Game.isGameOver()) {
      reset()
      return
    }

    Game.markSquare(index)

    let state = Game.getState()
    let isWin = (state.winningCombo.length > 0)

    updateBoard(index, state.board[index])
    highlightPlayer(state.player)

    if (isWin) {
      updatePlayerScores(state.playerScores)
      blink(state.winningCombo)
    }
  }

  ui.squares.forEach(function (el, index) {
    el.addEventListener('click', function (e) { e.preventDefault(); squareClicked(index) })
  })
})(
  (function () {
    var winningCombos = [
      // horizontal
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // vertical
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // diagonal
      [0, 4, 8],
      [2, 4, 6]
    ]

    var state = {
      board: Array(9),
      player: 0,
      players: ['x', 'o'],
      playerScores: [0, 0],
      gameOver: false,
      winningCombo: []
    }

    // side effects
    function reset () {
      state.board = Array(9)
      state.gameOver = false
    }

    function markSquare (index) {
      let symbol = state.players[state.player]

      if (state.board[index]) return

      state.board[index] = symbol
      state.winningCombo = getPlayerWinningCombo(symbol)

      let isWin = (state.winningCombo.length > 0)

      state.gameOver = (isWin || isBoardFull())
      state.playerScores[state.player] += isWin ? 1 : 0

      if (state.gameOver) return

      state.player = +!state.player
    }

    function isBoardFull () {
      for (var i = 0; i < state.board.length; i++) {
        if (!state.board[i]) return false
      }
      return true
    }

    function getPlayerWinningCombo (symbol) {
      for (let ps = 0; ps < winningCombos.length; ps++) {
        let first = state.board[winningCombos[ps][0]]
        let second = state.board[winningCombos[ps][1]]
        let third = state.board[winningCombos[ps][2]]
        if (first === symbol && second === symbol && third === symbol) {
          return winningCombos[ps]
        }
      }
      return []
    }

    function getState () {
      let currentState = Object.assign({}, state)
      return currentState
    }

    return {
      markSquare: markSquare,
      getState: getState,
      reset: reset,
      isGameOver: function () { return state.gameOver }
    }
  })()
)
