import React, { useMemo, useState } from 'react';
import examDatesDefault, { ExamDate } from '../data/examDates';
import holidaysDefault, { HolidayRange } from '../data/holidays';

type Props = {
  year?: number;
  month?: number; // 1-12
  examDates?: ExamDate[];
  holidays?: HolidayRange[];
  backgroundImageUrl?: string;
};

const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function BeninCalendar({
  year: pYear,
  month: pMonth,
  examDates = examDatesDefault,
  holidays = holidaysDefault,
  backgroundImageUrl,
}: Props) {
  const now = new Date();
  const startYear = pYear ?? now.getFullYear();
  const startMonth = (pMonth ?? now.getMonth() + 1) - 1; // zero-indexed

  const [viewYear, setViewYear] = useState<number>(startYear);
  const [viewMonth, setViewMonth] = useState<number>(startMonth);

  const firstOfMonth = useMemo(() => new Date(viewYear, viewMonth, 1), [viewYear, viewMonth]);
  const lastOfMonth = useMemo(() => new Date(viewYear, viewMonth + 1, 0), [viewYear, viewMonth]);

  // Build grid starting Monday — JS getDay(): 0 (Sun) .. 6 (Sat)
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // 0 = Monday
  const totalDays = lastOfMonth.getDate();

  const cells: Array<{ date: Date | null }> = [];
  for (let i = 0; i < startOffset; i++) cells.push({ date: null });
  for (let d = 1; d <= totalDays; d++) cells.push({ date: new Date(viewYear, viewMonth, d) });

  // map exam dates into a lookup
  const examLookup: Record<string, ExamDate[]> = {};
  examDates.forEach((e) => {
    const key = e.date;
    (examLookup[key] ??= []).push(e);
  });

  const isWeekend = (date: Date) => {
    const dow = date.getDay();
    return dow === 0 || dow === 6; // Sunday(0) or Saturday(6)
  };

  const todayISO = toISO(now);

  const holidayRanges = holidays;

  const isInHoliday = (date: Date) => {
    const iso = toISO(date);
    return holidayRanges.some((r) => iso >= r.start && iso <= r.end);
  };

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-lg shadow-md p-4">
      {/* watermark background */}
      {backgroundImageUrl ? (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <span className="text-6xl font-serif text-gray-600">République du Bénin</span>
        </div>
      )}

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Calendrier scolaire</h3>
          <div className="flex items-center gap-2">
            <button onClick={goPrev} aria-label="Mois précédent" className="p-1 rounded hover:bg-gray-100">‹</button>
            <div className="text-sm text-gray-600">{firstOfMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
            <button onClick={goNext} aria-label="Mois suivant" className="p-1 rounded hover:bg-gray-100">›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-600 mb-1">
          {dayNames.map((dn) => (
            <div key={dn} className="font-medium">
              {dn}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((c, idx) => {
            if (!c.date) return <div key={`empty-${idx}`} className="h-20" />;
            const iso = toISO(c.date);
            const exams = examLookup[iso] ?? [];
            const weekend = isWeekend(c.date);
            const isToday = iso === todayISO;
            const inHoliday = isInHoliday(c.date);

            return (
              <div
                key={iso}
                className={`h-20 p-1 rounded border border-transparent relative overflow-hidden ${
                  inHoliday ? 'bg-gray-100' : weekend ? 'bg-gray-50' : 'bg-white'
                }`}
                aria-label={`Jour ${c.date.getDate()} ${c.date.toLocaleDateString()}`}
              >
                <div className="flex items-start justify-between">
                  <div className="text-sm font-medium">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        isToday ? 'bg-red-200 text-red-800' : 'text-gray-800'
                      }`}
                      style={isToday ? { backgroundColor: 'rgba(220,38,38,0.15)' } : undefined}
                    >
                      {c.date.getDate()}
                    </span>
                  </div>
                </div>

                <div className="absolute left-1 right-1 bottom-1 text-[10px]">
                  {exams.slice(0, 2).map((ex) => (
                    <div
                      key={ex.label}
                      className="bg-yellow-50 text-yellow-800 rounded px-1 py-0.5 mb-0.5 truncate"
                      title={ex.label}
                    >
                      {ex.type}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-sm text-gray-700">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-200 rounded-full inline-block" />
              <span>Aujourd'hui</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-200 rounded-full inline-block" />
              <span>Week-end</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-300 rounded-full inline-block" />
              <span>Congés / Vacances</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-100 rounded-full inline-block" />
              <span>Examens (CEP/BEPC/Baccalauréat)</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Dates d'examen connues</h4>
          <ul className="text-sm list-disc list-inside space-y-1">
            {examDates.length === 0 && <li>Aucune date connue</li>}
            {examDates.map((e) => (
              <li key={e.date}>
                <strong>{e.type}</strong> — {e.label ?? ''} : {new Date(e.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>

        {holidayRanges.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Vacances & jours fériés</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {holidayRanges.map((h) => (
                <li key={`${h.start}-${h.end}`}>
                  {h.label ?? 'Vacances'} — {new Date(h.start).toLocaleDateString()} à {new Date(h.end).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
