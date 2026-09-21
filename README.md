

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

### Step 1: Download Discord PTB

Choose the installer for your operating system:

- **Windows:** 📦 [Download Discord PTB (.exe)](https://discord.com/api/download/ptb?platform=win)
- **macOS:** 🍎 [Download Discord PTB (.dmg)](https://discord.com/api/download/ptb?platform=osx)
- **Linux (Debian / Ubuntu / Mint / Pop!_OS):** 🐧 [Download Discord PTB (.deb)](https://discord.com/api/download/ptb?platform=linux&format=deb) — install via `sudo apt install ./discord-ptb.deb`
- **Linux (Arch Linux / Manjaro / Generic):** 📁 [Download Discord PTB (.tar.gz portable)](https://discord.com/api/download/ptb?platform=linux&format=tar.gz) — or via AUR: `yay -S discord-ptb`

 
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


---

# 🎮 Discord Quest Control Panel (HUD & Automation) (гайд для русскоговорящих)

Модульный и многофункциональный оверлей (HUD) и инструмент автоматизации для прохождения Discord Quests с интерактивной визуализацией, настраиваемыми макетами, звуковыми эффектами и кибер-голосовым сопровождением.

---

## ⚠️ Уведомление об экспериментальных функциях (WIP)

Обратите внимание, что некоторые функции зависят от сторонних API и возможностей вашего клиента:

* 🎙️ **Кибер-голосовой помощник (Экспериментально):** Работает на базе API `window.speechSynthesis` браузера или Electron. В зависимости от вашей ОС, сборки Discord или настроек аудиоинтерфейса, голосовое сопровождение может работать нестабильно в некоторых системах.
* 🎁 **Авто-забор наград (Экспериментально):** Скрипт пытается автоматически активировать промокоды через эндпоинты Discord API сразу после завершения квеста. Поскольку Discord регулярно обновляет эндпоинты, добавляет капчу или вводит платформенные ограничения, автоматическое получение наград может срабатывать не всегда. В случае ошибки вы всегда можете забрать награду вручную на официальной вкладке Квестов в Discord.

---

## ✨ Возможности

* 📐 **10 уникальных макетов HUD:**
* `Classic` — Сбалансированный и чистый интерфейс по умолчанию.
* `Vertical` — Компактный вертикальный формат с повернутым трекбаром.
* `Ribbon` — Ультраширокая компактная панель-баннер.
* `Slant` — Угловая кабина пилота с кадрированным обзором.
* `💧 Blob` — Органический плавающий контейнер с плавными формами.
* `🃏 Cascade` — Наклонные 3D-карточки из многослойного стекла.
* `🧊 Cube` — Минималистичный квадратный HUD-виджет.
* `📼 Holo` — Сай-фай голограмма с хроматическими глитч-эффектами и сканирующими линиями.
* `📺 Pip-Boy / CRT` — Ретро-монохромный терминал со сканирующими линиями и эффектом люминофора.
* `⬢ Mecha Hexagon` — Футуристический интерфейс с анимированным SVG-реактором и трансформируемым мини-ядром.


* 💎 **Геометрия окон (Форм-факторы):**
* Классический прямоугольник, 📡 Радар / Мини-сфера с круглыми SVG-индикаторами и 💎 Ограненный ромб.


* 🌐 **Двуязычная поддержка (i18n):**
* Мгновенное переключение между **🇬🇧 English** и **🇷🇺 Русский** прямо из панели настроек.
* Автоматическая синхронизация текстовых меток, уведомлений и синтезатора речи (`en-US` / `ru-RU`).


* ⚡ **Конвейер автоматизации квестов:**
* **Авто-принятие:** Автоматическое принятие новых доступных квестов в один клик.
* **Обработчики задач:** Автоматизация квестов типа `WATCH_VIDEO`, `PLAY_ON_DESKTOP`, `STREAM_ON_DESKTOP` и `PLAY_ACTIVITY`.
* **Очередь задач:** Просмотр активных, выполняемых и завершенных квестов в реальном времени.


* 🎨 **Визуальная кастомизация:**
* **11 тем оформления:** Classic, Flame, Deep Space, Neon, Inferno, Abyss, Cyberpunk 2077, Valorant HUD, Matrix Code, Celestia и Rainbow (пасхалка).
* **Поддержка живых обоев:** Использование любого кастомного `GIF`, `MP4` или `WebM` видео в качестве фона.
* **Движок матового стекла:** Настройка размытия (Blur) и прозрачности (Opacity) в реальном времени.
* **Два режима отображения:** Фон (под стеклом) или Верхнее забрало (выделенный интерактивный экран).


* 🔊 **Процедурный Web Audio FX:**
* Встроенный аудиосинтезатор на базе Web Audio API (сай-фай клики и звуковые сигналы без внешних файлов).


* 🧲 **Магнитная привязка (Drag & Drop):**
* Плавное перемещение с автоматическим прилипанием к краям экрана.
* Сохранение координат окна и настроек пользователя между сессиями через `localStorage`.


* 🛡️ **Полная изоляция (Shadow DOM):**
* Создан полностью внутри изолированного `ShadowRoot` — стили виджета никогда не испортят и не конфликтнут с интерфейсом Discord.



---

## 🚀 Установка на ПК и запуск

> **Почему именно Discord PTB?**
> Для выполнения задач вроде `PLAY_ON_DESKTOP` и `STREAM_ON_DESKTOP` требуются нативные модули Discord (`DiscordNative`). В стандартном клиенте Discord Инструменты разработчика (DevTools) отключены по умолчанию в целях безопасности, поэтому рекомендуется использовать **Discord PTB** (Public Test Build).

### Шаг 1: Скачайте Discord PTB

Выберите установочный файл для вашей операционной системы:

* **Windows:** 📦 [Скачать Discord PTB (.exe)](https://discord.com/api/download/ptb?platform=win&utm_source=gemini)
* **macOS:** 🍎 [Скачать Discord PTB (.dmg)](https://discord.com/api/download/ptb?platform=osx&utm_source=gemini)
* **Linux (Debian / Ubuntu / Mint / Pop!_OS):** 🐧 [Скачать Discord PTB (.deb)](https://discord.com/api/download/ptb?platform=linux&format=deb&utm_source=gemini) — установка через `sudo apt install ./discord-ptb.deb`
* **Linux (Arch Linux / Manjaro / Generic):** 📁 [Скачать Discord PTB (.tar.gz portable)](https://discord.com/api/download/ptb?platform=linux&format=tar.gz&utm_source=gemini) — или через AUR: `yay -S discord-ptb`

---

### Шаг 2: Включите консоль (DevTools)

1. Полностью закройте Discord PTB:
* **Windows:** Нажмите правой кнопкой мыши по иконке в трее возле часов ➔ Quit Discord PTB.
* **Linux:** Выполните команду `killall DiscordPTB` или закройте приложение через системный трей.


2. Откройте файл конфигурации `settings.json`:
* **Windows:** Нажмите `Win + R`, введите `%appdata%\discordptb` и нажмите `Enter`. Откройте `settings.json` с помощью Блокнота.
* **Linux:** Откройте терминал и выполните:
`nano ~/.config/discordptb/settings.json`
* **macOS:** Откройте `~/Library/Application Support/discordptb/settings.json`.


3. Добавьте следующую строчку внутри фигурных скобок `{ ... }`:
`"DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING": true`
*(Убедитесь в корректности формата JSON: поставьте запятую `,` на предыдущей строке, если это необходимо).*
4. Сохраните файл и запустите Discord PTB.

---

### Шаг 3: Запустите скрипт

1. Нажмите `Ctrl + Shift + I` (или `Cmd + Option + I` на macOS), чтобы открыть Инструменты разработчика.
2. Перейдите на вкладку **Console**.
*Примечание: Если Discord выведет предупреждение «Hold up! If someone told you to copy/paste...», введите `allow pasting` в консоль и нажмите Enter.*
3. Откройте файл `quest-control-panel.js`, скопируйте весь код, вставьте его в консоль и нажмите `Enter`.

---

## ⚙️ Управление и горячие клавиши

| Действие | Сочетание / Триггер |
| --- | --- |
| **Перемещение панели** | Зажмите и перетащите верхнюю шапку (прилипает к краям) |
| **Быстрые настройки** | Нажмите на **Шестеренку (⚙️)** в шапке |
| **Дашборд в стиле Xbox** | Нажмите на **Троеточие (⋮)** или **Иконку со звездочками** |
| **Свернуть / Развернуть** | Нажмите на **Минус (−)** для сворачивания в микро-плеер |
| **Закрыть оверлей** | Нажмите на **Крестик (✕)** или вызовите функцию очистки |
| **Закрыть меню** | Нажмите **`Escape`** или кликните вне области меню |

---

## 🌐 Уведомление о языке (Почему на русском при первом запуске?)

Проект изначально разрабатывался для личного использования, поэтому интерфейс по умолчанию запускается на русском языке.

**Как переключить на английский (в 2 клика):**

1. Нажмите на иконку Шестеренки (⚙️) в правом верхнем углу оверлея, чтобы открыть **Настройки**.
2. Найдите пункт **Язык интерфейса (Interface Language)**.
3. Выберите **🇬🇧 English** и нажмите кнопку **Сохранить (Save)** внизу.

Ваш выбор сохранится локально и останется на английском при всех последующих запусках!

---

## 💖 Благодарности и авторы

* **Исследования Discord Webpack:** Идея перехвата сторов и концепция отслеживания квестов вдохновлены исследованиями `aamiaa` и open-source сообществом моддинга Discord.
* **Архитектура HUD и UI:** Визуальный дизайн, 10 модульных макетов, структура Shadow DOM, меню Xbox-дашборда, Web Audio SFX, двуязычная система и конвейер автоматизации разработаны `doomec`.

---

## ⚠️ Отказ от ответственности

Этот скрипт создан исключительно в образовательных и исследовательских целях. Использование сторонних скриптов или модификация клиента Discord нарушает Условия использования Discord (Terms of Service). Используйте на свой страх и риск.
