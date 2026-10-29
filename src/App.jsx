import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClocksManager } from './hooks/useClock';
import ClockCard from './components/ClockCard';
import AddTimezone from './components/AddTimezone';
import AlarmManager from './components/AlarmManager';

function App() {
  const {
    clocks,
    use24Hour,
    maxClocks,
    canAddMore,
    addClock,
    removeClock,
    setAlarm,
    clearAlarm,
    toggle24Hour,
  } = useClocksManager();

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleMinimize = () => window.electronAPI?.minimize();
  const handleClose = () => window.electronAPI?.close();

  return (
    <div className="h-full w-full flex flex-col bg-[#0c0c0f]"> {/* Background dark kar diya taaki text dikhe */}
      {/* Title Bar */}
      <div className="electron-drag flex items-center justify-between px-5 py-3 bg-[#0c0c0f] border-b border-white/5 select-none z-50 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
          <span className="text-white/90 text-sm font-medium tracking-wide">World Clock</span>
          <span className="text-white/30 text-xs">{clocks.length}/{maxClocks}</span>
        </div>

        <div className="electron-no-drag flex items-center gap-1.5">
          <button
            onClick={toggle24Hour}
            className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition font-medium"
          >
            {use24Hour ? '24H' : '12H'}
          </button>
          <button onClick={handleMinimize} className="w-7 h-7 rounded-md hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition text-sm">−</button>
          <button onClick={handleClose} className="w-7 h-7 rounded-md hover:bg-red-500/80 text-white/50 hover:text-white flex items-center justify-center transition text-sm">✕</button>
        </div>
      </div>

      {/* Main Content */}
      {/* overflow-hidden hata diya aur relative z-10 lagaya */}
      <div className="flex-1 bg-[#0c0c0f] relative z-10">
        <div className="h-full flex flex-col p-4 gap-3">
          
          {/* AddTimezone ko z-20 diya taaki baaki cheezon ke upar dikhe */}
          <div className="relative z-20">
            <AddTimezone
              onAdd={addClock}
              canAddMore={canAddMore}
              currentCount={clocks.length}
              maxClocks={maxClocks}
            />
          </div>

          <AlarmManager clocks={clocks} onClearAlarm={clearAlarm} />

          <div className="flex-1 overflow-y-auto clock-scroll relative z-10">
            <AnimatePresence mode="popLayout">
              {clocks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center pt-10"
                >
                  <div className="text-5xl mb-4 opacity-30">🌍</div>
                  <p className="text-white/60 text-sm font-medium">No clocks added</p>
                  <p className="text-white/40 text-xs mt-1">Select a city to begin</p>
                </motion.div>
              ) : (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-2">
                  {clocks.map((clock) => (
                    <ClockCard
                      key={clock.id}
                      clock={clock}
                      use24Hour={use24Hour}
                      onRemove={removeClock}
                      onSetAlarm={setAlarm}
                      onClearAlarm={clearAlarm}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;