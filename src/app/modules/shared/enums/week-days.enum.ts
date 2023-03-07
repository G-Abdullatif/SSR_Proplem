export enum WeekDaysEnum {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 0
}

export class WeekDaysArr {

    public static values() {
      return Object.keys(WeekDaysEnum).filter(
        (type) => isNaN(type as any) && type !== 'values'
      );
    }
  }
