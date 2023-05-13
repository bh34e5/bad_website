import { Snake, MoveDirection, GameGrid } from "./index.js"
import { GameCanvas } from "./wrappers/index.js"

type GameState = "startup" | "running" | "paused" | "ended";

const PIXELS_PER_TILE = 25;
const MS_PER_FRAME = 150;
const GAME_BOARD_WIDTH = 33;
const GAME_BOARD_HEIGHT = 33;

interface GameStateObj {
    // TODO: consider changing this to BigInteger
    // but maybe not because DOMHighResTimeStamp is a number alias
    gameTime: number;
    lastRenderTS: DOMHighResTimeStamp;
    lastRenderCount: number;
}

class SnakeGame {
    private _gameContainer: HTMLDivElement;
    private _canv: GameCanvas;

    private _gameState: GameState;
    private _prevGameState: GameState;
    private _gameStateObj: GameStateObj;
    private _keyPressQueue: MoveDirection[];

    private _gameGrid: GameGrid;
    private _snake: Snake;
    private _boundHandleKeyDown: EventListener;
    private _boundRender: FrameRequestCallback;

    constructor(containerId: string) {
        // bind functions to this instance
        this._boundRender = this.render.bind(this);
        this._boundHandleKeyDown = this.handleKeyDown.bind(this);

        const cont = document.querySelector(`#${containerId}`);
        const styleTag = document.createElement("style");
        styleTag.innerHTML = `* { box-sizing: border-box; }`;

        this._gameContainer = document.createElement("div");
        this._gameContainer.style.width =
            `${GAME_BOARD_WIDTH * PIXELS_PER_TILE}px`;
        this._gameContainer.style.height =
            `${GAME_BOARD_HEIGHT * PIXELS_PER_TILE}px`;

        const gridSideWidth = 1;
        this._gameGrid = new GameGrid(
            GAME_BOARD_WIDTH,
            GAME_BOARD_HEIGHT,
            PIXELS_PER_TILE,
            gridSideWidth
        );

        this._gameContainer.style.border = "1px solid black";
        this._gameContainer.style.position = "relative";

        this._gameState = "startup";
        this._keyPressQueue = [];
        this._snake = new Snake(
            PIXELS_PER_TILE,
            { x: gridSideWidth, y: gridSideWidth }
        );

        this._canv = new GameCanvas(this._gameContainer);

        const numRows = GAME_BOARD_HEIGHT - 2;
        const numCols = GAME_BOARD_WIDTH - 2;
        this._canv.width = numCols * PIXELS_PER_TILE;
        this._canv.height = numRows * PIXELS_PER_TILE;
        this._canv.addEventListener("keydown", this._boundHandleKeyDown);

        cont.appendChild(styleTag);
        cont.appendChild(this._gameContainer);

        // do an initial paint to show the screen
        this.paint();

        this._prevGameState = "running";
        this.setGameState("paused");
    }

    private setGameState(state: GameState) {
        this._gameState = state;
        switch (state) {
            case "running": {
                this._gameStateObj = null;
                requestAnimationFrame(this._boundRender);
                break;
            }
            case "ended": {
                // TODO: show ended div
                break;
            }
            case "paused": {
                // TODO: show paused div
                break;
            }
        }
    }

    private render(ts: DOMHighResTimeStamp) {
        // DEBUG
        // console.log(ts);
        // END DEBUG

        let stepsNeeded = 0;
        if (this._gameStateObj == null) {
            // the first render
            this._gameStateObj = {
                gameTime: 0,
                lastRenderTS: ts,
                lastRenderCount: 0,
            };
        } else {
            const tsDiff = Math.round(ts - this._gameStateObj.lastRenderTS);
            const addedGameTime = this._gameStateObj.gameTime + tsDiff;

            const numFrames = Math.floor(addedGameTime / MS_PER_FRAME);
            stepsNeeded = numFrames - this._gameStateObj.lastRenderCount;

            this._gameStateObj = {
                gameTime: addedGameTime,
                lastRenderTS: ts,
                lastRenderCount: numFrames,
            };
        }

        function moveAndCheckIsValid(dir?: MoveDirection): boolean {
            const newPos = this._snake.move(dir);
            if (newPos.x < 0 || newPos.x >= GAME_BOARD_WIDTH - 2) {
                return false;
            }
            if (newPos.y < 0 || newPos.y >= GAME_BOARD_HEIGHT - 2) {
                return false;
            }
            return !this._snake.intersects();
        }

        while (this._keyPressQueue.length > 0 && stepsNeeded > 0) {
            // an array of a single element, which will also be used to pass
            // as a singleton array for the Function.prototype.apply method
            const dirArr = this._keyPressQueue.splice(0, 1);

            if (!moveAndCheckIsValid.apply(this, dirArr)) {
                this.setGameState("ended");
            }
            --stepsNeeded;
        }

        while (stepsNeeded > 0) {
            if (!moveAndCheckIsValid.apply(this)) {
                this.setGameState("ended");
            }
            --stepsNeeded;
        }

        this.paint();

        if (this._gameState === "running") {
            requestAnimationFrame(this._boundRender);
        }
    }

    private paint() {
        // DEBUG
        this._canv.clear();
        this._canv.fillRect(
            0,
            0,
            this._canv.width,
            this._canv.height,
        );
        this._gameGrid.drawOn(this._canv, "lightgray");
        this._snake.drawOn(this._canv, "green");

        console.log("painting");
        // END DEBUG
    }

    private handleKeyDown(ev: Event) {
        if (ev.type === "keydown") {
            let moveDirection;
            switch ((ev as KeyboardEvent).key) {
                case "w": {
                    this._keyPressQueue.push("up");
                    break;
                }
                case "a": {
                    this._keyPressQueue.push("left");
                    break;
                }
                case "s": {
                    this._keyPressQueue.push("down");
                    break;
                }
                case "d": {
                    this._keyPressQueue.push("right");
                    break;
                }
                case " ": {
                    this._snake.eat();
                    break;
                }
                case "p": {
                    this.togglePaused();
                    break;
                }
            }

            // DEBUG
            console.log(this._snake.intersects());
            // END DEBUG
        }
    }

    private togglePaused() {
        if (this._gameState === "paused") {
            this.setGameState(this._prevGameState);
        } else {
            this._prevGameState = this._gameState;
            this.setGameState("paused");

            // DEBUG
            console.log("paused");
            // END DEBUG
        }
    }

}

export default SnakeGame;

