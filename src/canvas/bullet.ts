import { size, WhereIndex } from './gameBase';
import { Deg, Tank } from './tank';
import { Plain } from './obstacles';

export class Bullet {
  public x: WhereIndex;
  public y: WhereIndex;
  public deg: Deg;
  public fatherTanks: Tank;
  private intervalId: number | null;

  constructor(x: WhereIndex, y: WhereIndex, deg: Deg, tank: Tank) {
    this.x = x;
    this.y = y;
    this.deg = deg;
    this.fatherTanks = tank;
    this.intervalId = null;
  }

  init(): void {
    this.intervalId = window.setInterval(() => {
      this.translate();
    }, 70);
  }

  translate(): void {
    // 获取位置
    this.x += this.deg === 0 ? 1 : this.deg === 180 ? -1 : 0;
    this.y += this.deg === 90 ? 1 : this.deg === 270 ? -1 : 0;
    /* 可以通过 */
    if (
      this.fatherTanks.gameBase.ground[this.x] !== undefined &&
      (this.fatherTanks.gameBase.ground[this.x][this.y] === null ||
        this.fatherTanks.gameBase.ground[this.x][this.y] instanceof Plain)
    ) {
      this.draw();
      window.setTimeout(() => {
        this.fatherTanks.gameBase.context.clearRect(this.x * size, this.y * size, size, size);
        //如果是草地的话重新绘制
        this.fatherTanks.gameBase.ground[this.x][this.y]?.draw(this.fatherTanks.gameBase.context);
      }, 65);
    } else {
      this.fatherTanks.bullet = null;
      window.clearInterval(this.intervalId);
      this.fatherTanks.gameBase.ground[this.x][this.y]?.gunShoot(this.fatherTanks.gameBase);
    }
  }

  public draw(): void {
    //设置方向和颜色
    const svg = document.getElementById('bullet');
    svg.style.fill = this.fatherTanks.color;
    //获取图片
    this.fatherTanks.gameBase.drawSVG(
      <HTMLCanvasElement>svg,
      this.x * size + size / 4,
      this.y * size + size / 4,
      size / 2,
    );
  }
}

export class PlayerBullet extends Bullet {
  constructor(x: WhereIndex, y: WhereIndex, deg: Deg, tank: Tank) {
    super(x, y, deg, tank);
  }
}
