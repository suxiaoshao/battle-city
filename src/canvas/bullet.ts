import { GameBase, size, WhereIndex } from './gameBase';
import { Deg } from './tank';

export class Bullet {
  public x: WhereIndex;
  public y: WhereIndex;
  public deg: Deg;
  private readonly color: string;
  public gameBase: GameBase;

  constructor(x: WhereIndex, y: WhereIndex, deg: Deg, color: string, gamedBase: GameBase) {
    this.x = x;
    this.y = y;
    this.deg = deg;
    this.color = color;
    this.gameBase = gamedBase;
  }

  init(): void {
    setInterval(() => {
      this.translate();
    }, 70);
  }

  translate(): void {
    this.x += this.deg === 0 ? 1 : this.deg === 180 ? -1 : 0;
    this.y += this.deg === 90 ? 1 : this.deg === 270 ? -1 : 0;
    this.draw();
    setTimeout(() => {
      this.gameBase.context.clearRect(this.x * size, this.y * size, size, size);
    }, 65);
  }

  public draw(): void {
    //设置方向和颜色
    const svg = document.getElementById('bullet');
    svg.style.fill = this.color;
    //获取图片
    this.gameBase.drawSVG(<HTMLCanvasElement>svg, this.x * size + size / 4, this.y * size + size / 4, size / 2);
  }
}
