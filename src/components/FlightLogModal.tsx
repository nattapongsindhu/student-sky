'use client';

import React, { useState } from 'react';
import { Plane, Plus, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { FlightLabLog } from '@/types';

interface FlightLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogAdded?: () => void;
  courses: { id: string; course_code: string; name: string }[];
}

export default function FlightLogModal({
  isOpen,
  onClose,
  onLogAdded,
  courses,
}: FlightLogModalProps) {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [flightDate, setFlightDate] = useState(new Date().toISOString().split('T')[0]);
  const [aircraftType, setAircraftType] = useState('Cessna 172S');
  const [tailNumber, setTailNumber] = useState('N721GC');
  const [airportCode, setAirportCode] = useState('KPOC');
  const [dualHours, setDualHours] = useState('1.5');
  const [soloHours, setSoloHours] = useState('0.0');
  const [simHours, setSimHours] = useState('0.0');
  const [maneuvers, setManeuvers] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dual = parseFloat(dualHours) || 0;
    const solo = parseFloat(soloHours) || 0;
    const sim = parseFloat(simHours) || 0;
    const totalFlight = dual + solo;

    try {
      await supabase.from('flight_lab_logs').insert({
        course_id: courseId || courses[0]?.id,
        title: title || 'Flight Sortie',
        flight_date: flightDate,
        aircraft_type: aircraftType,
        tail_number: tailNumber,
        airport_code: airportCode,
        flight_hours: totalFlight,
        dual_hours: dual,
        solo_hours: solo,
        sim_hours: sim,
        maneuvers_covered: maneuvers,
        instructor_remarks: remarks,
        status: 'completed',
      });

      if (onLogAdded) onLogAdded();
      onClose();
    } catch (err) {
      console.error('Failed to log flight entry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <Plane className="h-5 w-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-gray-900">Log Pilot Training Sortie</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-sm">
          <div>
            <label className="block font-medium text-gray-700">Sortie Title / Objective</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cross-Country Navigation & Emergency Descents"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-gray-700">Date</label>
              <input
                type="date"
                required
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Aircraft / Sim</label>
              <select
                value={aircraftType}
                onChange={(e) => setAircraftType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 focus:border-sky-500 focus:outline-none bg-white"
              >
                <option value="Cessna 172S">Cessna 172S (G1000/Analog)</option>
                <option value="Piper Arrow">Piper Arrow (Complex)</option>
                <option value="Simulator (Redbird)">Redbird FMX Simulator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-gray-700">Dual Received</label>
              <input
                type="number"
                step="0.1"
                value={dualHours}
                onChange={(e) => setDualHours(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Solo Flight</label>
              <input
                type="number"
                step="0.1"
                value={soloHours}
                onChange={(e) => setSoloHours(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Sim Hours</label>
              <input
                type="number"
                step="0.1"
                value={simHours}
                onChange={(e) => setSimHours(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Maneuvers / Airspace Covered</label>
            <input
              type="text"
              value={maneuvers}
              onChange={(e) => setManeuvers(e.target.value)}
              placeholder="e.g. Steep turns, slow flight, power-on stalls, KPOC Class D departure"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">CFI Remarks / Self Notes</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Feedback on airspeed control and landing flair"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-sky-600 px-4 py-1.5 text-white font-medium hover:bg-sky-700 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Sortie Log'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
