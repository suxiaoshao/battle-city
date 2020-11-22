import { WhereIndex } from './gameBase';
import { size } from '../util/config';
import { Deg, EnemyTanks, PlayerTanks, Tanks } from './tanks';
import { Plain } from './obstacles';

export abstract class Bullet {
  public x: WhereIndex;
  public y: WhereIndex;
  public deg: Deg;
  public abstract fatherTanks: Tanks;
  private intervalId: number | null;

  protected constructor(x: WhereIndex, y: WhereIndex, deg: Deg) {
    this.x = x;
    this.y = y;
    this.deg = deg;
    this.intervalId = null;
  }

  init(): void {
    this.intervalId = window.setInterval(() => {
      this.move();
    }, 70);
  }

  move(): void {
    // 获取位置
    this.x += this.deg === 0 ? 1 : this.deg === 180 ? -1 : 0;
    this.y += this.deg === 90 ? 1 : this.deg === 270 ? -1 : 0;
    /* 可以通过 */
    if (
      this.fatherTanks.gameBase.ground[this.x] !== undefined && // 超出边界
      (this.fatherTanks.gameBase.ground[this.x][this.y] === null ||
        this.fatherTanks.gameBase.ground[this.x][this.y] instanceof Plain) && //是草地
      (((this.fatherTanks.gameBase.enemyTanks?.[this.x]?.[this.y] ?? true) ||
        this.fatherTanks.gameBase.enemyTanks?.[this.x]?.[this.y]?.gunShoot(this)) ??
        true) && // 敌方没中枪
      this.fatherTanks.gameBase.playerTank.gunShoot(this) // 我方坦克中枪
    ) {
      this.draw();
      window.setTimeout(() => {
        //清除块
        this.fatherTanks.gameBase.context.clearRect(this.x * size, this.y * size, size, size);
        //如果是草地的话重新绘制
        this.fatherTanks.gameBase.ground?.[this.x]?.[this.y]?.draw(this.fatherTanks.gameBase.context);
        // 如果是坦克重新绘制
        this.fatherTanks.gameBase.enemyTanks?.[this.x]?.[this.y]?.draw(undefined);
        // 自己坦克绘制
        this.fatherTanks.gameBase.playerTank.draw(undefined);
      }, 45);
    } else {
      this.end();
      this.fatherTanks.gameBase.ground?.[this.x]?.[this.y]?.gunShoot(this.fatherTanks.gameBase);
    }
  }

  public end(): void {
    this.fatherTanks.bullet = null;
    window.clearInterval(this.intervalId);
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
  public fatherTanks: PlayerTanks;

  constructor(x: WhereIndex, y: WhereIndex, deg: Deg, tank: PlayerTanks) {
    super(x, y, deg);
    this.fatherTanks = tank;
  }
}

export class EnemyBullet extends Bullet {
  public fatherTanks: EnemyTanks;

  constructor(x: WhereIndex, y: WhereIndex, deg: Deg, tank: EnemyTanks) {
    super(x, y, deg);
    this.fatherTanks = tank;
  }
}
