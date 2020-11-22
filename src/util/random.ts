export function getRandomItem<T>(itemList: T[]): T {
  return itemList[parseInt(String(Math.random() * itemList.length))];
}
