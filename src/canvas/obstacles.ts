import { GameBase, WhereIndex } from './gameBase';
import { size } from '../util/config';

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

  /* 中枪 */
  public abstract gunShoot(gameBase: GameBase): void;
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

  gunShoot(): void {
    return undefined;
  }
}

/* 砖头 */
export class BrickWall extends Obstacles {
  public lifeValue: 0 | 1 | 2;

  constructor(x: WhereIndex, y: WhereIndex) {
    super(x, y);
    this.lifeValue = 2;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = '#8d6262';
    context.fillRect(this.x * size, this.y * size, size, size);
  }

  gunShoot(gameBase: GameBase): void {
    this.lifeValue--;
    // 砖块被打两下就消失
    if (this.lifeValue === 0) {
      gameBase.ground[this.x][this.y] = null;
      gameBase.context.clearRect(this.x * size, this.y * size, size, size);
    }
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

  gunShoot(): void {
    return undefined;
  }
}
