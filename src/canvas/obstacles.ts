import { size, WhereIndex } from './gameBase';

/* 障碍物 */
export abstract class Obstacles {
  public x: WhereIndex;
  public y: WhereIndex;

  protected constructor(x: WhereIndex, y: WhereIndex) {
    this.x = x;
    this.y = y;
  }

  /* 画到 canvas 上 */
  public abstract draw(context: CanvasRenderingContext2D): void;
}

/* 铁墙 */
export class IronWall extends Obstacles {
  constructor(x: WhereIndex, y: WhereIndex) {
    super(x, y);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = '#d3d3d3';
    context.fillRect(this.x * size, this.y * size, size, size);
  }
}

/* 砖头 */
export class BrickWall extends Obstacles {
  constructor(x: WhereIndex, y: WhereIndex) {
    super(x, y);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = '#8d6262';
    context.fillRect(this.x * size, this.y * size, size, size);
  }
}

/* 流水 */
export class Plain extends Obstacles {
  constructor(x: WhereIndex, y: WhereIndex) {
    super(x, y);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = '#1fab89';
    context.fillRect(this.x * size, this.y * size, size, size);
  }
}
