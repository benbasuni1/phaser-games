const config = {
  width           : 1400,
  height          : 750,
  parent          : "gameContainer",
  scene           : [GameScene],
  backgroundColor : "#FFFFF",
  physics: {
    default: "arcade"
  }
};

class GameScene extends Phaser.Scene {
  constructor() { super("gameScene") }
  preload() {}
  create() {}
  update() {}
}