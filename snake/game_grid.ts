import { CanvasType } from "./wrappers/index.js";

class GameGrid {
    private _rows: number;
    private _cols: number;
    private _pixPerTile: number;
    private _gridSize: number;

    constructor(rows, cols, pixelsPerTile, gridSize) {
        this._rows = rows;
        this._cols = cols;
        this._pixPerTile = pixelsPerTile;
        this._gridSize = gridSize;
    }

    drawOn(canvas: CanvasType, color?: string) {
        const canvasWidth = this._rows * this._pixPerTile;
        const canvasHeight = this._cols * this._pixPerTile;

        for (let i = 0; i < this._rows; ++i) {
            // top border
            canvas.fillRect(
                0,
                i * this._pixPerTile,
                canvasWidth,
                this._gridSize,
                color,
            );
            // bottom border
            canvas.fillRect(
                0,
                (i + 1) * this._pixPerTile - this._gridSize,
                canvasWidth,
                this._gridSize,
                color,
            );
        }
        for (let j = 0; j < this._cols; ++j) {
            // left border
            canvas.fillRect(
                j * this._pixPerTile,
                0,
                this._gridSize,
                canvasHeight,
                color
            );
            // right border
            canvas.fillRect(
                (j + 1) * this._pixPerTile - this._gridSize,
                0,
                this._gridSize,
                canvasHeight,
                color
            );
        }
    }
}

export default GameGrid;

