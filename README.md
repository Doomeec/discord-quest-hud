

```markdown
# 🎮 Discord Quest Control Panel (HUD & Automation)

A modular, feature-rich HUD and automation toolkit for completing Discord Quests with interactive visuals, custom layouts, audio effects, and cyber voice feedback.

---

## ⚠️ Experimental Features Notice (WIP)

Please note that certain features depend on third-party APIs and client capabilities:

- 🎙️ **Cyber Voice Assistant (Experimental):** Relies on the browser/Electron `window.speechSynthesis` API. Depending on your OS, Discord client build, or system sound permissions, voice output may not work consistently across all environments.
- 🎁 **Auto-Claim Rewards (Experimental):** The script attempts to automatically redeem promo codes via Discord API endpoints upon quest completion. Because Discord frequently changes reward endpoints, adds CAPTCHAs, or enforces platform-specific checks, automatic claiming may not work for every quest. If an auto-claim fails, you can always claim the reward manually from Discord's official Quest tab.

---

## ✨ Features

- 📐 **10 Unique HUD Layouts:**
  - `Classic` — Balanced and clean default overlay.
  - `Vertical` — Streamlined mobile/media format with rotated trackbar.
  - `Ribbon` — Ultra-wide compact dashboard banner.
  - `Slant` — Angular cockpit with clipped viewport.
  - `💧 Blob` — Morphing fluid organic container.
  - `🃏 Cascade` — Tilted 3D layered glass cards.
  - `🧊 Cube` — Minimalist square HUD widget.
  - `📼 Holo` — Sci-Fi cyber hologram with chromatic glitch scanlines.
  - `📺 Pip-Boy / CRT` — Retro-monochrome terminal with scanlines and phosphor styling.
  - `⬢ Mecha Hexagon` — Futuristic cockpit with an animated SVG hex reactor and transformable mini-core.

- 💎 **Window Geometry (Form Factors):**
  - Classic Rectangle, 📡 Radar / Mini-Sphere with circular SVG gauges, and 💎 Diamond faceted view.

- 🌐 **Bilingual Support (i18n):**
  - Instant toggle between **🇬🇧 English** and **🇷🇺 Russian** directly from the settings panel.
  - Automatically syncs text labels, notifications, and voice synthesis engines (`en-US` / `ru-RU`).

- ⚡ **Quest Automation Pipeline:**
  - **Auto-Enroll:** Automatically accepts newly available quests in one click.
  - **Task Handlers:** Automates `WATCH_VIDEO`, `PLAY_ON_DESKTOP`, `STREAM_ON_DESKTOP`, and `PLAY_ACTIVITY`.
  - **Task Queue:** View active, in-progress, and completed quests in real time.

- 🎨 **Visual Customization:**
  - **11 Themes:** Classic, Flame, Deep Space, Neon, Inferno, Abyss, Cyberpunk 2077, Valorant HUD, Matrix Code, Celestia, and Rainbow (Easter Egg).
  - **Live Wallpaper Support:** Use any custom `GIF`, `MP4`, or `WebM` video as a background.
  - **Frosted Glass Engine:** Real-time Blur and Opacity adjustment sliders.
  - **Dual Display Modes:** Background (under glass) or Top Visor (dedicated interactive screen).

- 🔊 **Procedural Web Audio FX:**
  - Built-in audio synthesizer using native Web Audio API (Sci-Fi button clicks and chimes with zero external assets).

- 🧲 **Magnetic Snapping (Drag & Drop):**
  - Smooth repositioning with automatic snap-to-edge docking.
  - Persists window coordinates and user preferences across sessions via `localStorage`.

- 🛡️ **Zero Interference (Shadow DOM):**
  - Built entirely inside an isolated `ShadowRoot`—widget styles will never leak into or conflict with Discord's UI.

---

## 🚀 Desktop Setup & How to Run

> **Why Discord PTB?**  
> Tasks like `PLAY_ON_DESKTOP` and `STREAM_ON_DESKTOP` require native desktop Discord modules (`DiscordNative`). Because standard Discord disables Developer Tools by default to prevent token-stealing exploits, it is recommended to use **Discord PTB** (Public Test Build).

### Step 1: Download Discord PTB

Choose the installer for your operating system:

- **Windows:** 📦 [Download Discord PTB (.exe)](https://discord.com/api/download/ptb?platform=win)
- **macOS:** 🍎 [Download Discord PTB (.dmg)](https://discord.com/api/download/ptb?platform=osx)
- **Linux (Debian / Ubuntu / Mint / Pop!_OS):** 🐧 [Download Discord PTB (.deb)](https://discord.com/api/download/ptb?platform=linux&format=deb)
  ```bash
  sudo apt install ./discord-ptb.deb

  - Linux (Arch Linux / Manjaro / Generic): 📁 Download Discord PTB (.tar.gz
    portable)
    (or install via AUR: yay -S discord-ptb)

