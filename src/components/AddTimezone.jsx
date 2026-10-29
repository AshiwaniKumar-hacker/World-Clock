import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { timezoneData } from '../data/timezoneData';

export default function AddTimezone({ onAdd, canAddMore, currentCount, maxClocks }) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const countries = useMemo(
    () => timezoneData.map((c) => ({ name: c.country, flag: c.flag })),
    []
  );

  const regions = useMemo(() => {
    if (!selectedCountry) return [];
    const country = timezoneData.find((c) => c.country === selectedCountry);
    return country ? country.regions : [];
  }, [selectedCountry]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedRegion('');
  };

  const handleAdd = () => {
    if (!selectedCountry || !selectedRegion) return;

    const countryData = timezoneData.find((c) => c.country === selectedCountry);
    const regionData = countryData.regions.find((r) => r.name === selectedRegion);

    if (countryData && regionData) {
      onAdd(
        countryData.country,
        regionData.name,
        regionData.timezone,
        countryData.flag
      );
      setSelectedCountry('');
      setSelectedRegion('');
      setIsOpen(false);
    }
  };

  if (!canAddMore) {
    return (
      <div className="
        bg-amber-500/10 border border-amber-500/25
        rounded-xl px-4 py-3 text-center
        text-amber-200/90 text-sm font-medium
      ">
        Maximum of {maxClocks} clocks reached
      </div>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="add-btn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onClick={() => setIsOpen(true)}
            className="
              w-full py-3.5 rounded-xl
              bg-gradient-to-r from-amber-500/20 to-amber-600/20
              hover:from-amber-500/30 hover:to-amber-600/30
              text-amber-100 font-semibold text-sm
              border border-amber-500/25
              shadow-[0_4px_20px_rgba(251,191,36,0.08)]
              transition-all duration-300
              hover:scale-[1.01] active:scale-[0.99]
              flex items-center justify-center gap-2
            "
          >
            <span className="text-lg">＋</span>
            Add City ({currentCount}/{maxClocks})
          </motion.button>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="
              bg-gradient-to-br from-white/[0.08] to-white/[0.02]
              backdrop-blur-2xl
              border border-amber-500/20
              rounded-2xl p-5
              shadow-[0_12px_40px_rgba(0,0,0,0.4)]
            "
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-amber-50 font-semibold text-sm">Add New City</h4>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedCountry('');
                  setSelectedRegion('');
                }}
                className="text-amber-200/50 hover:text-amber-100 text-sm transition"
              >
                Cancel
              </button>
            </div>

            <label className="block text-amber-200/50 text-xs mb-1.5 font-medium">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="
                w-full mb-3 bg-black/50 border border-amber-500/20
                rounded-lg px-3 py-2.5
                text-amber-50 text-sm
                focus:outline-none focus:ring-2 focus:ring-amber-400/40
                appearance-none cursor-pointer
              "
            >
              <option value="" className="bg-[#0d1324]">Select country…</option>
              {countries.map((c) => (
                <option key={c.name} value={c.name} className="bg-[#0d1324]">
                  {c.flag} {c.name}
                </option>
              ))}
            </select>

            <label className="block text-amber-200/50 text-xs mb-1.5 font-medium">
              City
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              disabled={!selectedCountry}
              className="
                w-full mb-4 bg-black/50 border border-amber-500/20
                rounded-lg px-3 py-2.5
                text-amber-50 text-sm
                focus:outline-none focus:ring-2 focus:ring-amber-400/40
                disabled:opacity-40 disabled:cursor-not-allowed
                appearance-none cursor-pointer
              "
            >
              <option value="" className="bg-[#0d1324]">Select city…</option>
              {regions.map((r) => (
                <option key={r.name} value={r.name} className="bg-[#0d1324]">
                  {r.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAdd}
              disabled={!selectedCountry || !selectedRegion}
              className="
                w-full py-2.5 rounded-lg
                bg-gradient-to-r from-amber-500 to-amber-600
                hover:from-amber-400 hover:to-amber-500
                disabled:from-white/10 disabled:to-white/5 disabled:text-white/40
                text-black font-semibold text-sm
                transition-all
              "
            >
              Add City
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}