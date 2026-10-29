import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AlarmManager({ clocks, onClearAlarm }) {
  const activeAlarms = clocks.filter((c) => c.alarmTime);

  return (
    <AnimatePresence>
      {activeAlarms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="
            p-3.5 rounded-xl
            bg-gradient-to-r from-amber-500/10 to-amber-600/5
            border border-amber-500/20
            overflow-hidden
          "
        >
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-amber-400">⏰</span>
            <span className="text-amber-200 text-xs font-semibold uppercase tracking-wider">
              Active Alarms ({activeAlarms.length})
            </span>
          </div>
          <div className="space-y-1.5">
            {activeAlarms.map((clock) => (
              <div
                key={clock.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-amber-100/80">
                  {clock.flag} {clock.region} —{' '}
                  <span className="text-amber-300 font-mono">{clock.alarmTime}</span>
                </span>
                <button
                  onClick={() => onClearAlarm(clock.id)}
                  className="text-xs text-red-300/70 hover:text-red-300 px-2 py-0.5 rounded hover:bg-red-500/15 transition"
                >
                  Clear
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}