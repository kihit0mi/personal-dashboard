'use client';

import { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addDays,
  subDays,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar';
import CalendarDayCell from './CalendarDayCell';
import { ChildrenStatus, DEFAULT_CHILDREN_STATUS } from '../../types/calendar';
import { normalizeChildrenStatus } from '../../lib/CalendarUtils';
import EventModal from './EventModal';

export default function CalendarGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getDay, updateChildrenStatus, addEvent } = useCalendar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState('');

  // click-drag across cells to paint custody status
  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<ChildrenStatus>(DEFAULT_CHILDREN_STATUS);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleOpenModal = (dateStr: string) => {
    setSelectedDateForModal(dateStr);
    setIsModalOpen(true);
  };

  const handleDragStart = (dateStr: string, currentStatus: ChildrenStatus) => {
    setIsDragging(true);
    const status = normalizeChildrenStatus(currentStatus);
    const nextStatus: ChildrenStatus =
      status === 'with-children' ? 'without-children' : 'with-children';
    setDragAction(nextStatus);
    updateChildrenStatus(dateStr, nextStatus);
  };

  const handleDragEnter = (dateStr: string) => {
    if (isDragging) {
      updateChildrenStatus(dateStr, dragAction);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // week starts monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const daysInGrid = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-amber-50 border border-amber-200/60 rounded-xl overflow-hidden shadow-sm select-none">
      <div className="flex items-center justify-between p-4 border-b border-amber-200/50">
        <h2 className="text-xl font-semibold text-stone-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-orange-50 rounded-lg text-stone-400 hover:text-orange-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-orange-50 rounded-lg text-stone-400 hover:text-orange-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-amber-200/50 bg-amber-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-stone-500 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[minmax(80px,auto)] md:auto-rows-[minmax(120px,auto)]">
        {daysInGrid.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const prevDateStr = format(subDays(date, 1), 'yyyy-MM-dd');
          const nextDateStr = format(addDays(date, 1), 'yyyy-MM-dd');

          const dayData = getDay(dateStr);
          const prevDayData = getDay(prevDateStr);
          const nextDayData = getDay(nextDateStr);

          return (
            <CalendarDayCell
              key={dateStr}
              date={date}
              dayData={dayData}
              prevStatus={normalizeChildrenStatus(prevDayData.childrenStatus)}
              nextStatus={normalizeChildrenStatus(nextDayData.childrenStatus)}
              isCurrentMonth={isSameMonth(date, monthStart)}
              isToday={isToday(date)}
              onDragStart={() => handleDragStart(dateStr, dayData.childrenStatus)}
              onDragEnter={() => handleDragEnter(dateStr)}
              onAddEventClick={handleOpenModal}
            />
          );
        })}
      </div>

      <EventModal
        isOpen={isModalOpen}
        dateStr={selectedDateForModal}
        onClose={() => setIsModalOpen(false)}
        onSave={addEvent}
      />
    </div>
  );
}
