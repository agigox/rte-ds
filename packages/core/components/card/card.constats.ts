import { Size } from "../common/common-types";

export type CardSize = Size | "full";

export const cardSize: Record<CardSize, number | string> = {
  xs: 240,
  s: 360,
  m: 480,
  l: 600,
  xl: 720,
  full: "100%",
};
