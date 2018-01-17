(function IIFE (Game) {
  var squares = document.querySelectorAll('.square')
  var turn1 = document.querySelector('.player1')
  var turn2 = document.querySelector('.player2')
  var player1 = document.querySelector('.player1 .score')
  var player2 = document.querySelector('.player2 .score')

  function updateBoard (index, symbol) {
    squares[index].querySelector('div').classList.add(symbol)
  }

  function highlightPlayer (playerNumber) {
    if (playerNumber === 1) {
      turn1.classList.remove('turn')
      turn2.classList.add('turn')
    } else {
      turn2.classList.remove('turn')
      turn1.classList.add('turn')
    }
  }

  function updatePlayerScores (scores) {
    player1.innerHTML = scores[0]
    player2.innerHTML = scores[1]
  }

  function blink (indexes) {
    for (var i = 3; i--;) {
      squares[indexes[i]].querySelector('div').classList.add('blink')
    }
  }

  function squareClicked (index) {
    if (Game.isGameOver()) {
      return
    }

    Game.setSquare(index)

    let state = Game.getState()
    let isWin = (state.winningCombo.length > 0)

    updateBoard(index, state.board[index])
    highlightPlayer(parseInt(state.player) + 1)

    if (isWin) {
      updatePlayerScores(state.playerScores)
      blink(state.winningCombo)
      // Game.reset()
    }
  }

  squares.forEach(function (el, index) {  
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
      state.player = 0
    }

    function setSquare (index) {
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
      return Object.assign({}, state)
    }

    return {
      setSquare: setSquare,
      getState: getState,
      reset: reset,
      isGameOver: function () { return state.gameOver }
    }
  })()
)
