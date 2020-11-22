import { BrickWall, IronWall, Obstacles, Plain } from './obstacles';
import { EnemyTanks, PlayerTanks } from './tanks';
import { getRandomItem } from '../util/random';

/* 位置下标 */
export type WhereIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;

/* 障碍物 */
export interface ObstaclesItem {
  x: WhereIndex;
  y: WhereIndex;
  typeCode: 1 | 2 | 3; //障碍物类型,1为铁墙，2为砖墙,3为草地
}

/* 清晰度 */
export const dpr = window.devicePixelRatio || 1;

/* canvas每个格子大小 */

export interface EnemyTankItem {
  x: WhereIndex;
  y: WhereIndex;
  lifeValue: 1 | 2 | 3;
  movementSpe: 200 | 300 | 450;
  color: string;
}

export interface PlayerTankItem {
  x: WhereIndex;
  y: WhereIndex;
  color: string;
}

/* 游戏 */
export class GameBase {
  public context: CanvasRenderingContext2D; //上下文
  public ground: (Obstacles | null)[][]; // 存放障碍物
  public playerTank: PlayerTanks; //玩家坦克
  private readonly keydownEvent: (e: KeyboardEvent) => void; // 点击事件
  public enemyTanks: (EnemyTanks | null)[][]; // 存放敌方坦克

  constructor(
    canvas: HTMLCanvasElement,
    groundList: ObstaclesItem[],
    playerTank: PlayerTankItem,
    enemyTanksList: EnemyTankItem[],
  ) {
    //初始化context
    const rect = canvas.getBoundingClientRect();
    canvas.width = (rect.width || canvas.width) * dpr;
    canvas.height = (rect.height || canvas.height) * dpr;
    const context = canvas.getContext('2d');
    if (context !== null) {
      this.context = context;
    } else {
      throw '没有获取到正确的context';
    }
    //获取障碍物
    this.ground = [...Array(20)].map(() => Array(20).fill(null));
    groundList.forEach((value) => {
      this.addGroundObjects(value.x, value.y, value.typeCode);
    });
    //初始化敌方坦克
    this.enemyTanks = [...Array(20)].map(() => Array(20).fill(null));
    enemyTanksList.forEach((value) => {
      this.enemyTanks[value.x][value.y] = new EnemyTanks(
        value.x,
        value.y,
        value.color,
        this,
        value.lifeValue,
        value.movementSpe,
      );
    });
    //初始化坦克
    this.playerTank = new PlayerTanks(playerTank.x, playerTank.y, playerTank.color, this);
    //绑定键盘事件
    this.keydownEvent = (e) => {
      switch (e.key) {
        case 'w':
          this.playerTank.move(0, -1);
          break;
        case 'a':
          this.playerTank.move(-1, 0);
          break;
        case 's':
          this.playerTank.move(0, 1);
          break;
        case 'd':
          this.playerTank.move(1, 0);
          break;
        case ' ':
          this.playerTank.fire();
          break;
      }
    };
  }

  /* 把障碍物和坦克画到 canvas 上 */
  public draw(): void {
    this.ground.forEach((value) =>
      value.forEach((value1) => {
        value1?.draw(this.context);
      }),
    );
    if (this.ground[this.playerTank.x][this.playerTank.y] === null) {
      this.playerTank.draw(0);
    } else {
      throw '坦克在障碍物上';
    }
    this.enemyTanks.forEach((value) => {
      value.forEach((value1) => {
        value1?.draw(getRandomItem([0, 90, 180, 270]));
      });
    });
  }

  //添加障碍物
  private addGroundObjects(x: WhereIndex, y: WhereIndex, typeCode: 1 | 2 | 3): void {
    if (this.ground[x][y] !== null) {
      throw '重复障碍物';
    } else {
      switch (typeCode) {
        case 1:
          this.ground[x][y] = new IronWall(x, y);
          break;
        case 2:
          this.ground[x][y] = new BrickWall(x, y);
          break;
        case 3:
          this.ground[x][y] = new Plain(x, y);
      }
    }
  }

  /* 游戏开始 */
  public gameStart(): void {
    document.addEventListener('keydown', this.keydownEvent);
    this.enemyTanks.forEach((value) => {
      value.forEach((value1) => {
        value1?.init();
      });
    });
  }

  /* 游戏暂停 */
  public gamePauses(): void {
    document.removeEventListener('keydown', this.keydownEvent);
    this.enemyTanks.forEach((value) => {
      value.forEach((value1) => {
        value1?.end();
      });
    });
  }

  //画 svg
  public drawSVG(svg: HTMLCanvasElement, x: number, y: number, svgSize: number): void {
    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = btoa(xml);
    const image64 = 'data:image/svg+xml;base64,' + svg64;
    const img = new Image();
    img.src = image64;
    //渲染
    img.onload = () => {
      this.context.drawImage(img, x, y, svgSize, svgSize);
    };
  }
}
