import { Snake, GameGrid } from "./index.js";
import { CanvasType } from "./wrappers/index.js";

type Dimensions = { width: number, height: number };
type Position = { x: number, y: number };
type Padding = { x?: number, y?: number };

type Definite<Type> = { [K in keyof Type]-?: Definite<Type[K]> }

interface Settings {
    pixelsPerTile: number;
    padding?: Padding;
}

type DefiniteSettings = Definite<Settings>;

class Apple {
    private _position: Position;
    private _settings: DefiniteSettings;

    private constructor(
        snake: Snake,
        boardDimensions: Dimensions,
        settings: DefiniteSettings
    ) {
        let pos: Position;
        do {
            // TODO: make sure this number doesn't go over the width/height
            // i.e., make sure the dimensions passed are for the board, and
            // not, say, the surrouding div
            const x = Math.floor(Math.random() * boardDimensions.width);
            const y = Math.floor(Math.random() * boardDimensions.height);
            pos = { x, y };
        } while (snake.contains(pos));

        this._position = pos;
        this._settings = settings;
    }

    static fromBoardAndSnakeAndSettings(
        board: GameGrid,
        snake: Snake,
        settings: Settings
    ): Apple {
        const { width, height } = board.dimensions;

        let newSettings: DefiniteSettings = {
            pixelsPerTile: settings.pixelsPerTile,
            padding: {
                x: 0,
                y: 0,
                ... (settings.padding ?? {})
            },
        };

        const apple = new Apple(snake, { width, height }, newSettings);
        return apple;
    }

    drawOn(canvas: CanvasType, color?: string) {
        const startX = this._position.x * this._settings.pixelsPerTile + this._settings.padding.x;
        const startY = this._position.y * this._settings.pixelsPerTile + this._settings.padding.y;
        canvas.fillRect(
            startX,
            startY,
            this._settings.pixelsPerTile - 2 * this._settings.padding.x,
            this._settings.pixelsPerTile - 2 * this._settings.padding.y,
            color
        );
    }
}

export default Apple;

