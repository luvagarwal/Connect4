export const BoardConfig = {
  'size': 7, // board size
  'padding': 100,
  'radius': 40, // piece radius
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
           this.isGameFinishedVertically(row, col, color) |
           this.isGameFinishedDiagonallyTopBottom(row, col, color) |
           this.isGameFinishedDiagonallyBottomTop(row, col, color);
  }

  isGameFinishedDiagonallyTopBottom(row, col, color) {
    let tmp = Math.min(row, col, 3)
    let startX = col - tmp;
    let startY = row - tmp;
    tmp = Math.min(BoardConfig.size-1-row, BoardConfig.size-1-col, 3);
    let endX = col + tmp;
    let endY = row + tmp;
    let cntSameColor = 0;
    for(let i=startX, j=startY; i<=endX, j<=endY; i++, j++) {
      if(this.pieces[j][i] !== color)
        cntSameColor = 0;
      else
        cntSameColor++;

      if(cntSameColor == 4) return true;
    }
    return false;
  }

  isGameFinishedDiagonallyBottomTop(row, col, color) {
    let tmp = Math.min(col, BoardConfig.size-1-row, 3);
    let startX = col - tmp;
    let startY = row + tmp;
    tmp = Math.min(BoardConfig.size-1-col, row, 3);
    let endX = col + tmp;
    let endY = row - tmp;
    let cntSameColor = 0;
    for(let i=startX, j=startY; i<=endX, j>=endY; i++, j--){
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