import { useState } from 'react';
import { X } from 'lucide-react';
import { CalendarEvent, EventType } from '../../types/calendar';

interface EventModalProps {
  isOpen: boolean;
  dateStr: string;
  onClose: () => void;
  onSave: (eventData: Omit<CalendarEvent, 'id'>) => Promise<void>;
}

// form for one-off events, saved to calendar_events table
export default function EventModal({ isOpen, dateStr, onClose, onSave }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('other');
  const [requiresPacking, setRequiresPacking] = useState(false);
  const [packingNotes, setPackingNotes] = useState('');
  const [pickupNotes, setPickupNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    await onSave({
      date: dateStr,
      title,
      type,
      requiresPacking,
      packingNotes: requiresPacking ? packingNotes : null,
      pickupNotes: pickupNotes || null,
    });

    setIsSaving(false);
    setTitle('');
    setRequiresPacking(false);
    setPackingNotes('');
    setPickupNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-rose-100">
        <div className="flex justify-between items-center p-4 border-b border-rose-100 bg-rose-50">
          <h3 className="text-lg font-semibold text-slate-800">Add Event for {dateStr}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dentist Appointment"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Logistics / Pickup Details
            </label>
            <input
              type="text"
              value={pickupNotes}
              onChange={(e) => setPickupNotes(e.target.value)}
              placeholder="e.g., Grandmother picking up the girls at 15:00"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
            <input
              type="checkbox"
              id="packing"
              checked={requiresPacking}
              onChange={(e) => setRequiresPacking(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
            />
            <label htmlFor="packing" className="text-sm font-medium text-slate-700">
              Requires Packing for School/Activities?
            </label>
          </div>

          {requiresPacking && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-medium text-slate-700 mb-1">What to pack:</label>
              <input
                required
                type="text"
                value={packingNotes}
                onChange={(e) => setPackingNotes(e.target.value)}
                placeholder="e.g., P.E. kit, flute, extra snacks"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900"
              />
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
