export interface Canvas {
    width: number;
    height: number;
    fillRect(
        x: number,
        y: number,
        width: number,
        height: number,
        color?: string,
    ): void;
    addEventListener(type: string, listener: EventListener): void;
    clear(): void;
}

class GameCanvas {
    private _canv: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    constructor(gameContainer: HTMLElement) {
        this._canv = document.createElement("canvas");
        this._canv.style.position = "absolute";
        this._canv.style.top = "0";
        this._canv.style.bottom = "0";
        this._canv.style.left = "0";
        this._canv.style.right = "0";
        this._canv.style.margin = "auto";
        this._canv.tabIndex = -1;

        this._ctx = this._canv.getContext("2d");

        gameContainer.appendChild(this._canv);
    }

    public fillRect(
        startX: number,
        startY: number,
        width: number,
        height: number,
        color?: string,
    ) {
        let oldStyle;

        if (color != null) {
            oldStyle = this._ctx.fillStyle;
            this._ctx.fillStyle = color;
        }

        this._ctx.fillRect(startX, startY, width, height);

        if (oldStyle != null) {
            this._ctx.fillStyle = oldStyle;
        }
    }

    addEventListener(type: string, listener: EventListener) {
        this._canv.addEventListener(type, listener);
    }

    clear() {
        this._ctx.clearRect(0, 0, this.width, this.height);
    }

    get width(): number {
        return this._canv.width;
    }

    set width(v: number) {
        if (v < 0) {
            return;
        }
        this._canv.width = v;
    }

    get height(): number {
        return this._canv.height;
    }

    set height(v: number) {
        if (v < 0) {
            return;
        }
        this._canv.height = v;
    }
}

export default GameCanvas;

