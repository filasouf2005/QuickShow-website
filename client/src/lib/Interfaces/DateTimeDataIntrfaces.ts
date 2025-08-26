// types/dateTime.ts

export interface DateTimeShow {
  time: string;   // ISO Date string
  showId: string;
}

// Record<string, DateTimeShow[]>
// يعني: object المفاتيح تبعو string (تاريخ) والقيمة مصفوفة من DateTimeShow
export interface DateTimeData {
  [date: string]: DateTimeShow[];
}
