export enum EntityType {
  PERSON = "PERSON",
  ORGANIZATION = "ORGANIZATION",
  LOCATION = "LOCATION",
  CONSUMER_GOOD = "CONSUMER_GOOD",
  EVENT = "EVENT",
  NUMBER = "NUMBER",
  PRICE = "PRICE",
  OTHER = "OTHER",
}

export interface Entity {
  id: number;
  text: string;
  type: EntityType;
  salience: number;
  sentiment?: number;
}

export interface NERResult {
  annotated_text: string;
  entities: Entity[];
  overall_sentiment: {
    score: number;
    magnitude: number;
  };
}
