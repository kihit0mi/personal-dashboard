import { useState, useEffect } from 'react';
import { CalendarDay, ChildrenStatus, CalendarEvent } from '../../types/calendar';
import { createEmptyDay, normalizeChildrenStatus } from '../../lib/CalendarUtils';
import {
  toggleCustodyDayInDB,
  fetchCustodyDaysFromDB,
  fetchEventsFromDB,
  createEventInDB,
} from '../../app/actions/calendarActions';

// holds the calendar month in memory, keyed by yyyy-mm-dd
export function useCalendar() {
  const [daysMap, setDaysMap] = useState<Record<string, CalendarDay>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [daysResult, eventsResult] = await Promise.all([
        fetchCustodyDaysFromDB(),
        fetchEventsFromDB(),
      ]);

      const loadedMap: Record<string, CalendarDay> = {};

      if (daysResult.success && daysResult.data) {
        daysResult.data.forEach((dbDay) => {
          loadedMap[dbDay.date] = {
            date: dbDay.date,
            childrenStatus: normalizeChildrenStatus(dbDay.status),
            events: [],
          };
        });
      }

      if (eventsResult.success && eventsResult.data) {
        eventsResult.data.forEach((dbEvent) => {
          // event on a date with no custody row still needs a day object
          if (!loadedMap[dbEvent.date]) {
            loadedMap[dbEvent.date] = createEmptyDay(dbEvent.date);
          }
          loadedMap[dbEvent.date].events.push(dbEvent as CalendarEvent);
        });
      }

      setDaysMap(loadedMap);
      setIsLoading(false);
    }

    loadData();
  }, []);

  const getDay = (dateStr: string): CalendarDay => {
    return daysMap[dateStr] || createEmptyDay(dateStr);
  };

  const updateChildrenStatus = async (dateStr: string, status: ChildrenStatus) => {
    // update ui first so drag-painting feels instant
    setDaysMap((prevMap) => {
      const existingDay = prevMap[dateStr] || createEmptyDay(dateStr);
      return {
        ...prevMap,
        [dateStr]: { ...existingDay, childrenStatus: status },
      };
    });

    const result = await toggleCustodyDayInDB(dateStr, status);

    if (!result.success) {
      console.error('Database sync failed!');
    }
  };

  const addEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    const result = await createEventInDB(eventData);

    if (result.success && result.data) {
      setDaysMap((prev) => {
        const day = prev[eventData.date] || createEmptyDay(eventData.date);
        return {
          ...prev,
          [eventData.date]: {
            ...day,
            events: [...day.events, result.data as CalendarEvent],
          },
        };
      });
    }
  };

  return {
    getDay,
    updateChildrenStatus,
    addEvent,
    isLoading,
  };
}
