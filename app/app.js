import './index.html';
import PIXI from 'pixi.js';
import BoardContainer from './boardcontainer.js';

const GAME_WIDTH = 800, GAME_HEIGHT = 700;
const RATIO = GAME_WIDTH/1301;
const renderer = PIXI.autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, {
  antialiasing: false,
  transparent: false,
  resolution: window.devicePixelRatio,
  autoResize: true,
  backgroundColor: 0x999999
});

document.body.appendChild(renderer.view);


class Stage extends PIXI.Container {
  constructor(...args) {
    super(...args);
    this.interactive = true;
    let board = new BoardContainer();
    this.board = board;
    this.addChild(board);
    this.addHeader();
  }

  animate() {
    return this.board.animatePiece();
  }

  askForReset(winner) {
    winner = (winner == 'bot')?'I win!':'You win!';
    let restartContainer = new PIXI.Container(GAME_WIDTH, GAME_HEIGHT);
    restartContainer.name = 'restartContainer';
    restartContainer.interactive = true;

    let layer = new PIXI.Graphics();
    layer.beginFill(0x812390, 1);
    layer.drawRect(0, 0, renderer.width, renderer.height);
    layer.alpha = 0.8;
    restartContainer.addChild(layer);

    let text = new PIXI.Text(`${winner} Restart Game?`, {
      font : 'bold 80px Courier',
      fill : '#889199',
      stroke : '#4a1850',
      strokeThickness : 5,
      dropShadow : true,
      dropShadowColor : '#000000',
      dropShadowAngle : Math.PI/6,
      dropShadowDistance : 6,
      wordWrap : true,
      wordWrapWidth : 440
    });
    text.interactive = true;
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
    text.x = renderer.width/2;
    text.y = renderer.height/2;
    restartContainer.addChild(text);
    text.on('mousedown', this.onDownHandler());
    text.on('touchstart', this.onDownHandler());

    this.addChild(restartContainer);
  }

  onDownHandler() {
    let self = this;
    return function() {
      self.restartGame();
    }
  }

  restartGame() {
    this.removeChild(this.getChildByName('restartContainer'));
    this.board.resetGame();
  }

  addHeader() {
    let header = new PIXI.Text('Connect 4', {
      font : 'bold 50px Courier',
      fill : '#910239',
      stroke : '#4a1850',
      strokeThickness : 5,
      dropShadow : true,
      dropShadowColor : '#000000',
      dropShadowAngle : Math.PI/6,
      dropShadowDistance : 6,
      wordWrap : true,
      wordWrapWidth : 440
    });
    header.anchor.x = 0.5;
    header.anchor.y = 1;
    header.x = renderer.width/2;
    header.y = 80;
    this.addChild(header);
  }

// End class
}

let stage = new Stage();

function resize(){
  stage.scale.x = stage.scale.y = (RATIO*window.innerWidth/GAME_WIDTH);
  renderer.resize(Math.ceil(window.innerWidth * RATIO),
                  Math.ceil(GAME_HEIGHT));
}

function animate() {
  let winner = stage.animate();
  if(winner)
    stage.askForReset(winner);
  renderer.render(stage);
  requestAnimationFrame(animate);
}

resize();
window.addEventListener("resize", resize);
animate();
