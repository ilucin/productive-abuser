export default function connectThree(p1, p2) {
  const g = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const sign = {0: ' '};
  sign[p1] = 'X';
  sign[p2] = 'O';

  let currentPlayer = p1;
  let winner;

  function isPlayerWinner(p) {
    return (g[0][0] === p && g[0][1] === p && g[0][2] === p) || (g[1][0] === p && g[1][1] === p && g[1][2] === p) || (g[2][0] === p && g[2][1] === p && g[2][2] === p) || (g[0][0] === p && g[1][0] === p && g[2][0] === p) || (g[0][1] === p && g[1][1] === p && g[2][1] === p) || (g[0][2] === p && g[1][2] === p && g[2][2] === p) || (g[0][0] === p && g[1][1] === p && g[2][2] === p) || (g[0][2] === p && g[1][1] === p && g[2][0] === p);
  }

  return function play(p, y, x) {
    if (g[x][y] === 0 && p === currentPlayer && !winner) {
      g[x][y] = p;
      currentPlayer = (p === p1 ? p2 : p1);
    }

    winner = isPlayerWinner(p1) ? p1 : (isPlayerWinner(p2) && p2);
    if (winner) {
      return `Winner is ${winner}`;
    } else if (!g.reduce((hasZero, row) => hasZero || row.includes(0), false)) {
      return 'Nobody wins';
    }

    return `-------\n${g.map((row) => (`|${row.map((cell) => sign[cell]).join('|')}|`)).join('\n')}\n-------`;
  };
}
