import { CardSize } from "./card.constats";

export type CardType = "default" | "outlined";

export interface CardProps {
  size?: CardSize;
  cardType?: CardType;
  clickable?: boolean;
  disabled?: boolean;
  selected?: boolean;
  pressed?: boolean;
}
