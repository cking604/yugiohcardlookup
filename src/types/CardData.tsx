export interface CardData {
  id: number;
  name: string;
  type: string;
  desc: string;
  race: string;
  attribute: string;
  atk?: number;
  def?: number;
  level?: number;
  linkval?: number;
  card_images?: {image_url: string; image_url_small: string}[];
  card_sets?: {set_name: string}[];
  // [etc: string]:any;
}

export default CardData;
