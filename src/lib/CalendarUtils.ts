import { getDay as getDayOfWeekNumber } from 'date-fns';
import {
  CalendarDay,
  CalendarEvent,
  ChildrenStatus,
  DEFAULT_CHILDREN_STATUS,
  GLOBAL_RECURRING_RULES,
} from '../types/calendar';

// maps legacy or invalid db values to the two statuses we use now
export function normalizeChildrenStatus(status: string): ChildrenStatus {
  return status === 'with-children' ? 'with-children' : 'without-children';
}

export interface CustodyCellStyle {
  bgColorClass: string;
  iconClass: string;
}

// cell color comes from this day plus yesterday and tomorrow, not from a stored "exchange" flag
export function getCustodyCellStyle(
  status: ChildrenStatus,
  prevStatus: ChildrenStatus,
  nextStatus: ChildrenStatus
): CustodyCellStyle {
  const isKidsDay = status === 'with-children';
  const prevIsKids = prevStatus === 'with-children';
  const nextIsKids = nextStatus === 'with-children';

  const defaultStyle: CustodyCellStyle = {
    bgColorClass: 'bg-amber-100/50 border-amber-200/40',
    iconClass: 'text-orange-300 opacity-20 group-hover:opacity-100',
  };

  const withKidsIcon = 'text-orange-700 bg-orange-100/50';

  if (isKidsDay) {
    if (!prevIsKids && nextIsKids) {
      // pickup day: block starts here
      return {
        bgColorClass: 'bg-gradient-to-br from-amber-100/50 to-orange-200 border-orange-200',
        iconClass: withKidsIcon,
      };
    }
    if (!prevIsKids && !nextIsKids) {
      // single with-children day surrounded by without-children days
      return {
        bgColorClass: 'bg-orange-100 border-orange-300',
        iconClass: 'text-orange-700 bg-orange-200',
      };
    }
    // middle of a with-children block, including the day before dropoff
    return {
      bgColorClass: 'bg-orange-200 border-orange-300',
      iconClass: withKidsIcon,
    };
  }

  if (prevIsKids) {
    // dropoff day: stored as without-children but yesterday was with-children
    return {
      bgColorClass: 'bg-gradient-to-br from-orange-200 to-amber-100/50 border-orange-200',
      iconClass: withKidsIcon,
    };
  }

  return defaultStyle;
}

// merges hardcoded weekly rules with one-off events from the db
export function resolveEventsForDay(
  date: Date,
  childrenStatus: ChildrenStatus,
  dbEvents: CalendarEvent[]
): string[] {
  const resolvedTitles: string[] = [];
  const dayOfWeek = getDayOfWeekNumber(date);
  const currentDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // date-fns uses 0 for sunday, our rules use 7

  GLOBAL_RECURRING_RULES.forEach((rule) => {
    if (rule.dayOfWeek === currentDayOfWeek && rule.targetStatus === childrenStatus) {
      resolvedTitles.push(rule.title);
    }
  });

  dbEvents.forEach((event) => {
    let titleString = event.title;

    if (event.requiresPacking && event.packingNotes) {
      titleString += ` 🎒 (Pack: ${event.packingNotes})`;
    }
    if (event.pickupNotes) {
      titleString += ` 🚗 (${event.pickupNotes})`;
    }

    resolvedTitles.push(titleString);
  });

  return resolvedTitles;
}

export function createEmptyDay(date: string): CalendarDay {
  return { date, childrenStatus: DEFAULT_CHILDREN_STATUS, events: [] };
}
