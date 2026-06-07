// shared types for the calendar tab

// pickup day is with-children, dropoff day is without-children
export type ChildrenStatus = 'with-children' | 'without-children';

// days with no db row use this
export const DEFAULT_CHILDREN_STATUS: ChildrenStatus = 'without-children';

export type EventType = 'appointment' | 'school' | 'logistics' | 'other';

export interface CalendarEvent {
  id: string;
  date: string; // yyyy-mm-dd, same key as custody days
  title: string;
  type: EventType;
  requiresPacking?: boolean;
  packingNotes?: string | null;
  pickupNotes?: string | null;
}

// one object per date, built from custody + events tables
export interface CalendarDay {
  date: string;
  childrenStatus: ChildrenStatus;
  events: CalendarEvent[];
}

export interface RecurringRule {
  id: string;
  title: string;
  dayOfWeek: number; // 1 = monday, matches the grid
  targetStatus: ChildrenStatus; // only shows when custody status matches
}

// weekly events that are not stored in the db yet
export const GLOBAL_RECURRING_RULES: RecurringRule[] = [
  {
    id: 'rule-bosco',
    title: 'Don Bosco',
    dayOfWeek: 3,
    targetStatus: 'without-children',
  },
  {
    id: 'rule-piano',
    title: 'Piano Lesson',
    dayOfWeek: 4,
    targetStatus: 'with-children',
  },
  {
    id: 'rule-flute',
    title: 'Flute Lesson',
    dayOfWeek: 2,
    targetStatus: 'with-children',
  },
  {
    id: 'rule-bela',
    title: 'Fotbal Bělá',
    dayOfWeek: 5,
    targetStatus: 'without-children',
  },
  {
    id: 'rule-library',
    title: 'Library',
    dayOfWeek: 5,
    targetStatus: 'with-children',
  },
];
