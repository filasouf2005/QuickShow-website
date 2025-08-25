export const kConverter = (num : number) => {
  return num < 1000 ? num : `${(num / 1000).toFixed(1)}k`;
}
