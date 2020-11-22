import { EnemyTankItem, GameBase, ObstaclesItem, PlayerTankItem } from '../canvas/gameBase';
import { getRandomItem } from './random';

export function createGameBase(canvas: HTMLCanvasElement, obstaclesNum: number, enemyTanksNum: number): GameBase {
  let pointList = new Array(400).fill(1).map((value, index) => {
    return { x: parseInt(String(index / 20)), y: index % 20 };
  });
  const abList: ObstaclesItem[] = new Array(obstaclesNum).fill(1).map(() => {
    const point = getRandomItem(pointList);
    pointList = pointList.filter((value) => {
      return point.x !== value.x || point.y !== value.y;
    });
    return Object.assign(point, { typeCode: getRandomItem<1 | 2 | 3>([1, 2, 3]) }) as ObstaclesItem;
  });
  const enemyList: EnemyTankItem[] = new Array(enemyTanksNum).fill(1).map(() => {
    const point = getRandomItem(pointList);
    pointList = pointList.filter((value) => {
      return point.x !== value.x || point.y !== value.y;
    });
    return Object.assign(
      point,
      getRandomItem([
        { lifeValue: 1, movementSpe: 200 },
        { lifeValue: 2, movementSpe: 300 },
        { lifeValue: 3, movementSpe: 400 },
      ]),
    ) as EnemyTankItem;
  });
  const point = getRandomItem(pointList);
  pointList = pointList.filter((value) => {
    return point.x !== value.x || point.y !== value.y;
  });
  return new GameBase(canvas, abList, Object.assign(point, { color: '#fce38a' }) as PlayerTankItem, enemyList);
}
