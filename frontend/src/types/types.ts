export type PricePoint = {
  slot?: number;
  time: string;
  actual?: number;
  forecast?: number;
  rangeBase?: number;
  rangeDiff?: number;
};

export type ChartPoint = PricePoint & {
  slot: number;
};
