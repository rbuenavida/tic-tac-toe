(function IIFE (Game) {
  const ui = {
    squares: document.querySelectorAll('.square'),
    turn1: document.querySelector('.player1'),
    turn2: document.querySelector('.player2'),
    player1: document.querySelector('.player1 .score'),
    player2: document.querySelector('.player2 .score')
  }

  const playerClassNames = ['x', 'o']
 
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

  function updatePlayerScores (players) {
    ui.player1.innerHTML = players[0].score
    ui.player2.innerHTML = players[1].score
  }

  function blink (indexes) {
    for (var i = 3; i--;) {
      updateBoard(indexes[i], 'blink')
    }
  }

  function updateUI (state) {
    let isWin = (state.winningCombo.length > 0)

    const classes = state.board.map((val, index) =>
      [index, (val >= 0) ? playerClassNames[val] : null]
    )

    for (const v of classes) {
      updateBoard(v[0], v[1])
    }

    highlightPlayer(state.activePlayer)

    if (isWin) {
      updatePlayerScores(state.players)
      blink(state.winningCombo)
    }
  }

  function squareClicked (index) {
    const gameState = Game.markSquare(index)
    updateUI(gameState)
  }

  function init () {
    ui.squares.forEach(function (el, index) {
      el.addEventListener('click', function (e) { e.preventDefault(); squareClicked(index) })
    })
    updateUI(Game.getState())
  }

  init()
})(
  (function () {
    'use strict'
    const winningCombos = [
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

    let state = {
      board: Array(9).fill(null), // could remove but easier like this
      players: [{score: 0}, {score: 0}],
      activePlayer: 0,
      winningCombo: []
    }

    function reset () {
      state.board = Array(9).fill(null)
      // keep winner's turn
      state.activePlayer = (state.winningCombo.length > 0) ? state.activePlayer : 0
      state.winningCombo = []
    }

    function isBoardFull () {
      const amount = state.board.reduce(
        (sum, value) => sum + ((value !== null) ? 1 : 0), 0
      )
      return (amount === 9)
    }

    function isGameOver () {
      return (isBoardFull() || (state.winningCombo.length > 0))
    }

    function mark (index) {
      if (isGameOver()) {
        reset()
        return getState()
      }

      if (state.board[index] === null) {
        state.board[index] = state.activePlayer

        const winningCombo = findWinningCombo(state.activePlayer)

        if (winningCombo.length > 0) {
          state.players[state.activePlayer].score += 1
          state.winningCombo = winningCombo[0]
        } else {
          state.activePlayer = +!state.activePlayer
        }
      }

      return getState()
    }

    function getIndexesMarked (playerNumber) {
      return state.board.reduce((ar, element, index) => {
        if (element === playerNumber) { ar.push(index) }
        return ar
      }, [])
    }

    function findWinningCombo (playerNumber) {
      const indexesSelected = getIndexesMarked(playerNumber)

      return winningCombos.filter(combo =>
        (indexesSelected.indexOf(combo[0]) >= 0) &&
        (indexesSelected.indexOf(combo[1]) >= 0) &&
        (indexesSelected.indexOf(combo[2]) >= 0)
      )
    }

    function getState () {
      return { ...state } // copy of state
    }

    return {
      markSquare: mark,
      getState: getState,
      isGameOver: isGameOver
    }
  })()
)
