# 🌍 World Clock Widget

A beautiful, production-ready **World Clock Desktop Widget** built with React + Electron.

Features a modern glass-morphism UI, real-time multi-timezone clocks, per-clock alarms with desktop notifications, localStorage persistence, and true always-on-top frameless widget mode.

---

## ✨ Features

- **Up to 6 simultaneous clocks** from 17+ countries
- Real-time updates every second (HH:MM:SS + full date)
- Cascading Country → Region timezone selector
- Per-clock alarms with browser notifications + subtle beep
- 12h / 24h format toggle
- Persistent storage (localStorage)
- Frameless, transparent, always-on-top Electron window
- Custom title bar with minimize / close
- Smooth add/remove animations
- Glass-morphism dark theme

---

## 🛠 Tech Stack

| Layer          | Technology              |
|----------------|-------------------------|
| UI             | React 18 + Hooks        |
| Styling        | Tailwind CSS            |
| Time handling  | moment-timezone         |
| Desktop        | Electron 28             |
| Build          | react-scripts + electron-builder |

---

## 📦 Project Structure

```
world-clock-widget/
├── electron/
│   ├── main.js          # Electron main process (frameless + alwaysOnTop)
│   └── preload.js       # Secure bridge to renderer
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ClockCard.jsx
│   │   ├── AddTimezone.jsx
│   │   └── AlarmManager.jsx
│   ├── data/
│   │   └── timezoneData.js   # 17 countries + regions + IANA zones
│   ├── hooks/
│   │   └── useClock.js       # Real-time clock + state manager
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
cd world-clock-widget
npm install
```

### 2. Run in development (React + Electron)

```bash
npm run dev
```

This will:
- Start the React development server on `http://localhost:3000`
- Launch Electron once the server is ready
- Enable hot-reload for the React side

### 3. Build for production

```bash
# Create optimized React build
npm run build

# Package the desktop app
npm run package
```

Packaged apps will appear in the `dist/` folder.

Platform-specific:

```bash
npm run package-win
npm run package-mac
npm run package-linux
```

---

## 🎮 Usage

1. Click **＋ Add Timezone**
2. Select a **Country**, then a **State / Region**
3. Click **Add Clock**
4. Hover a card to reveal the **✕** remove button
5. Use the time input + **Set** button on any card to create an alarm
6. Toggle **12H / 24H** in the title bar
7. The window stays always-on-top and can be dragged by the title bar

---

## 🔔 Alarms & Notifications

- Alarms are checked every second
- When the current time in that timezone matches the set alarm, a system notification is shown
- A short soft beep is also played (via Web Audio API)
- Alarms fire only once per day (resets at midnight)
- You will be asked for notification permission the first time the app runs

---

## 🎨 Customization Tips

- **More countries**: Edit `src/data/timezoneData.js`
- **Max clocks**: Change `MAX_CLOCKS` inside `src/hooks/useClock.js`
- **Window size / alwaysOnTop**: Edit `electron/main.js`
- **Colors / glass effect**: Modify Tailwind classes or `tailwind.config.js`

---

## 🐞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Electron window is blank | Make sure you ran `npm run build` before packaging, or use `npm run dev` |
| Notifications don’t appear | Check OS notification settings + grant permission when prompted |
| “Max clocks reached” | Delete an existing clock first (hover → ✕) |
| Transparent background not working | Some Linux compositors need extra flags – try adding `app.disableHardwareAcceleration()` temporarily |

---

## 📄 License

MIT – feel free to use, modify, and ship.

---

Made with ❤️ for people who live across timezones.
