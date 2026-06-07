'use server'; // runs on the server, called from client components via useCalendar

import { CalendarEvent, ChildrenStatus } from '../../types/calendar';
import { prisma } from '../../lib/prisma';

export async function toggleCustodyDayInDB(dateStr: string, status: ChildrenStatus) {
  try {
    // upsert = update if the date exists, insert if it does not
    const savedDay = await prisma.custodyDay.upsert({
      where: { date: dateStr },
      update: { status },
      create: { date: dateStr, status },
    });

    return { success: true, data: savedDay };
  } catch (error) {
    console.error('Failed to save custody day:', error);
    return { success: false, error: 'Failed to save to database' };
  }
}

export async function fetchCustodyDaysFromDB() {
  try {
    const days = await prisma.custodyDay.findMany();
    return { success: true, data: days };
  } catch (error) {
    console.error('Failed to fetch custody days:', error);
    return { success: false, data: [] };
  }
}

export async function fetchEventsFromDB() {
  try {
    const events = await prisma.calendarEvent.findMany();
    return { success: true, data: events };
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return { success: false, data: [] };
  }
}

export async function createEventInDB(eventData: Omit<CalendarEvent, 'id'>) {
  try {
    const newEvent = await prisma.calendarEvent.create({
      data: {
        date: eventData.date,
        title: eventData.title,
        type: eventData.type,
        requiresPacking: eventData.requiresPacking,
        packingNotes: eventData.packingNotes,
        pickupNotes: eventData.pickupNotes,
      },
    });
    return { success: true, data: newEvent };
  } catch (error) {
    console.error('Failed to create event:', error);
    return { success: false, error: 'Failed to save event' };
  }
}