Step 2: Enable Console (DevTools)

1.  Completely exit Discord PTB:
      - Windows: Right-click the tray icon near the taskbar clock ➔ Quit Discord
        PTB.
      - Linux: Run killall DiscordPTB or close it from your system tray.
2.  Open the configuration file settings.json:
      - Windows: Press Win + R, type %appdata%\discordptb and press Enter. Open
        settings.json with Notepad.
      - Linux: Open terminal and run:
        nano ~/.config/discordptb/settings.json
      - macOS: Open ~/Library/Application Support/discordptb/settings.json.
3.  Add the following line inside the curly brackets { ... }:
    "DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING": true
    (Ensure valid JSON formatting: add a comma , to preceding lines if
    necessary).
4.  Save the file and launch Discord PTB.

Step 3: Run the Script

1.  Press Ctrl + Shift + I (or Cmd + Option + I on macOS) to open Developer
    Tools.
2.  Navigate to the Console tab.
    Note: If Discord warns you with “Hold up! If someone told you to copy/paste
    something...”, type allow pasting into the console and press Enter.
3.  Open quest-control-panel.js, copy the entire code, paste it into the
    console, and press Enter.

⚙️ Controls & Shortcuts

| Action                   | Shortcut / Trigger                                         |
| :----------------------- | :--------------------------------------------------------- |
| **Move Panel**           | Click & drag the top header bar (snaps to screen edges)    |
| **Quick Settings**       | Click the **Gear icon (⚙️)** in the header                 |
| **Xbox Style Dashboard** | Click the **Three dots (⋮)** or **Sparkle icon**           |
| **Collapse / Expand**    | Click the **Minus icon (−)** to minimize to a micro-player |
| **Close Overlay**        | Click the **Cross icon (✕)** or invoke cleanup hook        |
| **Dismiss Dropdowns**    | Press **`Escape`** or click outside the menu               |

🌐 Language Notice (Why is it in Russian on first launch?)

Note: This project was originally created for personal use, which is why the
interface defaults to Russian when you run the script for the first time.

How to switch to English (in 2 clicks):

1.  Click the Gear icon (⚙️) in the top-right corner of the overlay to open
    Settings.
2.  Find the Interface Language (Язык интерфейса) setting.
3.  Click 🇬🇧 English and then hit Save (Сохранить) at the bottom.

Your language choice is saved locally and will remain in English for all future
launches!

💖 Credits & Acknowledgments

  - Discord Webpack Research: Core store hook methodology and quest tracking
    concepts inspired by research from aamiaa and the open-source Discord
    modding community.
  - HUD & UI Architecture: Visual design, 10 modular layouts, Shadow DOM
    structure, Xbox dashboard menu, Web Audio SFX, bilingual system, and
    automation pipeline developed by doomec.

⚠️ Disclaimer

This script is created strictly for educational and research purposes. Using
third-party scripts or modifying the Discord client violates the Discord Terms
of Service. Use at your own discretion.

