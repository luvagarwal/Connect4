export const BoardConfig = {
  'size': 7,
  'padding': 100,
  'radius': 40,
  'gap': 4, // gap b/w pieces
  'colors': {
    'default': 0xFFFFFF,
    'player' : 0x663167,
    'bot'   : 0x139939,
  }
}

export class Board {
  constructor() {
    this.pieces = this.initialBoard();
  }

  initialBoard() {
    let pieces = [];
    for(let row=0; row<BoardConfig.size; row++){
      let tmpRow = [];
      for(let col=0; col<BoardConfig.size; col++)
        tmpRow.push(BoardConfig.colors.default);
      pieces.push(tmpRow);
    }
     return pieces;   
  }

  getNextInCol(col) {
    for(let row=BoardConfig.size-1; row>=0; row--)
      if(this.isAvailable(row, col))
        return row;
    return false;
  }

  isAvailable(row, col) {
    if(this.pieces[row][col] != BoardConfig.colors.default)
      return false;
    return true;
  }

  isGameFinished(row, col, color) {
    // takes last drawn piece as input
    return this.isGameFinishedHorizontally(row, col, color) |
           this.isGameFinishedVertically(row, col, color)/* |
           this.isGameFinishedDiagonallyTopBottom(row, col, color) |
           this.isGameFinishedDiagonallyBottomTop(col, row, color)*/;
  }

  /*isGameFinishedHelper(start, end, color) {
    let slope = (end.y - start.y)/(end.x - start.x);
    // set start to one having smaller x coordinate
    if(start.x > end.x) {
      let tmp = start;
      start = end; end = tmp;
    }
    let cntSameColor = 0;
    for(let x=start.x; x<=end.x; x++) {
      let y = slope*(x-start.x) + start.y;
      if(this.pieces[y] == undefined) {console.log(y)};
      if(this.pieces[y][x] != color)
        cntSameColor = 0;
      else
        cntSameColor++;

      if(cntSameColor == 4) return true;
    }
  }

  isGameFinishedHorizontally(row, col, color) {
    return false;
  }
  isGameFinishedVertically(row, col, color) {
    let start = { 'x': Math.max(col-3, 0), 'y': row };
    let end = { 'x': Math.min(col+3, BoardConfig.size-1), 'y': row };
    return this.isGameFinishedHelper(start, end, color);
  }

  isGameFinishedDiagonallyTopBottom(row, col, color) {
    let minS = Math.min(Math.max(col-3, 0), Math.max(row-3, 0));
    let minE = Math.min(Math.min(col+3, BoardConfig.size-1), Math.min(row+3, BoardConfig.size-1));
    let start = { 'x': minS, 'y': minS };
    let end = { 'x': minE, 'y': minE };
    return this.isGameFinishedHelper(start, end, color);
  }

  isGameFinishedDiagonallyBottomTop(row, col, color) {
    let minS = 
    let start = { 'x': Math.max(col-3, 0), 'y': Math.min(row+3, BoardConfig.size-1) };
    let end = { 'x': Math.min(col+3, BoardConfig.size-1), 'y': Math.max(row-3, 0) };
    return this.isGameFinishedHelper(start, end, color);
  }*/

  isGameFinishedDiagonallyTopBottom(row, col, color) {
    let startC = Math.max(col-3, 0);
    let endC = Math.min(col+3, BoardConfig.size-1);
    let startR = Math.max(row-3, 0);
    let endR = Math.min(row+3, BoardConfig.size-1);
    let cntSameColor = 0;
    for(let i=startC, j=startR; i<=endC, j<=endR; i++, j++) {
      if(this.pieces[j][i] !== color)
        cntSameColor = 0;
      else
        cntSameColor++;

      if(cntSameColor == 4) return true;
    }
    return false;
  }

  isGameFinishedHorizontally(row, col, color, flip=false) {
    let start = Math.max(col-3, 0);
    let end = Math.min(col+3, BoardConfig.size-1);
    let cntSameColor = 0;
    for(let i=start; i <= end; i++) {
      let c = (flip)?this.pieces[i][row]:this.pieces[row][i];
      if(c !== color)
        cntSameColor = 0;
      else
        cntSameColor++;

      if(cntSameColor == 4) return true;
    }
    return false;
  }

  isGameFinishedVertically(row, col, color) {
    return this.isGameFinishedHorizontally(col, row, color, true);
  }

// End class
}