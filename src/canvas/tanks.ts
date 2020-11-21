import { Plain } from './obstacles';
import { GameBase, size, WhereIndex } from './gameBase';
import { Bullet, EnemyBullet, PlayerBullet } from './bullet';

export type Deg = 0 | 90 | 180 | 270;

/* 坦克 */
export abstract class Tanks {
  public x: WhereIndex;
  public y: WhereIndex;
  public readonly color: string;
  public readonly gameBase: GameBase;
  public deg: Deg;
  private allowTranslate: boolean;
  public abstract bullet: Bullet | null;
  protected lifeValue: 0 | 1 | 2 | 3;
  protected movementSpe: 100 | 200 | 150;

  protected constructor(
    x: WhereIndex,
    y: WhereIndex,
    color: string,
    gameBase: GameBase,
    lifeValue: 1 | 2 | 3,
    movementSpe: 100 | 200 | 150,
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.gameBase = gameBase;
    this.deg = 0;
    this.allowTranslate = true;
    this.lifeValue = lifeValue;
    this.movementSpe = movementSpe;
  }

  /* 画到 canvas 上 */
  public draw(deg: Deg | undefined): void {
    this.deg = deg !== undefined ? deg : this.deg;
    //设置方向和颜色
    const svg = document.getElementById('tank');
    svg.style.fill = this.color;
    svg.style.transform = `rotate(${this.deg}deg)`;
    //获取图片
    this.gameBase.drawSVG(<HTMLCanvasElement>svg, this.x * size, this.y * size, size);
  }

  /* 移动 */
  public move(x: 1 | 0 | -1, y: 1 | 0 | -1): boolean {
    /* 清除之前区块 */
    this.gameBase.context.clearRect(this.x * size, this.y * size, size, size);
    this.gameBase.ground?.[this.x]?.[this.y]?.draw(this.gameBase.context);
    //墙壁或障碍物不移动,1000ms内移动过不移动
    if (
      this.gameBase.ground[this.x + x] !== undefined && // 超出格子
      (this.gameBase.ground[this.x + x][this.y + y] === null ||
        this.gameBase.ground[this.x + x][this.y + y] instanceof Plain) && // 是不可骑上去的障碍物
      this.allowTranslate && //允许移动
      this.gameBase.enemyTanks[this.x + x][this.y + y] === null && // 不能是敌方坦克
      (this.gameBase.playerTank.x !== this.x + x || this.gameBase.playerTank.y !== this.y + y) // 不是玩家坦克
    ) {
      this.gameBase.enemyTanks[this.x][this.y] = null;
      // 更新位置
      this.x += x;
      this.y += y;
      this.draw(x === 1 ? 0 : y === 1 ? 90 : x === -1 ? 180 : 270);
      this.allowTranslate = false;
      //防抖
      window.setTimeout(() => {
        this.allowTranslate = true;
      }, this.movementSpe);
      return true;
    } else {
      this.draw(x === 1 ? 0 : y === 1 ? 90 : x === -1 ? 180 : 270);
      return false;
    }
  }

  /* 发射子弹 */
  public fire(): void {
    // 不存在子弹才能发射
    if (this.bullet === null) {
      this.bullet = new PlayerBullet(this.x, this.y, this.deg, this);
      this.bullet?.init();
    }
  }

  /* 中枪 */
  public abstract gunShoot(bullet: Bullet): boolean;

  /* 移动改变 gameBase 的数组 */
  public abstract changeGameBase(): undefined;
}

export class PlayerTanks extends Tanks {
  public bullet: PlayerBullet | null;

  constructor(x: WhereIndex, y: WhereIndex, color: string, gameBase: GameBase) {
    super(x, y, color, gameBase, 2, 150);
    this.bullet = null;
  }

  public gunShoot(bullet: Bullet): boolean {
    if (bullet instanceof EnemyBullet) {
      this.lifeValue--;
      return false;
    } else {
      return true;
    }
  }

  changeGameBase(): undefined {
    return undefined;
  }
}

export class EnemyTanks extends Tanks {
  public bullet: EnemyBullet | null;
  private intervalId: number | null;

  constructor(
    x: WhereIndex,
    y: WhereIndex,
    color: string,
    gameBase: GameBase,
    lifeValue: 1 | 2 | 3,
    movementSpe: 100 | 200 | 150,
  ) {
    super(x, y, color, gameBase, lifeValue, movementSpe);
    this.bullet = null;
    this.intervalId = null;
  }

  public gunShoot(bullet: Bullet): boolean {
    if (bullet instanceof PlayerBullet) {
      this.lifeValue--;
      if (this.lifeValue === 0) {
        /* 清除之前区块 */
        this.gameBase.context.clearRect(this.x * size, this.y * size, size, size);
        this.gameBase.ground?.[this.x]?.[this.y]?.draw(this.gameBase.context);
        /* 清除事件 */
        window.clearInterval(this.intervalId);
        this.gameBase.enemyTanks[this.x][this.y] = null;
      }
      return false;
    } else {
      return true;
    }
  }

  public init() {
    this.intervalId = window.setInterval(() => {
      let x: 0 | 1 | -1 = 0;
      let y: 0 | 1 | -1 = 0;
      switch ((Math.random() * 4) >> 0) {
        case 0:
          x = 1;
          break;
        case 1:
          x = -1;
          break;
        case 2:
          y = 1;
          break;
        case 3:
          y = -1;
          break;
      }
      this.move(x, y);
    }, this.movementSpe + 1);
  }

  changeGameBase(): undefined {
    this.gameBase.enemyTanks[this.x][this.y] = this;
    return undefined;
  }
}
