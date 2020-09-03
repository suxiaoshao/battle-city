export type PointNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

export interface GroundItem {
  x: PointNumber;
  y: PointNumber;
  typeCode: 1 | 2 | 3;
}

export class GameBase {
  public context: CanvasRenderingContext2D;
  public ground: (GroundObjects | null)[][];
  public playerTank: PlayerTanks;
  private readonly keydownEvent: (e: KeyboardEvent) => void;

  constructor(
    canvas: HTMLCanvasElement,
    groundList: GroundItem[],
    playerTank: { x: PointNumber; y: PointNumber; color: string },
  ) {
    //初始化context
    const dpr = window.devicePixelRatio || 1;
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
    //初始化坦克
    this.playerTank = new PlayerTanks(playerTank.x, playerTank.y, playerTank.color, this);
    this.keydownEvent = (e) => {
      switch (e.key) {
        case 'w':
          this.playerTank.translate(0, -1);
          break;
        case 'a':
          this.playerTank.translate(-1, 0);
          break;
        case 's':
          this.playerTank.translate(0, 1);
          break;
        case 'd':
          this.playerTank.translate(1, 0);
          break;
      }
    };
  }

  /* 把障碍物画到canvas上 */
  public draw(): void {
    this.ground.forEach((value) =>
      value.forEach((value1) => {
        value1?.draw(this.context);
      }),
    );
    if (this.ground[this.playerTank.x][this.playerTank.y] === null) {
      this.playerTank.draw();
    } else {
      throw '坦克在障碍物上';
    }
  }

  //添加障碍物
  private addGroundObjects(x: PointNumber, y: PointNumber, typeCode: 1 | 2 | 3): void {
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
  }

  /* 游戏暂停 */
  public gamePauses(): void {
    document.removeEventListener('keydown', this.keydownEvent);
  }
}

export abstract class GroundObjects {
  public x: PointNumber;
  public y: PointNumber;

  protected constructor(x: PointNumber, y: PointNumber) {
    this.x = x;
    this.y = y;
  }

  public abstract draw(context: CanvasRenderingContext2D): void;
}

/* 铁墙 */
export class IronWall extends GroundObjects {
  constructor(x: PointNumber, y: PointNumber) {
    super(x, y);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = '#d3d3d3';
    context.fillRect((this.x - 1) * 30, (this.y - 1) * 30, 30, 30);
  }
}

/* 砖头 */
export class BrickWall extends GroundObjects {
  constructor(x: PointNumber, y: PointNumber) {
    super(x, y);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = '#8d6262';
    context.fillRect((this.x - 1) * 30, (this.y - 1) * 30, 30, 30);
  }
}

/* 流水 */
export class Plain extends GroundObjects {
  constructor(x: PointNumber, y: PointNumber) {
    super(x, y);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = '#cadefc';
    context.fillRect((this.x - 1) * 30, (this.y - 1) * 30, 30, 30);
  }
}

export class Tank {
  public x: PointNumber;
  public y: PointNumber;
  public color: string;
  public gameBase: GameBase;

  constructor(x: PointNumber, y: PointNumber, color: string, gameBase: GameBase) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.gameBase = gameBase;
  }

  /* 画出 */
  public draw(): void {
    const svg = document.getElementById('svg');
    svg.style.fill = this.color;
    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = btoa(xml);
    const image64 = 'data:image/svg+xml;base64,' + svg64;
    const img = new Image();
    img.src = image64;
    img.onload = () => {
      this.gameBase.context.drawImage(img, (this.x - 1) * 30, (this.y - 1) * 30, 30, 30);
    };
  }

  /* 移动 */
  public translate(x: 1 | 0 | -1, y: 1 | 0 | -1): boolean {
    this.gameBase.context.clearRect((this.x - 1) * 30, (this.y - 1) * 30, 30, 30);
    this.x += x;
    this.y += y;
    this.draw();
    return true;
  }
}

class PlayerTanks extends Tank {
  constructor(x: PointNumber, y: PointNumber, color: string, gameBase: GameBase) {
    super(x, y, color, gameBase);
  }
}
