export interface Squawk {
  author: string;
  authorKey: SquawkerInstructorsKeys;
  message: string;
  date: number;
  timeTextContext?: string | undefined; //used to display message  dateDistance from now
}

export type SquawkerInstructorsKeys = keyof typeof SquawkerInstructors;

export enum SquawkerInstructors {
  key_asser = "Asser",
  key_cezanne = "Cezanne",
  key_jlin = "Jessica",
  key_lyla = "Lyla",
  key_nikita = "Nikita",
  key_test = "TestAccount",
}

export interface FollowingPreference {
  title: string;
  value: boolean;
  summaryOff: string;
  summaryOn: string;
  prefKey: SquawkerInstructorsKeys;
}
