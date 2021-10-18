let game;

let gameOptions = {
    cardWidth: 334,
    cardHeight: 440,
    cardScale: 0.8
}

window.onload = function() {
    let gameConfig = {
        type            : Phaser.AUTO,
        backgroundColor : 0x4488aa,
        scene           : playGame,
        scale           : {
            mode       : Phaser.Scale.FIT,
            autoCenter : Phaser.Scale.CENTER_BOTH,
            parent     : "thegame",
            width      : 750,
            height     : 1334
        },
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}

const UP = -1;
const DOWN = 1;

class playGame extends Phaser.Scene {
    constructor() { super("PlayGame") }
    preload() {
        this.load.spritesheet("cards", "cards.png", {
            frameWidth: gameOptions.cardWidth,
            frameHeight: gameOptions.cardHeight
        });
    }
    create() {
        this.canSwipe = true;
        this.deck = Phaser.Utils.Array.NumberArray(0, 51);
        Phaser.Utils.Array.Shuffle(this.deck);
        this.cardsInGame = [this.createCard(0), this.createCard(1)];
        this.nextCardIndex = 2;
        this.tweens.add({
            targets: this.cardsInGame[0],
            x: game.config.width / 2,
            duration: 500,
            ease: "Cubic.easeOut"
        });

        this.input.on("pointerup", this.checkSwipe, this);
    }

    createCard(i) {
        let card = this.add.sprite(- gameOptions.cardWidth * gameOptions.cardScale, game.config.height / 2, "cards", this.deck[i]);
        card.setScale(gameOptions.cardScale);
        return card;
    }

    checkSwipe(e) {
        if(this.canSwipe) {
            let swipeTime = e.upTime - e.downTime;
            let swipe = new Phaser.Math. Vector2(e.upX - e.downX, e.upY - e.downY);
            let swipeMagnitude = swipe.length();
            let swipeNormal = swipe.normalize();
            // we have a vertical swipe when:
            // * swipeMagnitude is bigger than 20, that is the player swiped for at least 20 pixels
            // * swipeTime is less than 1 second, gestures longer than one second can't be considered swipes
            // * the absolute value of the y component of the normal is 0.8
            if(swipeMagnitude > 20 && swipeTime < 1000 && Math.abs(swipeNormal.y) > 0.8) {
                if(swipeNormal.y > 0.8) {
                    this.handleSwipe(DOWN);
                }
                if(swipeNormal.y < -0.8) {
                    this.handleSwipe(UP);
                }
            }
        }
    }

    // method to handle a swipe, given the direction
    handleSwipe(direction) {
        this.canSwipe = false;
        let cardToMove = (this.nextCardIndex + 1) % 2;
        this.cardsInGame[cardToMove].y += direction * gameOptions.cardHeight * gameOptions.cardScale * 1.1;

        this.tweens.add({
            targets: this.cardsInGame[cardToMove],
            x: game.config.width / 2,
            duration: 500,
            ease: "Cubic.easeOut",
            callbackScope: this,
            onComplete: function() {
                this.time.addEvent({
                    delay: 1200,
                    callbackScope: this,
                    callback: this.moveCards,
                });
            }
        })
    }

    moveCards() {
        let cardToMove = this.nextCardIndex % 2;

        this.tweens.add({
            targets: this.cardsInGame[cardToMove],
            x: game.config.width + 2 * gameOptions.cardWidth * gameOptions.cardScale,
            duration: 500,
            ease: "Cubic.easeOut"
        });

        cardToMove = (this.nextCardIndex + 1) % 2;

        this.tweens.add({
            targets: this.cardsInGame[cardToMove],
            y: game.config.height / 2,
            duration: 500,
            ease: "Cubic.easeOut",
            callbackScope: this,
            onComplete: function(){

                cardToMove = this.nextCardIndex % 2;
                this.cardsInGame[cardToMove].setFrame(this.deck[this.nextCardIndex]);
                this.nextCardIndex = (this.nextCardIndex + 1) % 52;
                this.cardsInGame[cardToMove].x = gameOptions.cardWidth * gameOptions.cardScale / -2;

                this.canSwipe = true;
            }
        });
    }
}
