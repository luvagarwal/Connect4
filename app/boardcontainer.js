import PIXI from 'pixi.js';
import { Board, BoardConfig } from './board.js';


export default class BoardContainer extends PIXI.Container {

  constructor(...args) {
     super(...args);
     this.board = new Board();
     this.padding = BoardConfig.padding;
     this.x = this.padding;
     this.y = 100;
     this.animPiece = false;
     this.player = 'player'; // 'player' or 'bot'
     this.drawInitBoard();
  }

  getNewPiece(row, col, color, setName=true) {
    // return a new piece at row, col with color as `color`
    const r = BoardConfig.radius, g = BoardConfig.gap;
    const piece = new PIXI.Graphics();
    if(setName) piece.name = `${row}${col}`;
    piece.interactive = true;
    piece.lineStyle(2, color);
    piece.beginFill(color, 1);
    piece.drawCircle(col*2*r + r + col*g, row*2*r + r + row*g, r);
    piece.endFill();
    return piece;
  }

  drawInitBoard() {
    // add initial empty board
    let piece;
    for(let row=0; row<BoardConfig.size; row++) {
      for(let col=0; col<BoardConfig.size; col++) {
        piece = this.getNewPiece(row, col, this.board.pieces[row][col]);
        piece.on('mousedown', this.onDownHandler(col));
        piece.on('touchstart', this.onDownHandler(col));
        this.addChild(piece);
      }
    }
  }

  onDownHandler(col) {
    const self = this;
    return function() {
      self.pieceAnimInitialize(col);
    }
  }

  pieceAnimInitialize(col) {
    // Initialize the animation of new piece thrown by player
    const color = BoardConfig.colors[this.player];
    if(this.animPiece) return;

    const r = BoardConfig.radius, g = BoardConfig.gap;
    const piece = this.getNewPiece(0, col, color, false);
    this.addChild(piece);
    const row = this.board.getNextInCol(col);
    const totalDis = (2*r+g)*row;
    let lastFrame = +new Date;
    let vel = 0;
    this.animDetails = {
      piece,
      row,
      col,
      totalDis,
      vel,
      'mu': 0.5, // coeff of restitution
      'last': lastFrame,
      color
    }
    this.animPiece = true;
    this.animatePiece();
  }

  animatePiece() {
    if(!this.animPiece) return;

    const aD = this.animDetails, eps = 1;

    if(aD.piece.y == aD.totalDis && aD.vel < 0 && Math.abs(aD.vel) < eps) {
      // damp the motion of piece
      this.animPiece = false;
      this.removeChild(this.getChildByName(`${aD.row}${aD.col}`));
      this.board.pieces[aD.row][aD.col] = aD.color;
      if(this.board.isGameFinished(aD.row, aD.col, aD.color)){
        return this.player;
      }
      if(this.player == 'player') {
        const col = Math.ceil(Math.random()*6) // random selection
        this.player = 'bot';
        this.pieceAnimInitialize(col);
      }
      else
        this.player = 'player';
      return false;
    }

    // change dynamics of piece
    let now = +new Date;
    aD.vel += 1;
    aD.piece.y += aD.vel*(now-aD.last)/16;
    if(aD.piece.y > aD.totalDis) {
      aD.piece.y = aD.totalDis;
      aD.vel *= -aD.mu;
    }
    aD.last = now;
    return false;
  }

  resetGame() {
    for(let i=0; i<this.children.length; i++)
      this.removeChild(this.children[i]);
    this.board = new Board();
    this.player = 'player';
    this.drawInitBoard();
  }

// End class
}
