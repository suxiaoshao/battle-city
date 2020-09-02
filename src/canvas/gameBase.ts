export class GameBase {
  private context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
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
  }
}
