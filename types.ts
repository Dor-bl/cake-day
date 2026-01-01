export enum RelationType {
  FRIEND = 'Friend',
  FAMILY = 'Family',
  WORK = 'Work',
}

export interface Birthday {
  id: string;
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  relation: RelationType;
}

export interface BirthdayWithCalculations extends Birthday {
  daysRemaining: number;
  ageTurning: number;
  nextBirthdayDate: Date;
  isToday: boolean;
}