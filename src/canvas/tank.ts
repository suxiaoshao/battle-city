import { Plain } from './obstacles';
import { GameBase, size, WhereIndex } from './gameBase';
import { Bullet } from './bullet';

export type Deg = 0 | 90 | 180 | 270;

/* 坦克 */
export class Tank {
  public x: WhereIndex;
  public y: WhereIndex;
  private readonly color: string;
  private readonly gameBase: GameBase;
  private deg: Deg;
  private allowTranslate: boolean;
  private bullet: Bullet | null;

  constructor(x: WhereIndex, y: WhereIndex, color: string, gameBase: GameBase) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.gameBase = gameBase;
    this.deg = 0;
    this.bullet = null;
    this.allowTranslate = true;
  }

  /* 画到 canvas 上 */
  public draw(deg: Deg): void {
    this.deg = deg;
    //设置方向和颜色
    const svg = document.getElementById('tank');
    svg.style.fill = this.color;
    svg.style.transform = `rotate(${this.deg}deg)`;
    //获取图片
    this.gameBase.drawSVG(<HTMLCanvasElement>svg, this.x * size, this.y * size, size);
  }

  /* 移动 */
  public translate(x: 1 | 0 | -1, y: 1 | 0 | -1): boolean {
    //墙壁或障碍物不移动,1000ms内移动过不移动
    if (
      this.gameBase.ground[this.x + x] !== undefined &&
      (this.gameBase.ground[this.x + x][this.y + y] === null ||
        this.gameBase.ground[this.x + x][this.y + y] instanceof Plain) &&
      this.allowTranslate
    ) {
      /* 清除之前区块 */
      this.gameBase.context.clearRect(this.x * size, this.y * size, size, size);
      this.gameBase.ground[this.x][this.y]?.draw(this.gameBase.context);
      this.x += x;
      this.y += y;
      this.draw(x === 1 ? 0 : y === 1 ? 90 : x === -1 ? 180 : 270);
      this.allowTranslate = false;
      //防抖
      setTimeout(() => {
        this.allowTranslate = true;
      }, 100);
    }
    return true;
  }

  /* 发射子弹 */
  public fire(): void {
    this.bullet = new Bullet(this.x, this.y, this.deg, this.color, this.gameBase);
    this.bullet?.init();
  }
}

export class PlayerTanks extends Tank {
  constructor(x: WhereIndex, y: WhereIndex, color: string, gameBase: GameBase) {
    super(x, y, color, gameBase);
  }
}
