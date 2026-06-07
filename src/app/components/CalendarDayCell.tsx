import { format } from 'date-fns';
import { Baby, Plus } from 'lucide-react';
import { CalendarDay, ChildrenStatus } from '../../types/calendar';
import {
  getCustodyCellStyle,
  normalizeChildrenStatus,
  resolveEventsForDay,
} from '../../lib/CalendarUtils';

interface CalendarDayCellProps {
  date: Date;
  dayData: CalendarDay;
  prevStatus: ChildrenStatus; // yesterday, used for gradient
  nextStatus: ChildrenStatus; // tomorrow, used for gradient
  isCurrentMonth: boolean;
  isToday: boolean;
  onDragStart: () => void;
  onDragEnter: () => void;
  onAddEventClick: (dateStr: string) => void;
}

export default function CalendarDayCell({
  date,
  dayData,
  prevStatus,
  nextStatus,
  isCurrentMonth,
  isToday,
  onDragStart,
  onDragEnter,
  onAddEventClick,
}: CalendarDayCellProps) {
  const status = normalizeChildrenStatus(dayData.childrenStatus);
  const prev = normalizeChildrenStatus(prevStatus);
  const next = normalizeChildrenStatus(nextStatus);
  const { bgColorClass, iconClass } = getCustodyCellStyle(status, prev, next);
  const displayEvents = resolveEventsForDay(date, status, dayData.events);

  return (
    <div
      onMouseDown={onDragStart}
      onMouseEnter={onDragEnter}
      className={`
        border-b border-r p-2 flex flex-col relative group transition-all duration-200 cursor-pointer hover:brightness-110 min-h-[100px]
        ${!isCurrentMonth ? 'opacity-30 grayscale' : ''}
        ${bgColorClass}
      `}
    >
      <div className="flex justify-between items-start pointer-events-none">
        <span
          className={`
          text-sm w-7 h-7 flex items-center justify-center rounded-full
          ${isToday ? 'bg-rose-500 text-white font-bold shadow-md' : 'text-slate-600 font-medium'}
        `}
        >
          {format(date, 'd')}
        </span>

        <div className="flex space-x-1 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation(); // mousedown on the cell toggles custody, so the + button must not bubble
              onAddEventClick(dayData.date);
            }}
            className="p-1 rounded-md text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-white/50 hover:text-rose-600 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className={`p-1.5 rounded-md transition-all ${iconClass}`}>
            <Baby className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-2 flex flex-col gap-1 overflow-y-auto pointer-events-none">
        {displayEvents.map((eventTitle, idx) => (
          <div
            key={idx}
            className="text-[10px] leading-tight font-medium bg-white/60 text-slate-800 px-1.5 py-0.5 rounded border border-white/40 truncate"
          >
            {eventTitle}
          </div>
        ))}
      </div>
    </div>
  );
}
