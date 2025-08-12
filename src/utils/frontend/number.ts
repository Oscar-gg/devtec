export const formatNumber = (num: number | undefined | null) => {
  if (num === undefined || num === null) {
    return "loading...";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};
