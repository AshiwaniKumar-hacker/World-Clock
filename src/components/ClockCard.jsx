import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useClock } from '../hooks/useClock';

export default function ClockCard({
  clock,
  use24Hour,
  onRemove,
  onSetAlarm,
  onClearAlarm,
}) {
  const { timeString, dateString } = useClock(clock.timezone, use24Hour);
  const [alarmInput, setAlarmInput] = useState(clock.alarmTime || '');
  const [isSetting, setIsSetting] = useState(false);

  const handleSetAlarm = () => {
    if (alarmInput) {
      onSetAlarm(clock.id, alarmInput);
      setIsSetting(false);
    }
  };

  const handleClear = () => {
    setAlarmInput('');
    onClearAlarm(clock.id);
    setIsSetting(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative group"
    >
      <div className="
        relative overflow-hidden
        bg-gradient-to-br from-white/[0.07] to-white/[0.02]
        backdrop-blur-2xl
        border border-amber-500/15
        rounded-2xl
        p-5
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        transition-all duration-300
        hover:border-amber-400/30
        hover:shadow-[0_12px_40px_rgba(251,191,36,0.08)]
      ">
        {/* Soft gold glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl drop-shadow-lg">{clock.flag}</span>
            <div>
              <h3 className="text-amber-50 font-semibold text-[17px] leading-tight tracking-tight">
                {clock.region}
              </h3>
              <p className="text-amber-200/50 text-sm font-medium">
                {clock.country}
              </p>
            </div>
          </div>

          <button
            onClick={() => onRemove(clock.id)}
            className="
              opacity-0 group-hover:opacity-100
              w-8 h-8 rounded-full
              bg-white/5 hover:bg-red-500/80
              text-white/50 hover:text-white
              flex items-center justify-center
              transition-all duration-200
              text-sm font-bold
              border border-white/10
            "
          >
            ✕
          </button>
        </div>

        {/* Digital Time */}
        <div className="relative mb-3">
          <div className="
            font-mono text-[2.1rem] font-semibold tracking-wider
            text-transparent bg-clip-text
            bg-gradient-to-r from-amber-200 via-white to-amber-100
          ">
            {timeString}
          </div>
          <div className="text-amber-100/40 text-sm mt-1.5 font-medium tracking-wide">
            {dateString}
          </div>
        </div>

        {/* Alarm Section */}
        <div className="relative mt-4 pt-4 border-t border-amber-500/10">
          {clock.alarmTime && !isSetting ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-sm animate-pulse">⏰</span>
                <span className="text-amber-300/90 text-sm font-medium">
                  Alarm: {clock.alarmTime}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsSetting(true)}
                  className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-amber-100/70 transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleClear}
                  className="text-xs px-2.5 py-1 rounded-md bg-red-500/15 hover:bg-red-500/30 text-red-300 transition"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={alarmInput}
                onChange={(e) => setAlarmInput(e.target.value)}
                className="
                  flex-1 bg-black/40 border border-amber-500/20
                  rounded-lg px-3 py-2
                  text-amber-50 text-sm
                  focus:outline-none focus:ring-2 focus:ring-amber-400/40
                  focus:border-amber-400/40
                "
              />
              <button
                onClick={handleSetAlarm}
                disabled={!alarmInput}
                className="
                  px-3.5 py-2 rounded-lg text-sm font-medium
                  bg-gradient-to-r from-amber-500/80 to-amber-600/80
                  hover:from-amber-400 hover:to-amber-500
                  disabled:opacity-40 disabled:cursor-not-allowed
                  text-black transition
                "
              >
                Set
              </button>
              {isSetting && (
                <button
                  onClick={() => {
                    setIsSetting(false);
                    setAlarmInput(clock.alarmTime || '');
                  }}
                  className="text-xs text-white/40 hover:text-white/70"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}