import { CanvasType } from "./wrappers/index.js";

type Position = { x: number, y: number };
type Padding = { x?: number, y?: number };
type DefinitePadding = { [K in keyof Padding]-?: Padding[K] };

type BodyPart = Position & { next?: BodyPart, prev?: BodyPart };
type Body = { head: BodyPart, tail: BodyPart };

export type MoveDirection = "up" | "down" | "left" | "right";

class Snake {
    private _snakeBody: Body;
    private _pixPerTile: number;
    private _padding: DefinitePadding;
    private _leftToGrow: number = 0;
    private _lastDirection: MoveDirection = "right";

    constructor(pixelsPerTile: number, padding?: Padding) {
        const startingPos = { x: 5, y: 5 };
        this._snakeBody = { head: startingPos, tail: startingPos };

        this._pixPerTile = pixelsPerTile;
        this._padding = { x: 0, y: 0, ... (padding ?? {}) };
    }

    drawOn(canvas: CanvasType, color?: string) {
        let curr: BodyPart = this._snakeBody.head;

        while (curr != null) {
            const startX = curr.x * this._pixPerTile;
            const startY = curr.y * this._pixPerTile;

            canvas.fillRect(
                startX + this._padding.x,
                startY + this._padding.y,
                this._pixPerTile - 2 * this._padding.x,
                this._pixPerTile - 2 * this._padding.y,
                color,
            );

            curr = curr.next;
        }
    }

    eat() {
        this._leftToGrow += 3;
    }

    move(direction?: MoveDirection): Position {
        const newHead = {
            ...this._snakeBody.head,
            next: this._snakeBody.head,
        };

        const moveDirection = direction ?? this._lastDirection;
        switch (moveDirection) {
            case "up": {
                --newHead.y;
                break;
            }
            case "down": {
                ++newHead.y;
                break;
            }
            case "left": {
                --newHead.x;
                break;
            }
            case "right": {
                ++newHead.x;
                break;
            }
        }

        if (direction != null) {
            this._lastDirection = direction;
        }

        this._snakeBody.head.prev = newHead;
        this._snakeBody.head = newHead;

        if (this._leftToGrow == 0) {
            const oldTail = this._snakeBody.tail;
            if (oldTail.prev != null) {
                this._snakeBody.tail = oldTail.prev;
                delete oldTail.prev.next;
                delete oldTail.prev;
            } else {
                this._snakeBody.tail = newHead;
            }
        } else {
            --this._leftToGrow;
        }

        return { x: newHead.x, y: newHead.y };
    }

    intersects(): boolean {
        const vals = {};

        let curr = this._snakeBody.head;
        while (curr != null) {
            if (curr.x in vals) {
                if (curr.y in vals[curr.x]) {
                    return true;
                }
                vals[curr.x] = { ...vals[curr.x], [curr.y]: 0 };
            } else {
                vals[curr.x] = { [curr.y]: 0 };
            }
            curr = curr.next;
        }
        return false;
    }
}

export default Snake;

