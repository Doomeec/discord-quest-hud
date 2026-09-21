delete window.$;

(function () {
  'use strict';

  // #region Cleanup
  if (window.__task_widget_cleanup__) {
    try { window.__task_widget_cleanup__(); } catch (e) {}
  }
  // #endregion

  // #region Discord Webpack Stores
  var ApplicationStreamingStore, RunningGameStore, QuestsStore, ChannelStore, GuildChannelStore, FluxDispatcher, api;
  var isDiscordConnected = false;
  var isApp = typeof DiscordNative !== "undefined";
  var supportedTasks = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"];

  try {
    var wpRequire = webpackChunkdiscord_app.push([[Symbol()], {}, function (r) { return r; }]);
    webpackChunkdiscord_app.pop();

    ApplicationStreamingStore = Object.values(wpRequire.c).find(function (x) { return x && x.exports && x.exports.A && x.exports.A.__proto__ && x.exports.A.__proto__.getStreamerActiveStreamMetadata; });
    if (ApplicationStreamingStore) ApplicationStreamingStore = ApplicationStreamingStore.exports.A;

    RunningGameStore = Object.values(wpRequire.c).find(function (x) { return x && x.exports && x.exports.Ay && x.exports.Ay.getRunningGames; });
    if (RunningGameStore) RunningGameStore = RunningGameStore.exports.Ay;

    QuestsStore = Object.values(wpRequire.c).find(function (x) { return x && x.exports && x.exports.A && x.exports.A.__proto__ && x.exports.A.__proto__.getQuest; });
    if (QuestsStore) QuestsStore = QuestsStore.exports.A;

    ChannelStore = Object.values(wpRequire.c).find(function (x) { return x && x.exports && x.exports.A && x.exports.A.__proto__ && x.exports.A.__proto__.getAllThreadsForParent; });
    if (ChannelStore) ChannelStore = ChannelStore.exports.A;

    GuildChannelStore = Object.values(wpRequire.c).find(function (x) { return x && x.exports && x.exports.Ay && x.exports.Ay.getSFWDefaultChannel; });
    if (GuildChannelStore) GuildChannelStore = GuildChannelStore.exports.Ay;

    FluxDispatcher = Object.values(wpRequire.c).find(function (x) { return x && x.exports && x.exports.h && x.exports.h.__proto__ && x.exports.h.__proto__.flushWaitQueue; });
    if (FluxDispatcher) FluxDispatcher = FluxDispatcher.exports.h;

    api = Object.values(wpRequire.c).find(function (x) { return x && x.exports && x.exports.Bo && x.exports.Bo.get; });
    if (api) api = api.exports.Bo;

    if (QuestsStore && FluxDispatcher && api) {
      isDiscordConnected = true;
    }
  } catch (err) {
    console.error("[QuestWidget] Discord store initialization failed:", err);
  }
  // #endregion

  // #region Localization (i18n)
  var I18N = {
    ru: {
      init_panel: 'Инициализация панели',
      prep_components: 'Подготовка компонентов...',
      auto_enroll_status: 'Автопринятие квестов...',
      sync_api_status: 'Синхронизация с Discord API...',
      click_to_skip: 'Нажмите, чтобы пропустить',
      unfold_btn: 'Развернуть',
      quick_theme_btn: 'Быстрая смена темы',
      settings_btn: 'Настройки',
      more_btn: 'Дополнительно (Дашборд)',
      collapse_btn: 'Свернуть',
      close_btn: 'Закрыть',
      tab_status: '🎯 Текущий статус',
      tab_queue: '📋 Очередь задач',
      progress_label: 'Прогресс выполнения',
      elapsed_label: 'Времени прошло',
      remaining_label: 'Осталось задач',
      diamond_remaining: 'Осталось',
      btn_skip: 'Пропустить шаг',
      btn_restart: 'Перезапуск',
      btn_stop: 'Остановка процесса',
      queue_empty: 'Нет активных квестов',
      queue_pending: 'В очереди',
      queue_processing: 'Выполняется',
      queue_completed: 'Завершено',
      bg_url_label: 'URL фона (GIF / MP4 / WebM)',
      blur_label: 'Размытие стекла (Blur)',
      opacity_label: 'Прозрачность (Opacity)',
      lang_label: 'Язык интерфейса',
      voice_label: 'Голосовой ассистент (Cyber Voice)',
      click_sound_label: 'Sci-Fi клики кнопок',
      sound_label: 'Звук уведомлений',
      claim_label: 'Авто-клейм наград',
      claim_hint: 'Автоматически забирает промокод/награду сразу после завершения задания.',
      display_mode_label: 'Режим отображения фона',
      display_bg: 'В фоне',
      display_top: 'Сверху',
      display_hint_bg: 'Фон растягивается на задний план под матовым стеклом.',
      display_hint_top: 'Фон выносится в отдельный интерактивный экран/визор.',
      btn_cancel: 'Отмена',
      btn_save: 'Сохранить',
      btn_on: 'Вкл',
      btn_off: 'Выкл',
      dash_title: 'DASHBOARD & CUSTOMIZATION',
      dash_hint: 'Кликните по плитке для выбора',
      close_menu: 'Закрыть меню',
      sec_layouts: '📐 МАКЕТЫ ИНТЕРФЕЙСА',
      sec_layouts_sub: '10 вариантов расположения',
      sec_shapes: '💎 ФОРМА ОКНА (ФИГУРЫ)',
      sec_shapes_sub: 'Форм-фактор корпуса',
      sec_themes: '🎨 ПАЛИТРА ТЕМ',
      sec_author: '💖 АВТОР ПРОЕКТА',
      author_help: 'Помочь проекту',
      author_sub: 'Донат разработчику',
      layout_classic: 'Классика',
      layout_vertical: 'Вертикаль',
      layout_ribbon: 'Лента',
      layout_slant: 'Грань',
      layout_blob: '💧 Капля',
      layout_cascade: '🃏 Каскад',
      layout_cube: '🧊 Куб',
      layout_hologram: '📼 Голо',
      layout_pipboy: '📺 Pip-Boy',
      layout_hex: '⬢ Гексагон',
      shape_classic: 'Классика',
      shape_radar: '📡 Радар',
      shape_diamond: '💎 Ромб',
      toast_saved: 'Настройки успешно сохранены',
      toast_lang_changed: 'Язык интерфейса изменен',
      voice_enabled: 'Голосовой ассистент включен',
      all_quests_done: '🎉 Все доступные квесты завершены!',
      all_quests_done_voice: 'Все доступные квесты успешно завершены!',
      all_quests_completed_lbl: 'Все квесты завершены',
      no_active_quests_lbl: 'Нет активных квестов',
      voice_running_quest: 'Выполняется квест ',
      voice_progress_50: 'Прогресс 50 процентов',
      quest_completed: '✓ Выполнено: ',
      quest_skipped: 'Квест пропущен',
      process_restarted: 'Процесс перезапущен',
      process_stopped: '⛔ Процесс остановлен',
      voice_process_stopped: 'Процесс остановлен',
      toast_auto_enrolled: '🎁 Автоматически принято квестов: ',
      voice_auto_enrolled: 'Принято новых квестов: ',
      toast_claimed_prev: '🎁 Забрано ранее готовых наград: ',
      toast_reward_code: '🎁 Код награды (',
      voice_reward_code: 'Награда получена. Промокод скопирован.',
      toast_reward_success: '🎁 Награда за ',
      toast_reward_success_tail: ' успешно получена!',
      voice_reward_success: 'Награда за квест получена.',
      toast_watching_video: '▶ Просмотр видео: ',
      toast_desktop_required: 'Требуется Discord Desktop для: ',
      toast_emulating_game: 'Эмуляция игры: ',
      toast_stream_required: 'Требуется Discord Desktop для стрима: ',
      toast_stream_spoofed: 'Стрим подменен на ',
      toast_stream_spoofed_tail: '. Стримьте в любой войс!',
      toast_activity: 'Активность: '
    },
    en: {
      init_panel: 'Panel Initialization',
      prep_components: 'Preparing components...',
      auto_enroll_status: 'Auto-enrolling quests...',
      sync_api_status: 'Syncing with Discord API...',
      click_to_skip: 'Click to skip',
      unfold_btn: 'Expand',
      quick_theme_btn: 'Quick Theme Switch',
      settings_btn: 'Settings',
      more_btn: 'Dashboard & Layouts',
      collapse_btn: 'Collapse',
      close_btn: 'Close',
      tab_status: '🎯 Current Status',
      tab_queue: '📋 Task Queue',
      progress_label: 'Task Progress',
      elapsed_label: 'Time Elapsed',
      remaining_label: 'Quests Remaining',
      diamond_remaining: 'Remaining',
      btn_skip: 'Skip Step',
      btn_restart: 'Restart',
      btn_stop: 'Stop Process',
      queue_empty: 'No active quests',
      queue_pending: 'In Queue',
      queue_processing: 'In Progress',
      queue_completed: 'Completed',
      bg_url_label: 'Background URL (GIF / MP4 / WebM)',
      blur_label: 'Glass Blur',
      opacity_label: 'Glass Opacity',
      lang_label: 'Interface Language',
      voice_label: 'Cyber Voice Assistant',
      click_sound_label: 'Sci-Fi Button Clicks',
      sound_label: 'Notification Sounds',
      claim_label: 'Auto-claim Rewards',
      claim_hint: 'Automatically claims promo codes/rewards upon task completion.',
      display_mode_label: 'Background Display Mode',
      display_bg: 'Background',
      display_top: 'Top Screen',
      display_hint_bg: 'Background spans across the card under frosted glass.',
      display_hint_top: 'Background is displayed in a dedicated interactive visor.',
      btn_cancel: 'Cancel',
      btn_save: 'Save',
      btn_on: 'On',
      btn_off: 'Off',
      dash_title: 'DASHBOARD & CUSTOMIZATION',
      dash_hint: 'Click a tile to select',
      close_menu: 'Close Menu',
      sec_layouts: '📐 INTERFACE LAYOUTS',
      sec_layouts_sub: '10 layout variations',
      sec_shapes: '💎 WINDOW SHAPE (GEOMETRY)',
      sec_shapes_sub: 'Body form factor',
      sec_themes: '🎨 THEME PALETTE',
      sec_author: '💖 PROJECT AUTHOR',
      author_help: 'Support Project',
      author_sub: 'Donate to Developer',
      layout_classic: 'Classic',
      layout_vertical: 'Vertical',
      layout_ribbon: 'Ribbon',
      layout_slant: 'Slant',
      layout_blob: '💧 Blob',
      layout_cascade: '🃏 Cascade',
      layout_cube: '🧊 Cube',
      layout_hologram: '📼 Holo',
      layout_pipboy: '📺 Pip-Boy',
      layout_hex: '⬢ Hexagon',
      shape_classic: 'Classic',
      shape_radar: '📡 Radar',
      shape_diamond: '💎 Diamond',
      toast_saved: 'Settings saved successfully',
      toast_lang_changed: 'Language updated',
      voice_enabled: 'Voice assistant enabled',
      all_quests_done: '🎉 All available quests completed!',
      all_quests_done_voice: 'All available quests successfully completed!',
      all_quests_completed_lbl: 'All quests completed',
      no_active_quests_lbl: 'No active quests',
      voice_running_quest: 'Running quest ',
      voice_progress_50: 'Progress 50 percent',
      quest_completed: '✓ Completed: ',
      quest_skipped: 'Quest skipped',
      process_restarted: 'Process restarted',
      process_stopped: '⛔ Process stopped',
      voice_process_stopped: 'Process stopped',
      toast_auto_enrolled: '🎁 Auto-enrolled quests: ',
      voice_auto_enrolled: 'New quests accepted: ',
      toast_claimed_prev: '🎁 Claimed previous rewards: ',
      toast_reward_code: '🎁 Reward code (',
      voice_reward_code: 'Reward claimed. Promo code copied.',
      toast_reward_success: '🎁 Reward for ',
      toast_reward_success_tail: ' successfully claimed!',
      voice_reward_success: 'Quest reward claimed.',
      toast_watching_video: '▶ Watching video: ',
      toast_desktop_required: 'Discord Desktop required for: ',
      toast_emulating_game: 'Emulating game: ',
      toast_stream_required: 'Discord Desktop required to stream: ',
      toast_stream_spoofed: 'Stream spoofed for ',
      toast_stream_spoofed_tail: '. Stream to any voice channel!',
      toast_activity: 'Activity: '
    }
  };

  function t(key) {
    var lang = state.language || 'ru';
    return (I18N[lang] && I18N[lang][key]) || (I18N.ru && I18N.ru[key]) || key;
  }
  // #endregion

  // #region Settings & Storage
  var STORAGE_KEY = '__task_control_panel_settings_v8__';

  function loadSettings() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveSettings() {
    try {
      var data = {
        theme: state.theme,
        layoutMode: state.layoutMode,
        structureMode: state.structureMode,
        displayMode: state.displayMode,
        language: state.language,
        soundEnabled: state.soundEnabled,
        clickSoundsEnabled: state.clickSoundsEnabled,
        voiceEnabled: state.voiceEnabled,
        autoClaimEnabled: state.autoClaimEnabled,
        bgUrl: backgroundImageUrl,
        glassBlur: state.glassBlur,
        glassOpacity: state.glassOpacity,
        posX: state.posX,
        posY: state.posY
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  var saved = loadSettings();
  // #endregion

  // #region Themes & State
  var THEME_BASE = {
    bgPanel: 'rgba(14, 14, 18, 0.92)',
    headerBg: 'rgba(9, 9, 13, 0.85)',
    textPrimary: '#f2f3f5',
    textSecondary: '#9aa0a6',
    border: 'rgba(255, 255, 255, 0.12)',
    chipBg: 'rgba(255, 255, 255, 0.08)',
    danger: '#f23f42',
    trackBg: 'rgba(255, 255, 255, 0.12)'
  };

  var themes = {
    classic: { name: 'Классика', nameEn: 'Classic', accentA: '#ff6a1a', accentB: '#ffb238' },
    flame: { name: 'Пламя', nameEn: 'Flame', accentA: '#ED4245', accentB: '#ff8f7a' },
    cosmos: { name: 'Глубокий космос', nameEn: 'Deep Space', accentA: '#2066D2', accentB: '#6fa4ff' },
    neon: { name: 'Неон', nameEn: 'Neon', accentA: '#9933FF', accentB: '#c98bff' },
    inferno: { name: '🔥 Инферно', nameEn: '🔥 Inferno', accentA: '#ff4d1c', accentB: '#ffb238', hasGlow: true },
    abyss: { name: '🌊 Абисс', nameEn: '🌊 Abyss', accentA: '#00D9C0', accentB: '#0080FF', hasWave: true },
    cyberpunk: { name: '⚡ Cyberpunk 2077', nameEn: '⚡ Cyberpunk 2077', accentA: '#fcee0a', accentB: '#00f0ff', hasCyber: true },
    valorant: { name: '🎯 Valorant HUD', nameEn: '🎯 Valorant HUD', accentA: '#ff4655', accentB: '#00ffff', hasValorant: true },
    matrix: { name: '📟 Matrix Code', nameEn: '📟 Matrix Code', accentA: '#00ff41', accentB: '#008f11', hasMatrix: true },
    celestial: { name: '✨ Celestia', nameEn: '✨ Celestia', accentA: '#e6c387', accentB: '#60a5fa', hasCelestial: true },
    rainbow: { 
      name: '🌈 Радужная (Пасхалка)', 
      nameEn: '🌈 Rainbow (Easter Egg)',
      accentA: '#ff0000', 
      accentB: '#8b00ff',
      isRainbow: true 
    }
  };
  var themeOrder = ['classic', 'flame', 'cosmos', 'neon', 'inferno', 'abyss', 'cyberpunk', 'valorant', 'matrix', 'celestial', 'rainbow'];

  var DEFAULT_BG_GIF = 'https://cdn.discordapp.com/attachments/1276143668847317093/1540100426739879936/wkarase_7675791065990974741-no-watermark.gif?ex=6a99348b&is=6a97e30b&hm=8e6e05ca09c875556d6b2c2f971952cf4530a11f9caa86f3c7c3fe340084d52f&';
  var LOADING_GIF_URL = 'https://cdn.discordapp.com/attachments/1276143668847317093/1542235853852647536/54290b901babbae2d3941715a0416ac7.gif?ex=6a991050&is=6a97bed0&hm=7576d27a314f889eb31cb0077685cdf349319b20f0e38b7ed3a8890d3593cc92&';
  var SUPPORT_DEV_GIF_URL = 'https://cdn.discordapp.com/attachments/1276143668847317093/1542900450112835654/f304ad0f8e3c90b4df2b4389966f7595.gif?ex=6a92e985&is=6a919805&hm=1c542e6d11fc7086684b4b98d85dace3d5b1dc6b4d211c0a05dc54edb7a8bba7&';
  var SUPPORT_DEV_URL = 'https://www.donationalerts.com/r/doomec';

  var backgroundImageUrl = saved.bgUrl || DEFAULT_BG_GIF;

  var timerInterval = null;
  var activeTaskCleanup = null;

  var state = {
    theme: saved.theme || 'classic',
    progress: 0,
    elapsedSeconds: 0,
    activeTab: 'status',
    layoutMode: saved.layoutMode || 'classic',
    structureMode: saved.structureMode || 'classic',
    displayMode: saved.displayMode || 'background',
    language: saved.language || 'ru',
    soundEnabled: saved.soundEnabled !== undefined ? saved.soundEnabled : true,
    clickSoundsEnabled: saved.clickSoundsEnabled !== undefined ? saved.clickSoundsEnabled : true,
    voiceEnabled: saved.voiceEnabled !== undefined ? saved.voiceEnabled : true,
    autoClaimEnabled: saved.autoClaimEnabled !== undefined ? saved.autoClaimEnabled : true,
    glassBlur: saved.glassBlur !== undefined ? saved.glassBlur : 20,
    glassOpacity: saved.glassOpacity !== undefined ? saved.glassOpacity : 92,
    posX: saved.posX || null,
    posY: saved.posY || null,
    isStopped: false,
    isCollapsed: false,
    queue: [],
    currentStepIndex: 0
  };
  // #endregion

  // #region DOM & Stylesheet
  var host = document.createElement('div');
  host.id = '__task_widget_host__';

  var initialTopPos = state.posY !== null ? state.posY + 'px' : '0px';
  var initialLeftPos = state.posX !== null ? state.posX + 'px' : 'calc(100vw - 480px)';

  Object.assign(host.style, {
    position: 'fixed',
    top: initialTopPos,
    left: initialLeftPos,
    zIndex: 2147483647,
    width: 'auto',
    userSelect: 'none',
    webkitUserSelect: 'none'
  });
  document.body.appendChild(host);
  var root = host.attachShadow({ mode: 'open' });

  var styleEl = document.createElement('style');
  styleEl.textContent = `
    :host, * { box-sizing: border-box; }
    *::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
    * { -ms-overflow-style: none !important; scrollbar-width: none !important; }

    :host {
      --glassBlur: 20px;
      --glassOpacity: 0.92;
    }

    .panel[style*="display: none"],
    .panel[style*="display:none"] {
      display: none !important;
    }

    @keyframes rainbow-glow {
      0% { border-color: #ff0000; box-shadow: 0 0 15px rgba(255, 0, 0, 0.5); stroke: #ff0000; }
      20% { border-color: #ff7f00; box-shadow: 0 0 15px rgba(255, 127, 0, 0.5); stroke: #ff7f00; }
      40% { border-color: #ffff00; box-shadow: 0 0 15px rgba(255, 255, 0, 0.5); stroke: #ffff00; }
      60% { border-color: #00ff00; box-shadow: 0 0 15px rgba(0, 255, 0, 0.5); stroke: #00ff00; }
      80% { border-color: #0000ff; box-shadow: 0 0 15px rgba(0, 0, 255, 0.5); stroke: #0000ff; }
      100% { border-color: #8b00ff; box-shadow: 0 0 15px rgba(139, 0, 255, 0.5); stroke: #8b00ff; }
    }

    @keyframes rainbow-gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes cyberpunk-pulse {
      0%, 100% { box-shadow: 0 0 20px rgba(252, 238, 10, 0.4), inset 0 0 15px rgba(0, 240, 255, 0.2); border-color: #fcee0a; }
      50% { box-shadow: 0 0 30px rgba(0, 240, 255, 0.6), inset 0 0 25px rgba(252, 238, 10, 0.3); border-color: #00f0ff; }
    }
    .card.cyberpunk-glow { animation: cyberpunk-pulse 3s infinite ease-in-out; }

    @keyframes valorant-pulse {
      0%, 100% { box-shadow: 0 0 20px rgba(255, 70, 85, 0.5), inset 0 0 12px rgba(255, 70, 85, 0.2); border-color: #ff4655; }
      50% { box-shadow: 0 0 32px rgba(255, 70, 85, 0.8), inset 0 0 20px rgba(0, 255, 255, 0.3); border-color: #00ffff; }
    }
    .card.valorant-glow { animation: valorant-pulse 2.5s infinite ease-in-out; }

    @keyframes matrix-pulse {
      0%, 100% { box-shadow: 0 0 18px rgba(0, 255, 65, 0.4), inset 0 0 14px rgba(0, 255, 65, 0.15); border-color: #00ff41; }
      50% { box-shadow: 0 0 30px rgba(0, 255, 65, 0.75), inset 0 0 25px rgba(0, 143, 17, 0.35); border-color: #00ff41; }
    }
    .card.matrix-glow { animation: matrix-pulse 2.8s infinite ease-in-out; }

    @keyframes celestial-pulse {
      0%, 100% { box-shadow: 0 0 20px rgba(230, 195, 135, 0.45), inset 0 0 15px rgba(96, 165, 250, 0.2); border-color: #e6c387; }
      50% { box-shadow: 0 0 32px rgba(96, 165, 250, 0.65), inset 0 0 22px rgba(230, 195, 135, 0.3); border-color: #60a5fa; }
    }
    .card.celestial-glow { animation: celestial-pulse 4s infinite ease-in-out; }

    .card {
      position: relative; border-radius: 20px; overflow: hidden !important;
      font-family: 'gg sans', 'Segoe UI', Roboto, Arial, sans-serif;
      box-shadow: 0 20px 45px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.4);
      border: 1px solid var(--border); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: var(--bgPanel); backdrop-filter: blur(var(--glassBlur)); -webkit-backdrop-filter: blur(var(--glassBlur));
      width: 460px; height: 310px;
    }

    /* layout: vertical-media */
    .card.layout-vertical-media { width: 420px !important; height: 590px !important; }
    .card.display-top { height: 500px; }
    .card.layout-vertical-media.display-top { height: 760px !important; }

    .card.layout-vertical-media #tcp-media-screen.top-media-screen {
      margin: 0 !important; width: 100% !important; border-radius: 0 !important;
    }
    .card.layout-vertical-media #tcp-media-screen.top-media-screen::after {
      content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(18,18,22,0.85) 100%); pointer-events: none; z-index: 1;
    }
    .card.layout-vertical-media.display-top .tabs { margin-top: 0 !important; padding-top: 0 !important; }
    .card.layout-vertical-media.display-top #tcp-media-screen.top-media-screen { height: 260px !important; }

    .card.layout-vertical-media .panel {
      padding: 16px 20px !important;
      height: 100% !important;
      overflow: hidden !important;
      box-sizing: border-box;
    }

    .card.layout-vertical-media #tcp-view-status > div:first-child {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: space-between !important;
      flex: 1 !important;
      width: 100% !important;
      padding: 6px 0 !important;
      gap: 12px !important;
    }

    .card.layout-vertical-media .progress-row {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      width: 100% !important;
      gap: 4px !important;
      margin: 0 !important;
      max-width: 100% !important;
    }

    .card.layout-vertical-media .progress-value {
      order: 1 !important;
      font-size: 24px !important;
      font-weight: 800 !important;
      line-height: 1.2 !important;
      background: linear-gradient(135deg, var(--accentA), var(--accentB)) !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      color: transparent !important;
      white-space: nowrap !important;
      text-align: center !important;
    }
    .card.layout-vertical-media.display-top .progress-value { font-size: 20px !important; }

    .card.layout-vertical-media .progress-label {
      order: 2 !important;
      font-size: 10px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.8px !important;
      color: var(--textSecondary) !important;
      white-space: nowrap !important;
      text-align: center !important;
    }

    .card.layout-vertical-media .track-wrap {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      height: 220px !important;
      flex: 1 !important;
      position: relative !important;
      margin: 6px 0 !important;
    }
    .card.layout-vertical-media.display-top .track-wrap { height: 160px !important; }

    .card.layout-vertical-media .track {
      width: 210px !important;
      height: 44px !important;
      margin: 0 !important;
      transform: rotate(-90deg) !important;
      transform-origin: center center !important;
      flex-shrink: 0 !important;
      border-radius: 999px !important;
      box-shadow: inset 0 0 0 1px var(--border), 0 8px 24px rgba(0, 0, 0, 0.45) !important;
      background: var(--trackBg) !important;
      overflow: hidden !important;
    }
    .card.layout-vertical-media.display-top .track { width: 160px !important; height: 38px !important; }
    .card.layout-vertical-media .fill { box-shadow: 0 0 16px var(--accentA) !important; }

    .card.layout-vertical-media .chips {
      width: 100% !important;
      margin-bottom: 0 !important;
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 10px !important;
    }

    .card.layout-vertical-media #tcp-view-settings {
      height: 100% !important; width: 100% !important; padding: 0 !important; overflow: hidden !important;
    }
    .card.layout-vertical-media .settings-view-inner {
      padding: 16px 20px !important; height: 100% !important; box-sizing: border-box; gap: 10px !important;
    }

    /* layout: pip-boy */
    .card.layout-pipboy {
      width: 450px !important; height: 340px !important;
      border-radius: 28px !important; border: 4px solid #242924 !important;
      background: #0d120d !important;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.9), inset 0 0 35px rgba(0, 0, 0, 0.95), 0 0 28px color-mix(in srgb, var(--accentA) 35%, transparent) !important;
    }
    .card.layout-pipboy.display-top { height: 530px !important; }

    .card.layout-pipboy::before {
      content: ''; position: absolute; top: 10px; left: 10px; width: 6px; height: 6px; border-radius: 50%;
      background: #4a544a; box-shadow: 0 0 0 1px #111711, calc(450px - 26px) 0 0 0 #4a544a, 0 calc(340px - 26px) 0 0 #4a544a, calc(450px - 26px) calc(340px - 26px) 0 0 #4a544a;
      z-index: 25; pointer-events: none;
    }
    .card.layout-pipboy .card-inner::before {
      content: ''; position: absolute; inset: 0;
      background: repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0.42) 3px, rgba(0, 0, 0, 0.42) 4px);
      pointer-events: none; z-index: 18; mix-blend-mode: multiply; opacity: 0.95;
    }
    .card.layout-pipboy .card-inner::after {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(circle at center, transparent 55%, rgba(0, 0, 0, 0.75) 98%);
      box-shadow: inset 0 0 32px rgba(0, 0, 0, 0.9); pointer-events: none; z-index: 19;
    }
    .card.layout-pipboy .header-title span,
    .card.layout-pipboy .progress-value,
    .card.layout-pipboy .chip-value {
      text-shadow: 0 0 8px color-mix(in srgb, var(--accentA) 75%, transparent); letter-spacing: 0.6px;
    }
    .card.layout-pipboy .track {
      height: 14px !important; border-radius: 4px !important; border: 1.5px solid var(--accentA) !important;
      background: rgba(0, 18, 6, 0.75) !important; padding: 2px !important; box-shadow: 0 0 10px color-mix(in srgb, var(--accentA) 35%, transparent);
    }
    .card.layout-pipboy .fill {
      border-radius: 2px !important;
      background: repeating-linear-gradient(90deg, var(--accentA) 0px, var(--accentA) 6px, transparent 6px, transparent 9px) !important;
      box-shadow: 0 0 12px var(--accentA) !important;
    }
    .card.layout-pipboy.collapsed {
      width: 190px !important; height: 42px !important; border-radius: 12px !important;
      background: #0d120d !important; border: 2.5px solid color-mix(in srgb, var(--accentA) 55%, #242924) !important;
      box-shadow: 0 10px 28px rgba(0,0,0,0.8), 0 0 16px color-mix(in srgb, var(--accentA) 35%, transparent) !important;
    }
    .card.layout-pipboy.collapsed::before { display: none !important; }
    .card.layout-pipboy.collapsed .mini-track {
      height: 8px !important; border-radius: 3px !important; border: 1px solid var(--accentA) !important; background: rgba(0, 15, 5, 0.8) !important;
    }
    .card.layout-pipboy.collapsed .mini-fill {
      border-radius: 1px !important; background: repeating-linear-gradient(90deg, var(--accentA) 0px, var(--accentA) 4px, transparent 4px, transparent 7px) !important;
    }
    .card.layout-pipboy.collapsed .mini-percent {
      font-family: 'Courier New', monospace !important; font-weight: 800 !important; text-shadow: 0 0 8px var(--accentA) !important;
    }

    /* layout: hexagon */
    .card.layout-hex {
      border-radius: 0 !important;
      border: none !important;
      clip-path: polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px) !important;
      -webkit-clip-path: polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px) !important;
      filter: drop-shadow(0 0 0 1.5px color-mix(in srgb, var(--accentA) 80%, transparent)) drop-shadow(0 20px 48px rgba(0,0,0,0.85)) !important;
      position: relative;
    }
    .card.layout-hex .card-inner {
      clip-path: inherit !important;
      -webkit-clip-path: inherit !important;
      border-radius: 0 !important;
    }

    /* hex: background mode */
    .card.layout-hex.display-background {
      width: 460px !important;
      height: 320px !important;
      background: var(--bgPanel) !important;
    }
    .card.layout-hex.display-background .hex-chamber {
      display: none !important;
    }
    .card.layout-hex.display-background .card-inner {
      display: flex !important;
      flex-direction: column !important;
    }
    .card.layout-hex.display-background .content {
      width: 100% !important;
      height: 100% !important;
      padding: 12px 18px 16px 18px !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-sizing: border-box;
      gap: 8px;
    }
    .card.layout-hex.display-background .header {
      padding: 0 !important;
      background: transparent !important;
      border: none !important;
    }
    .card.layout-hex.display-background .panel {
      padding: 0 !important;
      height: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      overflow: hidden !important;
    }
    .card.layout-hex.display-background #tcp-view-status > div:first-child {
      display: flex !important;
      flex-direction: column !important;
      gap: 8px !important;
      width: 100% !important;
    }

    /* hex: top screen mode */
    .card.layout-hex.display-top {
      width: 610px !important;
      height: 250px !important;
      background: rgba(10, 13, 18, 0.96) !important;
    }
    .card.layout-hex.display-top #tcp-media-screen {
      display: none !important;
    }
    .card.layout-hex.display-top .card-inner {
      display: flex !important;
      flex-direction: row !important;
      align-items: stretch !important;
      height: 100% !important;
      overflow: hidden !important;
    }
    .card.layout-hex.display-top .hex-chamber {
      display: flex !important;
      width: 200px !important;
      flex-shrink: 0 !important;
      align-items: center;
      justify-content: center;
      position: relative;
      background: radial-gradient(circle at center, color-mix(in srgb, var(--accentA) 12%, transparent) 0%, rgba(0,0,0,0.4) 80%);
      border-right: 1px solid rgba(255,255,255,0.08);
      overflow: hidden;
    }
    .card.layout-hex.display-top .content {
      width: calc(100% - 200px) !important;
      height: 100% !important;
      padding: 14px 18px !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-sizing: border-box;
      gap: 8px;
    }
    .card.layout-hex.display-top .header {
      padding: 0 !important;
      background: transparent !important;
      border: none !important;
    }
    .card.layout-hex.display-top .panel {
      padding: 0 !important;
      height: 100% !important;
      justify-content: space-between !important;
      gap: 8px !important;
    }
    .card.layout-hex.display-top #tcp-view-status > div:first-child {
      display: flex !important;
      flex-direction: column !important;
      gap: 6px !important;
      width: 100% !important;
    }
    .card.layout-hex.display-top.settings-open {
      height: 350px !important;
    }

    /* hex reactor elements */
    .hex-chamber { display: none; }
    .hex-media-wrap {
      width: 122px;
      height: 140px;
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      position: absolute;
      z-index: 2;
      overflow: hidden;
      box-shadow: inset 0 0 25px rgba(0,0,0,0.8);
      background: #000;
    }
    .hex-media-bg {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
    }
    .hex-media-wrap::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%);
      pointer-events: none;
    }

    .hex-ring-svg {
      width: 148px;
      height: 170px;
      position: absolute;
      z-index: 5;
      pointer-events: none;
      filter: drop-shadow(0 0 8px var(--accentA));
    }
    .hex-ring-track {
      fill: none;
      stroke: var(--trackBg);
      stroke-width: 3.5;
    }
    .hex-ring-fill {
      fill: none;
      stroke: var(--accentA);
      stroke-width: 4;
      stroke-linecap: round;
      stroke-dasharray: 300;
      stroke-dashoffset: 300;
      transition: stroke-dashoffset 0.25s linear;
    }
    .hex-core-percent {
      position: absolute;
      bottom: 18px;
      z-index: 6;
      font-size: 14px;
      font-weight: 900;
      color: #fff;
      text-shadow: 0 0 10px rgba(0,0,0,0.9), 0 0 8px var(--accentA);
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.5px;
    }

    /* hex ui components */
    .card.layout-hex .header-title::before {
      content: '[⬢ MECHA CORE]';
      font-size: 10px;
      font-weight: 800;
      color: var(--accentA);
      letter-spacing: 0.6px;
      margin-right: 4px;
    }
    .card.layout-hex .tabs {
      padding: 0 !important;
      margin-top: 2px !important;
    }
    .card.layout-hex .track {
      height: 9px !important;
      border-radius: 2px !important;
      background: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid color-mix(in srgb, var(--accentA) 35%, transparent) !important;
      margin-bottom: 6px !important;
    }
    .card.layout-hex .fill {
      border-radius: 1px !important;
      box-shadow: 0 0 10px var(--accentA) !important;
    }
    .card.layout-hex .chips {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 8px !important;
      margin-bottom: 6px !important;
    }
    .card.layout-hex .chip {
      padding: 6px 10px !important;
      border-radius: 6px !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
    }
    .card.layout-hex .actions {
      display: flex !important;
      gap: 8px !important;
    }
    .card.layout-hex .action-btn {
      padding: 8px 4px !important;
      font-size: 11px !important;
      font-weight: 800 !important;
      border-radius: 8px !important;
      flex: 1;
      text-align: center;
      letter-spacing: 0.3px;
    }
    .card.layout-hex .settings-view-inner {
      padding: 4px 0 !important;
      width: 100%;
      box-sizing: border-box;
    }

    /* hex collapsed core */
    .hex-mini-core { display: none; }
    .card.layout-hex.collapsed {
      width: 58px !important;
      height: 58px !important;
      border-radius: 0 !important;
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) !important;
      -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) !important;
      filter: drop-shadow(0 0 14px var(--accentA)) drop-shadow(0 8px 24px rgba(0,0,0,0.85)) !important;
      cursor: grab;
    }
    .card.layout-hex.collapsed .card-inner {
      border-radius: 0 !important;
      clip-path: inherit !important;
      background: transparent !important;
    }
    .card.layout-hex.collapsed .hex-chamber { display: none !important; }
    .card.layout-hex.collapsed .header { display: none !important; }
    .card.layout-hex.collapsed .mini-player-bar { display: none !important; }
    .card.layout-hex.collapsed .content { pointer-events: none !important; }
    .card.layout-hex.collapsed .hex-mini-core {
      display: flex !important;
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, color-mix(in srgb, var(--accentA) 35%, #090d14) 0%, #090d14 85%) !important;
      border: 2px solid var(--accentA) !important;
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) !important;
      -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) !important;
      align-items: center;
      justify-content: center;
      z-index: 10;
      font-size: 11.5px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 0 8px var(--accentA);
      pointer-events: auto;
      font-variant-numeric: tabular-nums;
    }

    /* alternative layouts */
    .card.layout-horizontal-ribbon {
      width: 660px !important; height: 210px !important;
      border-radius: 20px !important; overflow: hidden !important;
    }
    .card.layout-horizontal-ribbon.display-top { height: 230px !important; }
    .card.layout-horizontal-ribbon .card-inner {
      display: flex !important; flex-direction: row !important; align-items: stretch; overflow: hidden !important;
    }
    .card.layout-horizontal-ribbon #tcp-media-screen { display: none !important; }
    .card.layout-horizontal-ribbon.display-top .ribbon-media-zone {
      display: block !important; width: 210px !important; height: 100% !important;
      position: absolute; top: 0; left: 0; overflow: hidden !important;
      border-radius: 20px 0 0 20px; z-index: 2;
    }
    .card.layout-horizontal-ribbon .ribbon-media-zone::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(to right, rgba(0,0,0,0) 55%, rgba(18,18,22,0.9) 100%); pointer-events: none;
    }
    .ribbon-media-bg { width: 100%; height: 100%; background-size: cover; background-position: center; position: relative; }

    .card.layout-horizontal-ribbon .content {
      width: 100% !important; height: 100% !important; margin-left: 0 !important;
      display: flex !important; flex-direction: column !important; justify-content: flex-start !important;
      padding: 16px 20px !important; box-sizing: border-box !important; overflow: hidden !important; gap: 10px;
    }
    .card.layout-horizontal-ribbon.display-top .content { width: calc(100% - 210px) !important; margin-left: 210px !important; }
    .card.layout-horizontal-ribbon .header { background: transparent !important; border-bottom: none !important; padding: 0 !important; height: auto; align-items: center; flex-shrink: 0; }
    .card.layout-horizontal-ribbon .header-title { font-size: 13px; }
    .card.layout-horizontal-ribbon .tabs { padding: 0 !important; margin: 2px 0 0 !important; flex-shrink: 0; }
    .card.layout-horizontal-ribbon .main-view-wrap { flex: 1; display: flex; align-items: center; overflow: hidden !important; min-height: 0; }
    .card.layout-horizontal-ribbon .panel { padding: 0 !important; height: 100% !important; width: 100%; justify-content: space-between; gap: 10px; overflow: hidden !important; }
    .card.layout-horizontal-ribbon #tcp-view-status > div:first-child,
    .card.layout-horizontal-ribbon #tcp-view-settings { width: 100%; }
    .card.layout-horizontal-ribbon #tcp-view-status > div:first-child { display: flex !important; align-items: center !important; gap: 14px; }
    .card.layout-horizontal-ribbon .progress-row { flex-direction: column !important; align-items: flex-start !important; gap: 2px !important; margin-bottom: 0 !important; flex-shrink: 1; min-width: 0; max-width: 150px; }
    .card.layout-horizontal-ribbon .progress-label { order: 2; font-size: 9.5px !important; text-transform: uppercase; letter-spacing: 0.3px; white-space: normal; line-height: 1.25; }
    .card.layout-horizontal-ribbon .progress-value { order: 1; font-size: 14px !important; font-weight: 800; line-height: 1.2; }
    .card.layout-horizontal-ribbon .track-wrap { flex: 1 1 60px; min-width: 60px; }
    .card.layout-horizontal-ribbon .track { width: 100% !important; height: 12px !important; margin: 0 !important; }
    .card.layout-horizontal-ribbon .fill { box-shadow: 0 0 12px var(--accentA); }
    .card.layout-horizontal-ribbon .chips { display: flex !important; gap: 12px !important; margin-bottom: 0 !important; padding-left: 14px; border-left: 1px solid var(--border); flex-shrink: 1; min-width: 0; max-width: 190px; }
    .card.layout-horizontal-ribbon .chip { text-align: left; min-width: 0; }
    .card.layout-horizontal-ribbon .chip-label { font-size: 9px !important; white-space: normal; line-height: 1.25; }
    .card.layout-horizontal-ribbon .chip-value { font-size: 14px !important; white-space: nowrap; }
    .card.layout-horizontal-ribbon .actions { display: flex !important; gap: 10px !important; flex-shrink: 0; }
    .card.layout-horizontal-ribbon .action-btn { padding: 8px 6px !important; font-size: 10.5px !important; border-radius: 10px !important; flex: 1; white-space: normal; line-height: 1.15; text-align: center; }

    .card.layout-horizontal-ribbon.settings-open { height: 340px !important; }
    .card.layout-horizontal-ribbon .settings-view-inner { padding: 2px 0 !important; gap: 8px !important; overflow: hidden !important; width: 100%; box-sizing: border-box; }
    .card.layout-horizontal-ribbon .field-group { width: 100%; min-width: 0; }
    .card.layout-horizontal-ribbon .settings-row { width: 100%; min-width: 0; }
    .card.layout-horizontal-ribbon .settings-input { min-width: 0; }

    .card.layout-radar {
      border-radius: 50% !important; transition: all 0.3s ease;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.07), 0 0 45px 8px color-mix(in srgb, var(--accentA) 30%, transparent), 0 24px 55px rgba(0,0,0,0.6) !important;
    }
    .card.layout-radar .card-inner { border-radius: 50% !important; overflow: hidden !important; }
    .card.layout-radar.display-top { width: 420px !important; height: 420px !important; }
    .card.layout-radar.display-background { width: 330px !important; height: 330px !important; }
    .card.layout-radar .tabs, .card.layout-radar .chips, .card.layout-radar .progress-row, .card.layout-radar .track,
    .card.layout-radar #tcp-view-queue, .card.layout-radar #tcp-media-screen.top-media-screen,
    .card.layout-radar .ribbon-media-zone, .card.layout-radar .header-title, .card.layout-radar .mini-player-bar { display: none !important; }
    .card.layout-radar .header { background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; border-bottom: none !important; justify-content: center !important; padding: 20px 0 0 0 !important; }
    .card.layout-radar .header > div { gap: 2px !important; }
    .card.layout-radar .icon-btn { width: 25px !important; height: 25px !important; }
    .card.layout-radar .icon-btn svg { width: 14px !important; height: 14px !important; }
    .card.layout-radar .main-view-wrap, .card.layout-radar .panel, .card.layout-radar .content { overflow: visible !important; }
    .card.layout-radar .content { z-index: 12; }
    .card.layout-radar #tcp-view-status { background: transparent !important; padding: 0 !important; }
    .card.layout-radar #tcp-view-status > div:first-child { display: none; }
    .ribbon-media-zone { display: none; }

    .radar-media-circle {
      display: none; position: absolute; top: 37%; left: 50%; transform: translate(-50%, -50%);
      width: 140px; height: 140px; border-radius: 50%; overflow: hidden; z-index: 4;
      align-items: center; justify-content: center;
      transition: width 0.35s ease, height 0.35s ease, padding 0.35s ease, background 0.35s ease, box-shadow 0.35s ease;
    }
    .card.layout-radar .radar-media-circle { display: flex; }
    .card.layout-radar.settings-open .radar-media-circle, .card.layout-radar.settings-open .radar-ring { display: none !important; }
    .card.layout-radar.display-background .radar-media-circle {
      width: auto; height: auto; padding: 12px 24px; border-radius: 999px;
      background: rgba(20, 20, 24, 0.45); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.14), 0 10px 24px rgba(0,0,0,0.4);
    }
    .card.layout-radar.display-background .radar-media-bg { display: none !important; }
    .card.layout-radar.display-top .radar-media-circle {
      width: 150px; height: 150px; border-radius: 50%; overflow: hidden;
      box-shadow: 0 0 0 3px var(--bgPanel), 0 0 0 5px color-mix(in srgb, var(--accentA) 75%, transparent), 0 14px 30px rgba(0,0,0,0.55);
    }
    .card.layout-radar.display-top .radar-media-circle::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 42%); z-index: 2; pointer-events: none;
    }
    .radar-media-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
    .radar-percent {
      position: relative; z-index: 3; font-size: 24px; font-weight: 800; color: #fff;
      text-shadow: 0 2px 10px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.65); font-variant-numeric: tabular-nums; letter-spacing: 0.3px;
    }

    .radar-ring { display: none; position: absolute; inset: 0; width: 100%; height: 100%; z-index: 6; pointer-events: none; }
    .card.layout-radar .radar-ring { display: block; }
    .radar-ring-track { fill: none; stroke: var(--trackBg); stroke-width: 4; }
    .radar-ring-fill {
      fill: none; stroke: url(#tcp-radar-ring-gradient); stroke-width: 4; stroke-linecap: round;
      transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 0.2s linear;
      filter: drop-shadow(0 0 6px color-mix(in srgb, var(--accentA) 60%, transparent));
    }
    .rainbow-theme .radar-ring-fill { animation: rainbow-glow 6s infinite alternate ease-in-out; }

    .card.layout-radar .actions {
      display: flex !important; flex-direction: column !important; gap: 8px !important;
      position: absolute; left: 50%; bottom: 11%; transform: translateX(-50%); width: 52%; z-index: 8;
    }
    .card.layout-radar .action-btn {
      border-radius: 999px !important; padding: 9px 6px !important; font-size: 11px !important;
      text-align: center; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    }

    .card.layout-diamond {
      width: 380px !important; height: 380px !important; border-radius: 0 !important;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); -webkit-clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      filter: drop-shadow(0 18px 34px rgba(0,0,0,0.55)) drop-shadow(0 0 26px color-mix(in srgb, var(--accentA) 35%, transparent));
    }
    .card.layout-diamond .card-inner { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); -webkit-clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
    .card.layout-diamond.display-top { width: 420px !important; height: 420px !important; }
    .card.layout-diamond .tabs, .card.layout-diamond .chips, .card.layout-diamond .progress-row,
    .card.layout-diamond .track, .card.layout-diamond #tcp-view-queue, .card.layout-diamond #tcp-media-screen,
    .card.layout-diamond .ribbon-media-zone, .card.layout-diamond .header-title, .card.layout-diamond .mini-player-bar { display: none !important; }
    .card.layout-diamond #tcp-view-status > div:first-child { display: none; }
    .card.layout-diamond #tcp-view-status, .card.layout-diamond .panel { background: transparent !important; padding: 0 !important; overflow: visible !important; }
    .card.layout-diamond .main-view-wrap, .card.layout-diamond .content { overflow: visible !important; }
    .card.layout-diamond .content { z-index: 12; }
    .card.layout-diamond .header {
      position: absolute !important; top: 20%; left: 0; width: 100%;
      background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
      border-bottom: none !important; justify-content: center !important; padding: 0 !important;
    }
    .card.layout-diamond .header > div { gap: 2px !important; }
    .card.layout-diamond .icon-btn { width: 22px !important; height: 22px !important; }
    .card.layout-diamond .icon-btn svg { width: 13px !important; height: 13px !important; }
    .card.layout-diamond::before, .card.layout-diamond::after {
      content: ''; position: absolute; left: 50%; top: 50%;
      background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accentA) 45%, transparent), transparent); pointer-events: none; z-index: 3;
    }
    .card.layout-diamond::before { width: 76%; height: 1px; transform: translate(-50%, -50%); }
    .card.layout-diamond::after { width: 1px; height: 76%; transform: translate(-50%, -50%); }
    .diamond-facet { display: none; position: absolute; inset: 0; pointer-events: none; z-index: 2; transition: background 0.3s ease; }
    .card.layout-diamond .diamond-facet { display: block; }
    .diamond-facet.facet-tr { clip-path: polygon(50% 50%, 50% 0%, 100% 50%); background: color-mix(in srgb, var(--accentA) 7%, transparent); }
    .diamond-facet.facet-br { clip-path: polygon(50% 50%, 100% 50%, 50% 100%); background: color-mix(in srgb, var(--accentA) 12%, transparent); }
    .diamond-facet.facet-bl { clip-path: polygon(50% 50%, 50% 100%, 0% 50%); background: color-mix(in srgb, var(--accentA) 7%, transparent); }
    .diamond-facet.facet-tl { clip-path: polygon(50% 50%, 0% 50%, 50% 0%); background: color-mix(in srgb, var(--accentA) 12%, transparent); }
    .card.layout-diamond.collapsed .diamond-facet { display: none !important; }

    .diamond-media {
      display: none; position: absolute; inset: 0; width: 100%; height: 100%;
      clip-path: polygon(50% 50%, 0% 50%, 50% 0%); -webkit-clip-path: polygon(50% 0%, 50% 0%);
      z-index: 4; overflow: hidden; background: transparent; transition: filter 0.35s ease;
    }
    .card.layout-diamond .diamond-media { display: block; }
    .card.layout-diamond.display-top .diamond-media { filter: drop-shadow(0 8px 18px rgba(0,0,0,0.5)); }
    .card.layout-diamond.display-background .diamond-media-bg { display: none !important; }
    .diamond-media-bg { position: absolute; inset: 0; width: 100%; height: 100%; background-size: cover; background-position: center; }
    .card.layout-diamond.settings-open .diamond-media, .card.layout-diamond.settings-open .diamond-percent,
    .card.layout-diamond.settings-open .diamond-remaining, .card.layout-diamond.settings-open::before,
    .card.layout-diamond.settings-open::after { display: none !important; }

    .diamond-percent { display: none; position: absolute; top: 33%; left: 67%; transform: translate(-50%, -50%); z-index: 5; text-align: center; pointer-events: none; }
    .card.layout-diamond .diamond-percent { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .diamond-percent-value { font-size: 15px; font-weight: 800; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.7); font-variant-numeric: tabular-nums; white-space: nowrap; }
    .diamond-percent-track { width: 46px; height: 5px; border-radius: 999px; background: rgba(255,255,255,0.15); overflow: hidden; }
    .diamond-percent-fill { height: 100%; width: 0%; border-radius: 999px; background: linear-gradient(90deg, var(--accentA), var(--accentB)); transition: width 0.3s ease-in-out; }

    .diamond-remaining { display: none; position: absolute; top: 67%; left: 33%; transform: translate(-50%, -50%); z-index: 5; text-align: center; pointer-events: none; }
    .card.layout-diamond .diamond-remaining { display: block; }
    .diamond-remaining-label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--textSecondary); text-shadow: 0 1px 4px rgba(0,0,0,0.8); margin-bottom: 2px; white-space: nowrap; }
    .diamond-remaining-value { font-size: 18px; font-weight: 800; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.85); font-variant-numeric: tabular-nums; }
    .card.layout-diamond .actions { display: flex !important; flex-direction: column !important; gap: 4px !important; position: absolute; top: 52%; left: 52%; width: 22%; z-index: 8; }
    .card.layout-diamond .action-btn { border-radius: 7px !important; padding: 4px 3px !important; font-size: 7.5px !important; text-align: center; line-height: 1.1; }

    .card.layout-slant { width: 380px !important; height: 480px !important; border-radius: 6px 44px 6px 44px !important; }
    .card.layout-slant .card-inner { border-radius: 6px 44px 6px 44px !important; }
    .card.layout-slant.display-top { height: 520px !important; }
    .card.layout-slant #tcp-media-screen {
      display: block !important; position: relative !important; width: 100% !important; height: 150px !important;
      margin: 0 !important; border-radius: 0 !important; opacity: 1 !important; flex-shrink: 0;
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 78%); transition: height 0.3s ease;
    }
    .card.layout-slant.display-top #tcp-media-screen { height: 260px !important; }
    .card.layout-slant #tcp-media-screen::after { content: ''; position: absolute; inset: 0; background: linear-gradient(115deg, var(--accentA) 0%, transparent 35%); opacity: 0.35; mix-blend-mode: overlay; pointer-events: none; }
    .card.layout-slant .header { position: absolute !important; top: 0; left: 0; width: 100%; z-index: 5; background: linear-gradient(to bottom, rgba(10,10,12,0.6), rgba(10,10,12,0)) !important; border-bottom: none !important; }
    .card.layout-slant .header-title span, .card.layout-slant .header-title { text-shadow: 0 1px 4px rgba(0,0,0,0.7); }
    .card.layout-slant .header .icon-btn svg { filter: drop-shadow(0 1px 3px rgba(0,0,0,0.8)); }
    .card.layout-slant.collapsed { width: 168px !important; height: 40px !important; border-radius: 8px !important; transform: skewX(-10deg); }
    .card.layout-slant.collapsed .card-inner { border-radius: 8px !important; }
    .card.layout-slant.collapsed .header { position: relative !important; transform: skewX(10deg); }

    .card.layout-blob {
      width: 380px !important; height: 460px !important;
      border-radius: 36% 24% 26% 32% / 30% 22% 28% 24% !important;
      animation: blob-morph 9s ease-in-out infinite alternate; transform-origin: center center;
    }
    .card.layout-blob .card-inner { border-radius: inherit !important; }
    .card.layout-blob.display-top { height: 500px !important; }
    @keyframes blob-morph {
      0%   { border-radius: 36% 24% 26% 32% / 30% 22% 28% 24%; transform: rotate(-1deg); }
      50%  { border-radius: 26% 32% 36% 24% / 28% 24% 30% 22%; transform: rotate(1.2deg); }
      100% { border-radius: 24% 36% 32% 26% / 22% 30% 24% 28%; transform: rotate(-0.6deg); }
    }
    .card.layout-blob #tcp-media-screen { display: none !important; }
    .card.layout-blob .header-title { display: none !important; }
    .card.layout-blob .header { padding: 42px 40px 0 40px !important; }
    .card.layout-blob .actions { margin: 0 40px 42px !important; }
    .card.layout-blob .action-btn { border-radius: 42% 58% 46% 54% / 55% 42% 58% 45% !important; }
    .card.layout-blob .action-btn:nth-child(2) { border-radius: 55% 45% 58% 42% / 42% 55% 45% 58% !important; }
    .card.layout-blob .action-btn:nth-child(3) { border-radius: 48% 52% 42% 58% / 58% 45% 55% 42% !important; }
    .card.layout-blob .track { height: 14px !important; border-radius: 16px 4px 16px 5px / 10px 4px 9px 4px !important; }
    .card.layout-blob .fill { border-radius: 14px 3px 14px 4px / 9px 3px 8px 3px !important; }

    .blob-media {
      display: none; position: absolute; top: 76px; left: 50%; transform: translateX(-50%);
      width: 124px; height: 104px; border-radius: 38% 34% 36% 32% / 40% 34% 38% 32%;
      overflow: hidden; z-index: 4; background: transparent; animation: blob-morph-media 7s ease-in-out infinite alternate;
      transition: width 0.35s ease, height 0.35s ease;
    }
    .card.layout-blob .blob-media { display: block; }
    .card.layout-blob.display-top .blob-media { width: 152px; height: 132px; }
    .card.layout-blob.display-background .blob-media-bg { display: none !important; }
    .card.layout-blob.display-background .blob-media { background: color-mix(in srgb, var(--accentA) 20%, var(--bgPanel)); }
    .blob-media-bg { position: absolute; inset: -6px; background-size: cover; background-position: center; }
    @keyframes blob-morph-media { 0% { border-radius: 38% 34% 36% 32% / 40% 34% 38% 32%; } 100% { border-radius: 34% 38% 32% 36% / 34% 40% 32% 38%; } }
    .card.layout-blob .tabs { margin-top: 128px !important; }
    .card.layout-blob.display-top .tabs { margin-top: 156px !important; }
    .card.layout-blob.settings-open .blob-media { display: none !important; }
    .card.layout-blob.collapsed {
      width: 142px !important; height: 50px !important;
      border-radius: 66% 28% 42% 58% / 40% 66% 30% 60% !important;
      animation: blob-morph-collapsed 5s ease-in-out infinite alternate;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 0 22px 3px color-mix(in srgb, var(--accentA) 28%, transparent), 0 10px 22px rgba(0,0,0,0.5) !important;
    }
    .card.layout-blob.collapsed .card-inner { border-radius: inherit !important; }
    .card.layout-blob.collapsed .blob-media { display: none !important; }
    .card.layout-blob.collapsed .mini-player-bar { padding: 0 10px 0 16px !important; }
    .card.layout-blob.collapsed .mini-track { height: 10px !important; border-radius: 11px 3px 10px 4px / 7px 3px 6px 3px !important; }
    .card.layout-blob.collapsed .mini-fill { border-radius: 10px 2px 9px 3px / 6px 2px 5px 2px !important; }
    @keyframes blob-morph-collapsed { 0% { border-radius: 66% 28% 42% 58% / 40% 66% 30% 60%; } 100% { border-radius: 42% 58% 66% 28% / 60% 30% 66% 40%; } }

    .card.layout-cascade { width: 400px !important; height: 430px !important; background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; overflow: visible !important; box-shadow: none !important; border: none !important; }
    .card.layout-cascade #tcp-media-screen { display: none !important; }
    .card.layout-cascade .card-inner {
      position: absolute !important; top: 78px; left: 28px; width: calc(100% - 56px) !important; height: 300px !important;
      background: var(--bgPanel); backdrop-filter: blur(var(--glassBlur)); -webkit-backdrop-filter: blur(var(--glassBlur));
      box-shadow: 0 26px 52px rgba(0,0,0,0.65), 0 4px 14px rgba(0,0,0,0.4); border: 1px solid var(--border);
      overflow: hidden !important; z-index: 3;
      clip-path: polygon(14px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px);
    }
    .card.layout-cascade .card-inner::after {
      content: ''; position: absolute; top: 0; right: 0; width: 40px; height: 40px;
      background: linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.4) 50%); clip-path: polygon(100% 0, 0 0, 100% 100%); pointer-events: none; z-index: 4;
    }
    .cascade-layer-back {
      display: none; position: absolute; top: -14px; left: -14px; width: 72%; height: 38%;
      border-radius: 20px; overflow: hidden; transform: rotate(-14deg); box-shadow: 0 18px 36px rgba(0,0,0,0.5); z-index: 1; transition: transform 0.3s ease;
    }
    .card.layout-cascade .cascade-layer-back { display: block; }
    .cascade-layer-back-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
    .card.layout-cascade.display-background .cascade-layer-back-bg { display: none !important; }
    .card.layout-cascade.display-background .cascade-layer-back { background: color-mix(in srgb, var(--accentA) 22%, var(--bgPanel)); }
    .cascade-layer-mid {
      display: none; position: absolute; bottom: -12px; right: -12px; width: 58%; height: 34%; border-radius: 20px;
      transform: rotate(11deg); background: linear-gradient(135deg, color-mix(in srgb, var(--accentA) 30%, var(--bgPanel)), color-mix(in srgb, var(--accentB) 18%, var(--bgPanel)));
      border: 1px solid color-mix(in srgb, var(--accentA) 45%, transparent); box-shadow: 0 16px 32px rgba(0,0,0,0.45); z-index: 2;
    }
    .card.layout-cascade .cascade-layer-mid { display: block; }
    .card.layout-cascade.collapsed { width: 168px !important; height: 46px !important; }
    .card.layout-cascade.collapsed .card-inner { top: 6px; left: 4px; width: calc(100% - 16px) !important; height: calc(100% - 10px) !important; border-radius: 12px !important; clip-path: none !important; }
    .card.layout-cascade.collapsed .card-inner::after { display: none !important; }
    .card.layout-cascade.collapsed .cascade-layer-back { display: none !important; }
    .card.layout-cascade.collapsed .cascade-layer-mid { width: 34%; height: 60%; bottom: -4px; right: -6px; transform: rotate(10deg); border-radius: 8px; }

    .card.layout-cube {
      width: 230px !important; height: 230px !important; border-radius: 20px !important;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.07), 0 20px 44px rgba(0,0,0,0.6), 0 0 30px 2px color-mix(in srgb, var(--accentA) 18%, transparent) !important;
    }
    .card.layout-cube .card-inner { border-radius: 20px !important; overflow: hidden !important; }
    .card.layout-cube.display-top { width: 268px !important; height: 260px !important; }
    .card.layout-cube .tabs, .card.layout-cube .chips, .card.layout-cube #tcp-view-queue, .card.layout-cube .header-title { display: none !important; }
    .card.layout-cube .header { padding: 12px 12px 0 12px !important; justify-content: flex-end !important; }
    .card.layout-cube .icon-btn { width: 20px !important; height: 20px !important; }
    .card.layout-cube .icon-btn svg { width: 12px !important; height: 12px !important; }
    .card.layout-cube .header > div { gap: 1px !important; }
    .card.layout-cube #tcp-media-screen { display: none !important; }
    .card.layout-cube.display-top #tcp-media-screen {
      display: block !important; position: absolute !important; top: 14px; left: 14px;
      width: 64px !important; height: 64px !important; margin: 0 !important; border-radius: 14px !important;
      opacity: 1 !important; z-index: 2; transform: none !important; clip-path: none !important;
      box-shadow: 0 0 0 2px rgba(255,255,255,0.08), 0 6px 14px rgba(0,0,0,0.5);
    }
    .card.layout-cube.collapsed #tcp-media-screen { display: none !important; }
    .card.layout-cube .content { width: 100% !important; margin-left: 0 !important; }
    .card.layout-cube .panel { padding: 8px 12px !important; }
    .card.layout-cube #tcp-view-status > div:first-child { display: flex !important; flex-direction: column; gap: 8px; align-items: center; justify-content: center; flex: 1; }
    .card.layout-cube .progress-row { flex-direction: column !important; align-items: center !important; gap: 2px !important; margin-bottom: 0 !important; }
    .card.layout-cube .progress-label { order: 2; font-size: 8px !important; }
    .card.layout-cube .progress-value { order: 1; font-size: 14px !important; font-weight: 800; }
    .card.layout-cube .track-wrap { width: 100%; }
    .card.layout-cube .track { width: 100% !important; height: 6px !important; margin: 0 !important; }
    .card.layout-cube .actions { display: grid !important; grid-template-columns: 1fr 1fr 1fr !important; gap: 5px !important; padding: 0 10px 10px !important; }
    .card.layout-cube .action-btn { padding: 6px 2px !important; font-size: 7.5px !important; border-radius: 8px !important; line-height: 1.1; }
    .card.layout-cube.collapsed { width: 46px !important; height: 46px !important; border-radius: 12px !important; }
    .card.layout-cube.collapsed .card-inner { border-radius: 12px !important; }
    .card.layout-cube.collapsed .mini-track-wrap, .card.layout-cube.collapsed .mini-track { display: none !important; }
    .card.layout-cube.collapsed .mini-player-bar { justify-content: center !important; padding: 0 !important; }
    .card.layout-cube.collapsed .mini-percent { font-size: 12px !important; min-width: 0 !important; }

    .card.layout-hologram {
      width: 380px !important; height: 480px !important; border-radius: 6px !important;
      background: rgba(10, 16, 20, 0.55) !important; border: none !important;
      backdrop-filter: blur(18px) saturate(180%) !important; -webkit-backdrop-filter: blur(18px) saturate(180%) !important;
      position: relative;
      clip-path: polygon(0% 0%, 100% 0%, 100% 22%, 94% 26%, 94% 36%, 100% 40%, 100% 62%, 95% 66%, 95% 76%, 100% 80%, 100% 100%, 0% 100%, 0% 72%, 6% 68%, 6% 60%, 0% 55%, 0% 34%, 4% 30%, 4% 22%, 0% 18%);
      -webkit-clip-path: polygon(0% 0%, 100% 0%, 100% 22%, 94% 26%, 94% 36%, 100% 40%, 100% 62%, 95% 66%, 95% 76%, 100% 80%, 100% 100%, 0% 100%, 0% 72%, 6% 68%, 6% 60%, 0% 55%, 0% 34%, 4% 30%, 4% 22%, 0% 18%);
      filter: drop-shadow(0 0 0 1px rgba(0,255,242,0.5)) drop-shadow(0 18px 40px rgba(0,0,0,0.6));
      animation: holo-outline-shift 6s linear infinite;
    }
    .card.layout-hologram .card-inner { clip-path: inherit !important; -webkit-clip-path: inherit !important; }
    .card.layout-hologram.display-top { height: 520px !important; }
    @keyframes holo-outline-shift {
      0%, 100% { filter: drop-shadow(0 0 0 1px rgba(0,255,242,0.55)) drop-shadow(0 18px 40px rgba(0,0,0,0.6)); }
      33%      { filter: drop-shadow(0 0 0 1px rgba(255,0,230,0.55)) drop-shadow(0 18px 40px rgba(0,0,0,0.6)); }
      66%      { filter: drop-shadow(0 0 0 1px rgba(255,238,0,0.5)) drop-shadow(0 18px 40px rgba(0,0,0,0.6)); }
    }
    .card.layout-hologram .card-inner::before {
      content: ''; position: absolute; inset: 0;
      background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 3px);
      pointer-events: none; z-index: 20; animation: holo-scan 5s linear infinite; mix-blend-mode: overlay;
    }
    @keyframes holo-scan { 0% { background-position: 0 0; } 100% { background-position: 0 60px; } }
    .card.layout-hologram .card-inner::after {
      content: ''; position: absolute; inset: -60%;
      background: linear-gradient(115deg, transparent 40%, rgba(0,255,255,0.14) 47%, rgba(255,0,230,0.14) 53%, transparent 60%);
      pointer-events: none; z-index: 19; animation: holo-shine 5.5s ease-in-out infinite;
    }
    @keyframes holo-shine { 0%, 100% { transform: translate(-25%, -15%); } 50% { transform: translate(20%, 15%); } }
    .glitch-bar { display: none; position: absolute; left: 0; width: 100%; background: rgba(0, 255, 242, 0.08); mix-blend-mode: screen; pointer-events: none; z-index: 21; }
    .card.layout-hologram .glitch-bar { display: block; }
    .glitch-bar.bar-1 { top: 24%; height: 8px; animation: glitch-jump-1 4s steps(1) infinite; }
    .glitch-bar.bar-2 { top: 58%; height: 5px; background: rgba(255,0,230,0.08); animation: glitch-jump-2 3.4s steps(1) infinite; }
    .glitch-bar.bar-3 { top: 78%; height: 6px; animation: glitch-jump-1 5s steps(1) infinite reverse; }
    @keyframes glitch-jump-1 {
      0%, 82% { transform: translateX(0); opacity: 0; } 84% { transform: translateX(-8px); opacity: 1; }
      87% { transform: translateX(6px); opacity: 1; } 90%, 100% { transform: translateX(0); opacity: 0; }
    }
    @keyframes glitch-jump-2 {
      0%, 76% { transform: translateX(0); opacity: 0; } 78% { transform: translateX(10px); opacity: 1; }
      81% { transform: translateX(-7px); opacity: 1; } 85%, 100% { transform: translateX(0); opacity: 0; }
    }
    .card.layout-hologram .header-title span, .card.layout-hologram .progress-value {
      color: #f2fefe; text-shadow: -1.5px 0 rgba(0,255,255,0.75), 1.5px 0 rgba(255,0,180,0.75);
    }
    .card.layout-hologram #tcp-media-screen::after {
      content: ''; position: absolute; inset: 0;
      background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px);
      mix-blend-mode: overlay; pointer-events: none;
    }
    .card.layout-hologram.collapsed {
      width: 180px !important; height: 40px !important; border-radius: 4px !important; background: rgba(10, 16, 20, 0.6) !important;
      clip-path: polygon(0% 0%, 100% 0%, 100% 28%, 90% 34%, 90% 50%, 100% 56%, 100% 100%, 0% 100%, 0% 66%, 10% 60%, 10% 42%, 0% 36%);
      -webkit-clip-path: polygon(0% 0%, 100% 0%, 100% 28%, 90% 34%, 90% 50%, 100% 56%, 100% 100%, 0% 100%, 0% 66%, 10% 60%, 10% 42%, 0% 36%);
    }
    .card.layout-hologram.collapsed .glitch-bar { transform-origin: left; }
    .card.layout-hologram.collapsed .glitch-bar.bar-1 { height: 3px; }
    .card.layout-hologram.collapsed .glitch-bar.bar-2 { height: 2px; }
    .card.layout-hologram.collapsed .glitch-bar.bar-3 { display: none; }
    .card.layout-hologram.collapsed .card-inner::before, .card.layout-hologram.collapsed .card-inner::after { opacity: 0.7; }
    .card.layout-hologram.collapsed .mini-percent { color: #f2fefe; text-shadow: -1px 0 rgba(0,255,255,0.8), 1px 0 rgba(255,0,180,0.8); }

    .card.collapsed { width: 180px !important; height: 38px !important; border-radius: 12px !important; box-shadow: 0 8px 25px rgba(0,0,0,0.5) !important; }
    .card.collapsed .ribbon-media-zone, .card.collapsed #tcp-media-screen, .card.collapsed .tabs,
    .card.collapsed .settings-view-inner, .card.collapsed .chips, .card.collapsed .actions,
    .card.collapsed .queue-panel, .card.collapsed .progress-label, .card.collapsed .more-wrap,
    .card.collapsed .gear-btn, .card.collapsed #tcp-quick-theme-btn, .card.collapsed #tcp-collapse-btn,
    .card.collapsed .close-btn, .card.collapsed .radar-media-circle, .card.collapsed .radar-ring,
    .card.collapsed .hex-mini-core, .card.collapsed .hex-chamber { display: none !important; }
    .card.collapsed .header { background: transparent !important; border-bottom: none !important; padding: 0 8px !important; height: 100% !important; }
    .card.collapsed .header-title { display: none !important; }
    .mini-player-bar { display: none; align-items: center; gap: 6px; width: 100%; height: 100%; padding: 0 6px 0 10px; }
    .card.collapsed .mini-player-bar { display: flex !important; }
    .mini-track-wrap { display: contents; }
    .mini-track { flex: 1; height: 4px; border-radius: 999px; background: var(--trackBg); overflow: hidden; }

    .card.layout-vertical-media.collapsed { width: 66px !important; height: 156px !important; border-radius: 33px !important; }
    .card.layout-vertical-media.collapsed .card-inner { border-radius: 33px !important; }
    .card.layout-vertical-media.display-top.collapsed #tcp-media-screen.top-media-screen { height: 0 !important; opacity: 0 !important; }
    .card.layout-vertical-media.collapsed .header { flex-direction: column !important; justify-content: center !important; padding: 16px 0 !important; }
    .card.layout-vertical-media.collapsed .mini-player-bar { flex-direction: column !important; height: auto !important; width: 100% !important; padding: 0 !important; gap: 10px; }
    .card.layout-vertical-media.collapsed .mini-track-wrap { display: flex !important; align-items: center; justify-content: center; width: 100%; height: 88px; flex-shrink: 0; }
    .card.layout-vertical-media.collapsed .mini-track { width: 88px !important; height: 10px !important; transform: rotate(-90deg); flex-shrink: 0; }
    .card.layout-vertical-media.collapsed .mini-percent { text-align: center !important; min-width: 0 !important; font-size: 11px; }

    .card.layout-horizontal-ribbon.collapsed { width: 260px !important; height: 32px !important; border-radius: 16px !important; }
    .card.layout-horizontal-ribbon.collapsed .mini-player-bar { padding: 0 8px 0 14px !important; }
    .card.layout-horizontal-ribbon.collapsed .mini-percent { font-size: 10.5px !important; }
    .card.layout-horizontal-ribbon.display-top.collapsed .ribbon-media-zone { display: none !important; }
    .card.layout-horizontal-ribbon.display-top.collapsed .content { width: 100% !important; margin-left: 0 !important; }

    .card.layout-radar.display-top.collapsed, .card.layout-radar.display-background.collapsed { width: 64px !important; height: 64px !important; border-radius: 50% !important; }
    .card.layout-radar.collapsed .card-inner { border-radius: 50% !important; }
    .card.layout-radar.collapsed .header { display: none !important; }
    .card.layout-radar.collapsed .mini-player-bar { display: none !important; }
    .card.layout-radar.collapsed .radar-media-circle {
      display: flex !important; top: 50% !important; width: 54px !important; height: 54px !important;
      box-shadow: 0 0 0 2px var(--bgPanel), 0 0 0 4px color-mix(in srgb, var(--accentA) 75%, transparent), 0 8px 18px rgba(0,0,0,0.5) !important;
    }
    .card.layout-radar.collapsed .radar-media-bg { display: block !important; }
    .card.layout-radar.collapsed .radar-ring { display: block !important; }
    .card.layout-radar.collapsed .radar-percent { font-size: 11px !important; }
    .card.layout-radar.collapsed .content { pointer-events: none !important; }

    .card.layout-diamond.collapsed {
      width: 50px !important; height: 50px !important; border-radius: 8px !important;
      clip-path: none !important; -webkit-clip-path: none !important; filter: none !important; transform: rotate(45deg);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 0 20px 4px color-mix(in srgb, var(--accentA) 30%, transparent), 0 10px 22px rgba(0,0,0,0.55) !important;
    }
    .card.layout-diamond.collapsed .card-inner { border-radius: 8px !important; clip-path: none !important; -webkit-clip-path: none !important; }
    .card.layout-diamond.collapsed .header { display: none !important; }
    .card.layout-diamond.collapsed .mini-player-bar { display: none !important; }
    .card.layout-diamond.collapsed .content { pointer-events: none !important; }
    .card.layout-diamond.collapsed .diamond-media { display: none !important; }
    .card.layout-diamond.collapsed .diamond-remaining, .card.layout-diamond.collapsed::before, .card.layout-diamond.collapsed::after { display: none !important; }
    .card.layout-diamond.collapsed .diamond-percent {
      display: flex !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) rotate(-45deg) !important;
      pointer-events: auto !important; cursor: grab;
    }
    .card.layout-diamond.collapsed .diamond-percent-value { font-size: 13px !important; }
    .card.layout-diamond.collapsed .diamond-percent-track { display: none !important; }

    .mini-fill {
      height: 100%; width: 0%; border-radius: 999px;
      background: linear-gradient(90deg, var(--accentA), var(--accentB));
      box-shadow: 0 0 8px var(--accentA); transition: width 0.3s ease-in-out;
    }
    .rainbow-theme .mini-fill {
      background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff);
      background-size: 300% 100%; animation: rainbow-gradient-shift 3s infinite linear;
    }
    .mini-percent { font-size: 11px; font-weight: 700; color: var(--textPrimary); font-variant-numeric: tabular-nums; min-width: 28px; text-align: right; }
    .card.rainbow-theme { animation: rainbow-glow 6s infinite alternate ease-in-out; }

    .card-inner { position: relative; border-radius: 20px; overflow: hidden !important; height: 100%; display: flex; flex-direction: column; }
    .bg-layer { position: absolute; inset: 0; background-size: cover; background-position: center; transition: background-image 0.3s ease, opacity 0.3s ease; z-index: 0; opacity: 0; }
    .card.display-background .bg-layer { opacity: 1; }

    .filter-layer {
      position: absolute; inset: 0; background: var(--bgPanel);
      backdrop-filter: blur(var(--glassBlur)) saturate(160%); -webkit-backdrop-filter: blur(var(--glassBlur)) saturate(160%);
      z-index: 1; transition: opacity 0.3s ease, background 0.3s ease;
    }
    .content { position: relative; z-index: 2; display: flex; flex-direction: column; height: 100%; overflow: hidden !important; }

    #tcp-media-screen.top-media-screen {
      position: relative; width: calc(100% - 24px); margin: 10px 12px 0 12px;
      border-top-left-radius: 14px; border-top-right-radius: 14px; border-bottom-left-radius: 0; border-bottom-right-radius: 0;
      height: 0; display: block; flex-shrink: 0; overflow: hidden; background-size: cover; background-position: center;
      transition: height 0.3s ease, opacity 0.3s ease, margin 0.3s ease; opacity: 0; z-index: 3;
    }
    .card.display-top #tcp-media-screen.top-media-screen { height: 190px; opacity: 1; border: 1px solid var(--border); border-bottom: none; }

    .header {
      position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; background: transparent; border-bottom: none; border-top-left-radius: 20px;
      border-top-right-radius: 20px; cursor: grab; flex-shrink: 0;
    }
    .header:active { cursor: grabbing; }

    .header-title { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--textPrimary); letter-spacing: 0.2px; pointer-events: none; }
    .header-dot { width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, var(--accentA), var(--accentB)); box-shadow: 0 0 8px var(--accentA); }
    .rainbow-theme .header-dot { background: linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff); background-size: 300% 300%; animation: rainbow-gradient-shift 4s infinite linear; box-shadow: 0 0 10px rgba(255, 255, 255, 0.6); }

    .icon-btn {
      width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
      background: transparent; border: none; cursor: pointer; color: #d5d8dc;
      transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
    }
    .icon-btn:hover { background: var(--chipBg); color: var(--textPrimary); transform: scale(1.08); }
    .icon-btn.active { background: var(--chipBg); color: var(--textPrimary); }
    .icon-btn svg { width: 16px; height: 16px; }

    .tabs { display: flex; gap: 4px; padding: 0 16px; margin-top: 0; flex-shrink: 0; position: relative; z-index: 4; }
    .tab-btn {
      flex: 1; padding: 7px 10px; font-size: 12px; font-weight: 600; color: var(--textSecondary);
      background: transparent; border: none; border-radius: 8px 8px 0 0; cursor: pointer; position: relative;
      transition: color 0.2s ease, background 0.2s ease;
    }
    .tab-btn.active { color: var(--textPrimary); background: var(--chipBg); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
    .tab-btn.active::after {
      content: ''; position: absolute; left: 10%; right: 10%; bottom: -1px; height: 2px;
      background: linear-gradient(90deg, var(--accentA), var(--accentB)); border-radius: 2px;
    }
    .rainbow-theme .tab-btn.active::after { background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff); background-size: 200% 200%; animation: rainbow-gradient-shift 3s infinite linear; }

    .main-view-wrap { flex: 1; overflow: hidden !important; }
    .panel { padding: 14px 16px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden !important; }
    .fade { animation: fadeIn 0.28s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }

    .progress-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
    .progress-label { font-size: 11.5px; color: var(--textSecondary); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px; }
    .progress-value { font-size: 12.5px; color: var(--textPrimary); font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .track { width: 100%; height: 8px; border-radius: 999px; background: var(--trackBg); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); overflow: hidden; margin-bottom: 10px; }
    .fill { height: 100%; width: 0%; border-radius: 999px; background: linear-gradient(90deg, var(--accentA), var(--accentB)); box-shadow: 0 0 10px var(--accentA); transition: width 0.3s ease-in-out; }
    .rainbow-theme .fill { background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff); background-size: 300% 300%; animation: rainbow-gradient-shift 3s infinite linear; box-shadow: 0 0 12px rgba(255, 255, 255, 0.4); }

    .chips { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
    .chip { background: var(--chipBg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid var(--border); border-radius: 10px; padding: 8px 12px; }
    .chip-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; color: var(--textSecondary); margin-bottom: 2px; }
    .chip-value { font-size: 13px; color: var(--textPrimary); font-weight: 600; }

    .actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .action-btn {
      padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border);
      background: var(--chipBg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      color: var(--textPrimary); font-size: 12px; font-weight: 700; cursor: pointer;
      transition: filter 0.2s ease, transform 0.15s ease, background 0.2s ease;
    }
    .action-btn.primary { background: linear-gradient(135deg, var(--accentA), var(--accentB)); border-color: transparent; color: #17181c; backdrop-filter: none; }
    .action-btn:disabled { opacity: 0.4; cursor: default; pointer-events: none; filter: grayscale(0.3); }
    .rainbow-theme .action-btn.primary {
      background: linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff);
      background-size: 300% 300%; animation: rainbow-gradient-shift 4s infinite linear; color: #ffffff; text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    }
    .action-btn.danger { background: rgba(242, 63, 66, 0.12); border-color: rgba(242, 63, 66, 0.4); color: var(--danger); }
    .action-btn.danger:hover { background: var(--danger); border-color: var(--danger); color: #fff; }
    .action-btn.danger:disabled { opacity: 0.45; cursor: default; pointer-events: none; }
    .action-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
    .action-btn:active { transform: translateY(0); filter: brightness(0.95); }

    .queue-list { display: flex; flex-direction: column; gap: 8px; max-height: 100%; overflow-y: auto; }
    .queue-item {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      background: var(--chipBg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; font-size: 12px; color: var(--textPrimary);
    }
    .queue-item-left { display: flex; align-items: center; gap: 8px; overflow: hidden; }
    .queue-index {
      width: 18px; height: 18px; border-radius: 5px; display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700; color: #17181c; background: linear-gradient(135deg, var(--accentA), var(--accentB)); flex-shrink: 0;
    }
    .rainbow-theme .queue-index { background: linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff); background-size: 200% 200%; animation: rainbow-gradient-shift 3s infinite linear; color: #ffffff; }
    .queue-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .queue-badge { font-size: 9.5px; font-weight: 700; padding: 2px 6px; border-radius: 5px; text-transform: uppercase; flex-shrink: 0; }
    .queue-badge.pending { background: rgba(255,255,255,0.1); color: var(--textSecondary); }
    .queue-badge.processing { background: rgba(255, 178, 56, 0.2); color: var(--accentB); border: 1px solid var(--accentB); }
    .queue-badge.completed { background: rgba(35, 165, 90, 0.2); color: #23a55a; border: 1px solid #23a55a; }
    .queue-empty { font-size: 12px; color: var(--textSecondary); text-align: center; padding: 12px 0; }

    .loading-screen {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 50;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; width: auto; max-width: 85%;
      background: rgba(12, 12, 16, 0.95); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.5);
      padding: 18px 24px; text-align: center; opacity: 1; transition: opacity 0.35s ease;
      cursor: pointer;
    }
    .loading-screen.hidden { opacity: 0; pointer-events: none; }
    .loading-title { font-size: 13px; font-weight: 700; letter-spacing: 0.5px; color: var(--textPrimary); text-transform: uppercase; }
    .loading-gif {
      width: 80px; height: 80px; border-radius: 14px; object-fit: cover;
      box-shadow: 0 0 16px rgba(0,0,0,0.5), 0 0 10px var(--accentA); border: 1px solid var(--border);
    }
    .loading-status { font-size: 11.5px; color: var(--textSecondary); font-weight: 600; min-height: 18px; }

    .toast {
      position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%) translateY(10px); z-index: 30;
      display: flex; align-items: center; gap: 8px; max-width: calc(100% - 24px);
      background: var(--headerBg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.45); opacity: 0; pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease, background 0.3s ease, border-color 0.3s ease;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }
    .toast-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--accentA), var(--accentB)); box-shadow: 0 0 8px var(--accentA); }
    .toast-text { font-size: 11.5px; font-weight: 600; color: var(--textPrimary); flex: 1; }
    .toast-close {
      width: 18px; height: 18px; border-radius: 5px; display: flex; align-items: center; justify-content: center;
      background: transparent; border: none; cursor: pointer; color: var(--textSecondary); flex-shrink: 0; transition: background 0.15s ease, color 0.15s ease;
    }
    .toast-close:hover { background: var(--chipBg); color: var(--textPrimary); }
    .toast-close svg { width: 12px; height: 12px; }

    .card.layout-diamond .toast { left: 50%; top: 50%; bottom: auto; transform: translate(-50%, calc(-50% + 10px)); z-index: 40; }
    .card.layout-diamond .toast.show { transform: translate(-50%, -50%); }
    .toast-dot.success { background: linear-gradient(135deg, #23a55a, #3ba55d); box-shadow: 0 0 8px #23a55a; }

    .settings-view-inner { padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto; }
    .field-group { display: flex; flex-direction: column; gap: 4px; }
    .settings-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; color: var(--textSecondary); font-weight: 700; display: flex; justify-content: space-between; }
    .settings-row { display: flex; gap: 8px; align-items: center; }

    .settings-slider {
      flex: 1; -webkit-appearance: none; appearance: none; height: 6px; border-radius: 999px;
      background: rgba(255, 255, 255, 0.15); outline: none; transition: background 0.2s;
    }
    .settings-slider::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accentA), var(--accentB)); cursor: pointer;
      box-shadow: 0 0 8px var(--accentA);
    }

    .settings-input {
      flex: 1; background: var(--chipBg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px;
      font-size: 12px; color: var(--textPrimary); outline: none; font-family: inherit; transition: border-color 0.2s ease;
    }
    .settings-input::placeholder { color: var(--textSecondary); }
    .settings-input:focus { border-color: var(--accentA); }
    .settings-save-btn {
      padding: 0 14px; border-radius: 8px; border: none; cursor: pointer;
      background: linear-gradient(135deg, var(--accentA), var(--accentB)); color: #17181c; font-weight: 700; font-size: 12px;
      transition: filter 0.2s ease, transform 0.15s ease;
    }
    .settings-save-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }

    /* dashboard menu */
    .more-wrap { position: relative; }

    .dropdown-menu {
      position: fixed;
      width: min(720px, calc(100vw - 28px));
      max-height: min(88vh, 600px);
      overflow-y: auto !important;
      overflow-x: hidden;
      background: rgba(12, 14, 18, 0.96) !important;
      backdrop-filter: blur(36px) saturate(190%);
      -webkit-backdrop-filter: blur(36px) saturate(190%);
      border: 1px solid rgba(255, 255, 255, 0.16) !important;
      border-radius: 22px;
      padding: 16px 18px;
      box-shadow: 
        0 30px 75px rgba(0, 0, 0, 0.9),
        0 0 0 1px rgba(255, 255, 255, 0.08) inset,
        0 0 35px color-mix(in srgb, var(--accentA) 25%, transparent) !important;
      opacity: 0;
      transform: translateY(-8px) scale(0.97);
      pointer-events: none;
      transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 2147483647 !important;
      font-family: 'gg sans', 'Segoe UI', Roboto, Arial, sans-serif;
    }

    .dropdown-menu.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .xbox-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 12px;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.09);
    }
    .xbox-profile-tag {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .xbox-dash-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accentA), var(--accentB));
      box-shadow: 0 0 10px var(--accentA);
    }
    .xbox-dash-title {
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #fff;
    }
    .xbox-dash-hint {
      font-size: 11px;
      color: #9aa0a6;
      font-weight: 600;
    }

    .xbox-close-menu-btn {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.14);
      cursor: pointer;
      color: #e3e5e8;
      transition: all 0.16s ease;
      padding: 0;
      flex-shrink: 0;
    }
    .xbox-close-menu-btn:hover {
      background: rgba(242, 63, 66, 0.25);
      border-color: rgba(242, 63, 66, 0.6);
      color: #ff5c5c;
      transform: scale(1.08);
    }
    .xbox-close-menu-btn svg { width: 15px; height: 15px; }

    .xbox-dash-grid {
      display: grid;
      grid-template-columns: 1fr 220px;
      gap: 16px;
    }
    @media (max-width: 600px) {
      .xbox-dash-grid { grid-template-columns: 1fr; }
    }

    .xbox-section-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .xbox-sec-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: #ffffff;
    }
    .xbox-sec-sub {
      font-size: 10px;
      color: #949ba4;
      font-weight: 600;
    }

    /* layout tiles */
    .xbox-tiles-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 6px;
    }
    @media (max-width: 600px) {
      .xbox-tiles-grid { grid-template-columns: repeat(3, 1fr); }
    }
    .xbox-shapes-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .xbox-tile {
      background: rgba(255, 255, 255, 0.04);
      border: 1.5px solid rgba(255, 255, 255, 0.09);
      border-radius: 10px;
      padding: 6px 3px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      color: #cfd4dc;
      outline: none;
      position: relative;
    }
    .xbox-tile:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px) scale(1.03);
      color: #ffffff;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
    }
    .xbox-tile.active {
      background: color-mix(in srgb, var(--accentA) 18%, rgba(255,255,255,0.08)) !important;
      border-color: var(--accentA) !important;
      box-shadow: 0 0 0 2px var(--accentA), 0 8px 24px rgba(0, 0, 0, 0.7), 0 0 16px color-mix(in srgb, var(--accentA) 35%, transparent) !important;
      color: #ffffff !important;
    }

    .xbox-tile-preview {
      width: 100%;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.35);
      border-radius: 6px;
      padding: 2px;
      transition: transform 0.18s ease;
    }
    .xbox-tile:hover .xbox-tile-preview { transform: scale(1.04); }
    .xbox-tile-preview svg { width: 34px; height: 26px; display: block; }
    .xbox-tile-name {
      font-size: 9.5px;
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }

    .xbox-right-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-left: 14px;
      border-left: 1px solid rgba(255, 255, 255, 0.09);
    }

    .theme-swatches {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 7px !important;
      padding: 2px 0 !important;
    }
    .swatch {
      width: 42px !important;
      height: 42px !important;
      border-radius: 11px !important;
      border: 2px solid rgba(255, 255, 255, 0.12) !important;
      cursor: pointer !important;
      padding: 0 !important;
      position: relative !important;
      transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease !important;
      display: block !important;
    }
    .swatch.rainbow-swatch {
      background: linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff) !important;
      background-size: 200% 200% !important;
      animation: rainbow-gradient-shift 3s infinite linear !important;
    }
    .swatch:hover {
      transform: scale(1.12) translateY(-2px) !important;
      border-color: #ffffff !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7) !important;
    }
    .swatch.active {
      border-color: #ffffff !important;
      box-shadow: 0 0 0 2px var(--accentA), 0 0 16px var(--accentA) !important;
      transform: scale(1.06) !important;
    }

    .xbox-divider { height: 1px; background: rgba(255, 255, 255, 0.08); margin: 2px 0; }

    .support-dev-card {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      width: 100% !important;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), color-mix(in srgb, var(--accentA) 24%, transparent)) !important;
      border: 1.5px solid color-mix(in srgb, var(--accentA) 45%, rgba(255,255,255,0.15)) !important;
      border-radius: 14px !important;
      padding: 10px 10px !important;
      gap: 8px !important;
      cursor: pointer !important;
      text-align: left !important;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .support-dev-card:hover {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), color-mix(in srgb, var(--accentA) 40%, transparent)) !important;
      border-color: var(--accentA) !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), 0 0 20px color-mix(in srgb, var(--accentA) 35%, transparent) !important;
      transform: translateY(-2px) scale(1.02) !important;
    }
    .support-dev-gif {
      width: 32px !important;
      height: 32px !important;
      border-radius: 8px !important;
      object-fit: cover !important;
      flex-shrink: 0 !important;
      display: block !important;
      box-shadow: 0 0 10px rgba(0,0,0,0.6) !important;
    }
    .support-badge {
      font-size: 9px !important;
      font-weight: 800 !important;
      letter-spacing: 0.5px !important;
      color: #17181c !important;
      background: linear-gradient(135deg, var(--accentA), var(--accentB)) !important;
      padding: 3px 6px !important;
      border-radius: 6px !important;
      flex-shrink: 0 !important;
    }

    .mode-toggle-group { display: flex; background: var(--chipBg); border-radius: 8px; padding: 2px; border: 1px solid var(--border); }
    .mode-btn {
      flex: 1; padding: 5px 8px; font-size: 11px; font-weight: 600; color: var(--textSecondary);
      background: transparent; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s ease;
    }
    .mode-btn.active { background: var(--headerBg); color: var(--textPrimary); box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
    .mode-hint { font-size: 10px; color: var(--textSecondary); margin-top: 3px; line-height: 1.3; }
  `;
  root.appendChild(styleEl);
  // #endregion

  // #region Template Markup
  var card = document.createElement('div');
  card.className = 'card display-background';
  card.innerHTML = `
    <div class="card-inner">
      <div class="bg-layer" id="tcp-bg-layer"></div>
      <div class="filter-layer" id="tcp-filter-layer"></div>

      <!-- Hexagon Mini Core -->
      <div class="hex-mini-core" id="tcp-hex-mini-core">
        <span id="tcp-hex-mini-percent">0%</span>
      </div>

      <!-- Hexagon Chamber -->
      <div class="hex-chamber" id="tcp-hex-chamber">
        <div class="hex-media-wrap" id="tcp-hex-media">
          <div class="hex-media-bg" id="tcp-hex-bg"></div>
        </div>
        <svg class="hex-ring-svg" id="tcp-hex-ring" viewBox="0 0 120 120">
          <polygon class="hex-ring-track" points="60,10 103.3,35 103.3,85 60,110 16.7,85 16.7,35" />
          <polygon class="hex-ring-fill" id="tcp-hex-ring-fill" points="60,10 103.3,35 103.3,85 60,110 16.7,85 16.7,35" />
        </svg>
        <div class="hex-core-percent" id="tcp-hex-percent">0%</div>
      </div>

      <div class="radar-media-circle" id="tcp-radar-media">
        <div class="radar-media-bg" id="tcp-radar-bg"></div>
        <div class="radar-percent" id="tcp-radar-percent">0%</div>
      </div>

      <div class="diamond-facet facet-tr"></div>
      <div class="diamond-facet facet-br"></div>
      <div class="diamond-facet facet-bl"></div>
      <div class="diamond-facet facet-tl"></div>

      <div class="diamond-media" id="tcp-diamond-media">
        <div class="diamond-media-bg" id="tcp-diamond-bg"></div>
      </div>
      <div class="diamond-percent" id="tcp-diamond-percent">
        <div class="diamond-percent-value" id="tcp-diamond-percent-value">0%</div>
        <div class="diamond-percent-track"><div class="diamond-percent-fill" id="tcp-diamond-percent-fill"></div></div>
      </div>
      <div class="diamond-remaining">
        <div class="diamond-remaining-label" data-i18n="diamond_remaining">Осталось</div>
        <div class="diamond-remaining-value" id="tcp-diamond-remaining">0</div>
      </div>

      <div class="blob-media" id="tcp-blob-media">
        <div class="blob-media-bg" id="tcp-blob-bg"></div>
      </div>
      <svg class="radar-ring" id="tcp-radar-ring" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="tcp-radar-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--accentA)"></stop>
            <stop offset="100%" stop-color="var(--accentB)"></stop>
          </linearGradient>
        </defs>
        <circle class="radar-ring-track" cx="50" cy="50" r="47"></circle>
        <circle class="radar-ring-fill" id="tcp-radar-ring-fill" cx="50" cy="50" r="47"></circle>
      </svg>

      <div class="loading-screen" id="tcp-loader" data-i18n-title="click_to_skip" title="Нажмите, чтобы пропустить">
        <div class="loading-title" data-i18n="init_panel">Инициализация панели</div>
        <img class="loading-gif" id="tcp-loading-gif-img" alt="Загрузка..." />
        <div class="loading-status" id="tcp-loader-status" data-i18n="prep_components">Подготовка компонентов...</div>
      </div>

      <div class="ribbon-media-zone" id="tcp-ribbon-media">
        <div class="ribbon-media-bg" id="tcp-ribbon-bg"></div>
      </div>

      <div class="content">
        <div id="tcp-media-screen" class="top-media-screen"></div>

        <div class="header" id="tcp-drag-handle">
          <div class="header-title">
            <span class="header-dot"></span>
            <span>Task Control Panel</span>
          </div>

          <div class="mini-player-bar">
            <div class="mini-track-wrap"><div class="mini-track"><div class="mini-fill" id="tcp-mini-fill"></div></div></div>
            <div class="mini-percent" id="tcp-mini-percent">0%</div>
            <button class="icon-btn" id="tcp-unfold-btn" data-i18n-title="unfold_btn" title="Развернуть">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </button>
          </div>

          <div style="display:flex; gap:4px; align-items:center;">
            <button class="icon-btn" id="tcp-quick-theme-btn" data-i18n-title="quick_theme_btn" title="Быстрая смена темы">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l1.8 5.5L19 9l-5.2 1.5L12 16l-1.8-5.5L5 9l5.2-1.5z"/><path d="M19 15l.9 2.6L22 18l-2.1.8L19 21l-.9-2.2L16 18l2.1-.4z"/></svg>
            </button>
            <button class="icon-btn gear-btn" id="tcp-gear-btn" data-i18n-title="settings_btn" title="Настройки">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1Compat-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>

            <div class="more-wrap">
              <button class="icon-btn" id="tcp-more-btn" data-i18n-title="more_btn" title="Дополнительно (Дашборд)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </button>
            </div>

            <button class="icon-btn collapse-btn" id="tcp-collapse-btn" data-i18n-title="collapse_btn" title="Свернуть">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
            </button>

            <button class="icon-btn close-btn" id="tcp-close-btn" data-i18n-title="close_btn" title="Закрыть">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div class="tabs" id="tcp-tabs-bar">
          <button class="tab-btn active" data-tab="status" data-i18n="tab_status">🎯 Текущий статус</button>
          <button class="tab-btn" data-tab="queue" data-i18n="tab_queue">📋 Очередь задач</button>
        </div>

        <div class="main-view-wrap">
          <div class="panel fade" id="tcp-view-status">
            <div>
              <div class="progress-row">
                <span class="progress-label" id="tcp-task-name-label" data-i18n="progress_label">Прогресс выполнения</span>
                <span class="progress-value" id="tcp-progress-val">00:00 / 00:00 (0.0%)</span>
              </div>

              <div class="track-wrap">
                <div class="track">
                  <div class="fill" id="tcp-progress-fill"></div>
                </div>
              </div>

              <div class="chips">
                <div class="chip">
                  <div class="chip-label" data-i18n="elapsed_label">Времени прошло</div>
                  <div class="chip-value" id="tcp-elapsed-val">00:00</div>
                </div>
                <div class="chip">
                  <div class="chip-label" data-i18n="remaining_label">Осталось задач</div>
                  <div class="chip-value" id="tcp-remaining-val">0</div>
                </div>
              </div>
            </div>

            <div class="actions" id="tcp-actions-bar">
              <button class="action-btn primary" id="tcp-skip-btn" data-i18n="btn_skip">Пропустить шаг</button>
              <button class="action-btn" id="tcp-restart-btn" data-i18n="btn_restart">Перезапуск</button>
              <button class="action-btn danger" id="tcp-stop-btn" data-i18n="btn_stop">Остановка процесса</button>
            </div>
          </div>

          <div class="panel fade queue-panel" id="tcp-view-queue" style="display: none;">
            <div class="queue-list" id="tcp-queue-list"></div>
          </div>

          <div class="panel fade" id="tcp-view-settings" style="display: none;">
            <div class="settings-view-inner">
              <div class="field-group">
                <div class="settings-label" data-i18n="bg_url_label">URL фона (GIF / MP4 / WebM)</div>
                <div class="settings-row">
                  <input type="text" class="settings-input" id="tcp-bg-url-input" placeholder="https://..." />
                </div>
              </div>

              <div class="field-group">
                <div class="settings-label">
                  <span data-i18n="blur_label">Размытие стекла (Blur)</span>
                  <span id="tcp-blur-val">20px</span>
                </div>
                <div class="settings-row">
                  <input type="range" class="settings-slider" id="tcp-blur-slider" min="0" max="40" value="20" />
                </div>
              </div>

              <div class="field-group">
                <div class="settings-label">
                  <span data-i18n="opacity_label">Прозрачность (Opacity)</span>
                  <span id="tcp-opacity-val">92%</span>
                </div>
                <div class="settings-row">
                  <input type="range" class="settings-slider" id="tcp-opacity-slider" min="20" max="100" value="92" />
                </div>
              </div>

              <div class="field-group">
                <div class="settings-label" data-i18n="lang_label">Язык интерфейса</div>
                <div class="mode-toggle-group">
                  <button class="mode-btn" data-lang-mode="ru">🇷🇺 Русский</button>
                  <button class="mode-btn" data-lang-mode="en">🇬🇧 English</button>
                </div>
              </div>

              <div class="field-group">
                <div class="settings-label" data-i18n="voice_label">Голосовой ассистент (Cyber Voice)</div>
                <div class="mode-toggle-group">
                  <button class="mode-btn" data-voice-mode="on" data-i18n="btn_on">Вкл</button>
                  <button class="mode-btn" data-voice-mode="off" data-i18n="btn_off">Выкл</button>
                </div>
              </div>

              <div class="field-group">
                <div class="settings-label" data-i18n="click_sound_label">Sci-Fi клики кнопок</div>
                <div class="mode-toggle-group">
                  <button class="mode-btn" data-click-sound-mode="on" data-i18n="btn_on">Вкл</button>
                  <button class="mode-btn" data-click-sound-mode="off" data-i18n="btn_off">Выкл</button>
                </div>
              </div>

              <div class="field-group">
                <div class="settings-label" data-i18n="sound_label">Звук уведомлений</div>
                <div class="mode-toggle-group">
                  <button class="mode-btn" data-sound-mode="on" data-i18n="btn_on">Вкл</button>
                  <button class="mode-btn" data-sound-mode="off" data-i18n="btn_off">Выкл</button>
                </div>
              </div>

              <div class="field-group">
                <div class="settings-label" data-i18n="claim_label">Авто-клейм наград</div>
                <div class="mode-toggle-group">
                  <button class="mode-btn" data-claim-mode="on" data-i18n="btn_on">Вкл</button>
                  <button class="mode-btn" data-claim-mode="off" data-i18n="btn_off">Выкл</button>
                </div>
                <div class="mode-hint" id="tcp-claim-hint" data-i18n="claim_hint">Автоматически забирает промокод/награду сразу после завершения задания.</div>
              </div>

              <div class="field-group">
                <div class="settings-label" data-i18n="display_mode_label">Режим отображения фона</div>
                <div class="mode-toggle-group">
                  <button class="mode-btn" data-display-mode="background" data-i18n="display_bg">В фоне</button>
                  <button class="mode-btn" data-display-mode="top" data-i18n="display_top">Сверху</button>
                </div>
                <div class="mode-hint" id="tcp-mode-hint"></div>
              </div>

              <div class="settings-row" style="margin-top: auto; justify-content: flex-end;">
                <button class="action-btn" id="tcp-settings-cancel-btn" style="flex: none; padding: 8px 16px;" data-i18n="btn_cancel">Отмена</button>
                <button class="settings-save-btn" id="tcp-settings-save-btn" data-i18n="btn_save">Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="toast" id="tcp-toast">
        <div class="toast-dot" id="tcp-toast-dot"></div>
        <div class="toast-text" id="tcp-toast-text">Сообщение</div>
        <button class="toast-close" id="tcp-toast-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>

    <div class="cascade-layer-back" id="tcp-cascade-back">
      <div class="cascade-layer-back-bg" id="tcp-cascade-bg"></div>
    </div>
    <div class="cascade-layer-mid"></div>

    <div class="glitch-bar bar-1"></div>
    <div class="glitch-bar bar-2"></div>
    <div class="glitch-bar bar-3"></div>
  `;
  root.appendChild(card);
  // #endregion

  // #region Dashboard Menu Markup
  var dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'dropdown-menu';
  dropdownMenu.id = 'tcp-dropdown';
  dropdownMenu.innerHTML = `
    <div class="xbox-top-bar">
      <div class="xbox-profile-tag">
        <span class="xbox-dash-dot"></span>
        <span class="xbox-dash-title" data-i18n="dash_title">DASHBOARD & CUSTOMIZATION</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="xbox-dash-hint" data-i18n="dash_hint">Кликните по плитке для выбора</span>
        <button class="xbox-close-menu-btn" id="tcp-dropdown-close-btn" data-i18n-title="close_menu" title="Закрыть меню">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>

    <div class="xbox-dash-grid">
      <div class="xbox-left-col">
        <div class="xbox-section-header">
          <span class="xbox-sec-title" data-i18n="sec_layouts">📐 МАКЕТЫ ИНТЕРФЕЙСА</span>
          <span class="xbox-sec-sub" data-i18n="sec_layouts_sub">10 вариантов расположения</span>
        </div>
        <div class="xbox-tiles-grid" id="tcp-layout-tiles">
          <button class="xbox-tile active" data-layout="classic" title="Классический">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 40 28" fill="none">
                <rect x="2" y="2" width="36" height="24" rx="4" stroke="currentColor" stroke-width="1.5"/>
                <rect x="6" y="6" width="28" height="4" rx="1" fill="currentColor" opacity="0.4"/>
                <rect x="6" y="13" width="16" height="2" rx="1" fill="currentColor"/>
                <rect x="6" y="17" width="28" height="3" rx="1.5" fill="currentColor" opacity="0.6"/>
                <rect x="6" y="22" width="8" height="2" rx="1" fill="currentColor"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="layout_classic">Классика</span>
          </button>

          <button class="xbox-tile" data-layout="vertical-media" title="Вертикальный">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 40 28" fill="none">
                <rect x="11" y="1" width="18" height="26" rx="4" stroke="currentColor" stroke-width="1.5"/>
                <rect x="14" y="4" width="12" height="8" rx="2" fill="currentColor" opacity="0.4"/>
                <rect x="14" y="14" width="12" height="2" rx="1" fill="currentColor"/>
                <rect x="14" y="18" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.6"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="layout_vertical">Вертикаль</span>
          </button>

          <button class="xbox-tile" data-layout="horizontal-ribbon" title="Горизонтальный">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 40 28" fill="none">
                <rect x="1" y="6" width="38" height="16" rx="4" stroke="currentColor" stroke-width="1.5"/>
                <rect x="4" y="9" width="10" height="10" rx="2" fill="currentColor" opacity="0.4"/>
                <rect x="17" y="10" width="12" height="2" rx="1" fill="currentColor"/>
                <rect x="17" y="14" width="19" height="3" rx="1.5" fill="currentColor" opacity="0.6"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="layout_ribbon">Лента</span>
          </button>

          <button class="xbox-tile" data-layout="slant" title="Грань">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 40 28" fill="none">
                <path d="M4 2 H36 Q38 2 38 4 L38 22 Q38 26 34 26 L6 26 Q2 26 2 24 L2 4 Q2 2 4 2 Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M2 3 H38 V11 L2 15 Z" fill="currentColor" opacity="0.4"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="layout_slant">Грань</span>
          </button>

          <button class="xbox-tile" data-layout="blob" title="Капля">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 40 28" fill="none">
                <path d="M7 8 C7 3, 33 2, 33 7 C33 12, 37 21, 31 24 C25 27, 10 26, 7 22 C4 18, 7 13, 7 8 Z" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.2"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="layout_blob">💧 Капля</span>
          </button>

          <button class="xbox-tile" data-layout="cascade" title="Каскад">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 40 28" fill="none">
                <rect x="4" y="3" width="20" height="14" rx="3" transform="rotate(-8 4 3)" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" opacity="0.4"/>
                <rect x="15" y="10" width="20" height="14" rx="3" transform="rotate(8 15 10)" stroke="currentColor" stroke-width="1" opacity="0.6"/>
                <rect x="8" y="5" width="24" height="18" rx="3" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.2"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="layout_cascade">🃏 Каскад</span>
          </button>

          <button class="xbox-tile" data-layout="cube" title="Куб">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 40 28" fill="none">
                <rect x="10" y="4" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.5"/>
                <rect x="14" y="8" width="12" height="4" rx="1" fill="currentColor" opacity="0.4"/>
                <rect x="13" y="15" width="14" height="4" rx="1.5" fill="currentColor" opacity="0.6"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="layout_cube">🧊 Куб</span>
          </button>

          <button class="xbox-tile" data-layout="hologram" title="Голограмма">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 40 28" fill="none">
                <path d="M4 2 H36 V8 L34 10 V14 L36 16 V26 H4 V20 L6 18 V14 L4 12 Z" stroke="currentColor" stroke-width="1.5"/>
                <line x1="5" y1="9" x2="35" y2="9" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
                <line x1="5" y1="18" x2="35" y2="18" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="layout_hologram">📼 Голо</span>
          </button>

          <button class="xbox-tile" data-layout="pipboy" title="📺 CRT / Pip-Boy">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 40 28" fill="none">
                <rect x="2" y="1" width="36" height="26" rx="6" stroke="currentColor" stroke-width="1.8"/>
                <rect x="6" y="4" width="28" height="15" rx="3" stroke="currentColor" stroke-width="1" fill="currentColor" fill-opacity="0.15"/>
                <line x1="8" y1="8" x2="32" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
                <line x1="8" y1="12" x2="32" y2="12" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
                <rect x="6" y="21" width="18" height="3" rx="1" fill="currentColor" opacity="0.8"/>
                <circle cx="28" cy="22.5" r="1.5" fill="currentColor"/>
                <circle cx="32" cy="22.5" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="layout_pipboy">📺 Pip-Boy</span>
          </button>

          <!-- Layout: Hexagon -->
          <button class="xbox-tile" data-layout="hex" title="⬢ Гексагон / Mecha Cockpit">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 40 28" fill="none">
                <rect x="2" y="3" width="36" height="22" rx="3" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
                <polygon points="12,6 18,10 18,18 12,22 6,18 6,10" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.25"/>
                <line x1="22" y1="9" x2="34" y2="9" stroke="currentColor" stroke-width="1.2"/>
                <line x1="22" y1="14" x2="34" y2="14" stroke="currentColor" stroke-width="1.2" opacity="0.6"/>
                <line x1="22" y1="19" x2="30" y2="19" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="layout_hex">⬢ Гексагон</span>
          </button>
        </div>

        <div class="xbox-section-header" style="margin-top: 14px;">
          <span class="xbox-sec-title" data-i18n="sec_shapes">💎 ФОРМА ОКНА (ФИГУРЫ)</span>
          <span class="xbox-sec-sub" data-i18n="sec_shapes_sub">Форм-фактор корпуса</span>
        </div>
        <div class="xbox-tiles-grid xbox-shapes-grid" id="tcp-structure-tiles">
          <button class="xbox-tile active" data-structure="classic" title="Классический прямоугольник">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 32 32" fill="none">
                <rect x="3" y="6" width="26" height="20" rx="4" stroke="currentColor" stroke-width="1.8"/>
                <rect x="7" y="10" width="18" height="3" rx="1" fill="currentColor" opacity="0.5"/>
                <rect x="7" y="16" width="12" height="4" rx="1" fill="currentColor"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="shape_classic">Классика</span>
          </button>

          <button class="xbox-tile" data-structure="radar" title="Мини-Сфера / Радар">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="1.8"/>
                <circle cx="16" cy="16" r="6" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 3"/>
                <circle cx="16" cy="16" r="2.5" fill="currentColor"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="shape_radar">📡 Радар</span>
          </button>

          <button class="xbox-tile" data-structure="diamond" title="Ромб">
            <div class="xbox-tile-preview">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M16 2 L29 16 L16 30 L3 16 Z" stroke="currentColor" stroke-width="1.8"/>
                <line x1="16" y1="3" x2="16" y2="29" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
                <line x1="3" y1="16" x2="29" y2="16" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
                <rect x="13" y="13" width="6" height="6" fill="currentColor" opacity="0.7"/>
              </svg>
            </div>
            <span class="xbox-tile-name" data-i18n="shape_diamond">💎 Ромб</span>
          </button>
        </div>
      </div>

      <div class="xbox-right-col">
        <div>
          <div class="xbox-section-header">
            <span class="xbox-sec-title" data-i18n="sec_themes">🎨 ПАЛИТРА ТЕМ</span>
          </div>
          <div class="theme-swatches" id="tcp-theme-swatches"></div>
        </div>

        <div class="xbox-divider"></div>

        <div>
          <div class="xbox-section-header">
            <span class="xbox-sec-title" data-i18n="sec_author">💖 АВТОР ПРОЕКТА</span>
          </div>
          <button class="support-dev-card" id="tcp-support-dev-btn" title="Поддержать автора">
            <img class="support-dev-gif" id="tcp-support-gif-img" alt="" />
            <div class="item-text-group">
              <span class="item-title" style="color:#ffffff !important; font-size:11px !important; font-weight:700;" data-i18n="author_help">Помочь проекту</span>
              <span class="item-sub" style="color:#cbd5e1 !important; font-size:9.5px !important;" data-i18n="author_sub">Донат разработчику</span>
            </div>
            <div class="support-badge">DONATE</div>
          </button>
        </div>
      </div>
    </div>
  `;
  root.appendChild(dropdownMenu);

  Object.entries(THEME_BASE).forEach(function (entry) {
    card.style.setProperty('--' + entry[0], entry[1]);
  });
  // #endregion

  // #region Utilities, Audio & Speech
  function $(sel) { return root.querySelector(sel); }
  function $$(sel) { return root.querySelectorAll(sel); }

  function applyLanguage(lang) {
    state.language = lang;
    $$('[data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      if (I18N[lang] && I18N[lang][key]) {
        el.textContent = I18N[lang][key];
      }
    });
    $$('[data-i18n-title]').forEach(function (el) {
      var key = el.dataset.i18nTitle;
      if (I18N[lang] && I18N[lang][key]) {
        el.title = I18N[lang][key];
      }
    });
    $$('.mode-btn[data-lang-mode]').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.langMode === lang);
    });

    var hintEl = $('#tcp-mode-hint');
    if (hintEl) {
      hintEl.textContent = state.displayMode === 'top' ? t('display_hint_top') : t('display_hint_bg');
    }

    renderSwatches();
    renderQueue();
    saveSettings();
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    var m = Math.floor(seconds / 60).toString().padStart(2, '0');
    var s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return m + ':' + s;
  }

  var audioCtx = null;

  function playNotifySound() {
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      var now = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.09);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch (err) {}
  }

  function playSciFiClick() {
    if (!state.clickSoundsEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      var now = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.035);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  function speakVoice(text) {
    if (!state.voiceEnabled || typeof window.speechSynthesis === 'undefined') return;
    try {
      window.speechSynthesis.cancel();
      var utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = state.language === 'en' ? 'en-US' : 'ru-RU';
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  function showToast(text, duration, type) {
    duration = duration || 3000;
    type = type || 'info';
    var toast = $('#tcp-toast');
    var toastText = $('#tcp-toast-text');
    var toastDot = $('#tcp-toast-dot');

    if (!toast || !toastText || !toastDot) return;

    toastText.textContent = text;
    toastDot.className = type === 'success' ? 'toast-dot success' : 'toast-dot';

    if (state.theme === 'rainbow') {
      toast.classList.add('rainbow-toast');
    } else {
      toast.classList.remove('rainbow-toast');
    }

    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, duration);
    playNotifySound();
  }
  // #endregion

  // #region Glass Effects
  function applyGlassEffects() {
    card.style.setProperty('--glassBlur', state.glassBlur + 'px');
    card.style.setProperty('--glassOpacity', (state.glassOpacity / 100).toFixed(2));
    card.style.setProperty('--bgPanel', 'rgba(14, 14, 18, ' + (state.glassOpacity / 100).toFixed(2) + ')');

    var blurValEl = $('#tcp-blur-val');
    if (blurValEl) blurValEl.textContent = state.glassBlur + 'px';
    var opacityValEl = $('#tcp-opacity-val');
    if (opacityValEl) opacityValEl.textContent = state.glassOpacity + '%';

    var bSlider = $('#tcp-blur-slider');
    if (bSlider) bSlider.value = String(state.glassBlur);
    var oSlider = $('#tcp-opacity-slider');
    if (oSlider) oSlider.value = String(state.glassOpacity);
  }
  // #endregion

  // #region Media Renderer
  function setElementMedia(containerEl, url) {
    if (!containerEl) return;
    containerEl.innerHTML = '';
    var isVideo = /\.(mp4|webm)(\?.*)?$/i.test(url);

    if (isVideo) {
      containerEl.style.backgroundImage = 'none';
      var video = document.createElement('video');
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.src = url;
      Object.assign(video.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        pointerEvents: 'none'
      });
      containerEl.appendChild(video);
    } else {
      containerEl.style.backgroundImage = 'url("' + url + '")';
    }
  }

  function updateMediaSources(url) {
    backgroundImageUrl = url;
    setElementMedia($('#tcp-bg-layer'), url);
    setElementMedia($('#tcp-media-screen'), url);
    setElementMedia($('#tcp-ribbon-bg'), url);
    setElementMedia($('#tcp-radar-bg'), url);
    setElementMedia($('#tcp-diamond-bg'), url);
    setElementMedia($('#tcp-cascade-bg'), url);
    setElementMedia($('#tcp-blob-bg'), url);
    setElementMedia($('#tcp-hex-bg'), url);
  }
  // #endregion

  // #region Themes & Layout Controller
  function applyTheme(themeKey) {
    state.theme = themeKey;
    var tData = themes[themeKey] || themes.classic;

    if (tData.isRainbow) {
      card.classList.add('rainbow-theme');
    } else {
      card.classList.remove('rainbow-theme');
      card.style.setProperty('--accentA', tData.accentA);
      card.style.setProperty('--accentB', tData.accentB);
    }

    card.classList.toggle('inferno-glow', Boolean(tData.hasGlow));
    card.classList.toggle('abyss-glow', Boolean(tData.hasWave));
    card.classList.toggle('cyberpunk-glow', Boolean(tData.hasCyber));
    card.classList.toggle('valorant-glow', Boolean(tData.hasValorant));
    card.classList.toggle('matrix-glow', Boolean(tData.hasMatrix));
    card.classList.toggle('celestial-glow', Boolean(tData.hasCelestial));

    $$('.swatch').forEach(function (sw) {
      sw.classList.toggle('active', sw.dataset.theme === themeKey);
    });

    saveSettings();
  }

  function renderSwatches() {
    var container = $('#tcp-theme-swatches');
    if (!container) return;
    container.innerHTML = '';
    themeOrder.forEach(function (key) {
      var tData = themes[key];
      var btn = document.createElement('button');
      btn.className = 'swatch' + (tData.isRainbow ? ' rainbow-swatch' : '');
      btn.dataset.theme = key;
      btn.title = state.language === 'en' ? tData.nameEn : tData.name;
      if (!tData.isRainbow) {
        btn.style.background = 'linear-gradient(135deg, ' + tData.accentA + ', ' + tData.accentB + ')';
      }
      btn.addEventListener('click', function () {
        playSciFiClick();
        applyTheme(key);
      });
      container.appendChild(btn);
    });
  }

  function setDisplayMode(mode) {
    state.displayMode = mode;
    card.classList.remove('display-background', 'display-top');
    var hintEl = $('#tcp-mode-hint');
    if (mode === 'top') {
      card.classList.add('display-top');
      if (hintEl) hintEl.textContent = t('display_hint_top');
    } else {
      card.classList.add('display-background');
      if (hintEl) hintEl.textContent = t('display_hint_bg');
    }

    $$('.mode-btn[data-display-mode]').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.displayMode === mode);
    });
    saveSettings();
  }

  function setLayoutMode(mode) {
    state.layoutMode = mode;
    card.classList.remove('layout-vertical-media', 'layout-horizontal-ribbon', 'layout-radar', 'layout-slant', 'layout-diamond', 'layout-blob', 'layout-cascade', 'layout-cube', 'layout-hologram', 'layout-pipboy', 'layout-hex');

    if (mode === 'vertical-media') card.classList.add('layout-vertical-media');
    else if (mode === 'horizontal-ribbon') card.classList.add('layout-horizontal-ribbon');
    else if (mode === 'slant') card.classList.add('layout-slant');
    else if (mode === 'blob') card.classList.add('layout-blob');
    else if (mode === 'cascade') card.classList.add('layout-cascade');
    else if (mode === 'cube') card.classList.add('layout-cube');
    else if (mode === 'hologram') card.classList.add('layout-hologram');
    else if (mode === 'pipboy') card.classList.add('layout-pipboy');
    else if (mode === 'hex') card.classList.add('layout-hex');

    $$('#tcp-dropdown [data-layout]').forEach(function (item) { item.classList.toggle('active', item.dataset.layout === mode); });
    $$('#tcp-dropdown [data-structure]').forEach(function (item) { item.classList.toggle('active', item.dataset.structure === 'classic'); });
    saveSettings();
  }

  function setStructureMode(mode) {
    state.structureMode = mode;
    if (mode === 'radar') {
      card.classList.remove('layout-vertical-media', 'layout-horizontal-ribbon', 'layout-slant', 'layout-diamond', 'layout-blob', 'layout-cascade', 'layout-cube', 'layout-hologram', 'layout-pipboy', 'layout-hex');
      card.classList.add('layout-radar');
      state.layoutMode = 'classic';
      $$('#tcp-dropdown [data-layout]').forEach(function (item) { item.classList.toggle('active', item.dataset.layout === 'classic'); });
    } else if (mode === 'diamond') {
      card.classList.remove('layout-vertical-media', 'layout-horizontal-ribbon', 'layout-slant', 'layout-radar', 'layout-blob', 'layout-cascade', 'layout-cube', 'layout-hologram', 'layout-pipboy', 'layout-hex');
      card.classList.add('layout-diamond');
      state.layoutMode = 'classic';
      $$('#tcp-dropdown [data-layout]').forEach(function (item) { item.classList.toggle('active', item.dataset.layout === 'classic'); });
    } else {
      card.classList.remove('layout-radar', 'layout-diamond');
    }

    $$('#tcp-dropdown [data-structure]').forEach(function (item) { item.classList.toggle('active', item.dataset.structure === mode); });
    updateProgressUI(state.progress, 100);
    saveSettings();
  }
  // #endregion

  // #region Progress & Queue UI
  var RADAR_RING_CIRCUMFERENCE = 2 * Math.PI * 47;
  var HEX_RING_PERIMETER = 300;

  function updateProgressUI(current, target) {
    target = target || 100;
    var curVal = Math.max(0, current);
    var tarVal = Math.max(1, target);
    var pct = Math.min(100, (curVal / tarVal) * 100);
    state.progress = pct;

    var pctExact = pct.toFixed(1);
    var pctInt = Math.floor(pct);

    var progValEl = $('#tcp-progress-val');
    if (progValEl) {
      if (target > 100 || current > 0) {
        progValEl.textContent = formatTime(curVal) + ' / ' + formatTime(tarVal) + ' (' + pctExact + '%)';
      } else {
        progValEl.textContent = pctExact + '%';
      }
    }

    var fillWidth = pct.toFixed(2) + '%';
    var progFill = $('#tcp-progress-fill');
    if (progFill) progFill.style.width = fillWidth;
    var miniFill = $('#tcp-mini-fill');
    if (miniFill) miniFill.style.width = fillWidth;
    var miniPct = $('#tcp-mini-percent');
    if (miniPct) miniPct.textContent = pctInt + '%';

    var hexRing = $('#tcp-hex-ring-fill');
    if (hexRing) {
      hexRing.style.strokeDasharray = String(HEX_RING_PERIMETER);
      hexRing.style.strokeDashoffset = String(HEX_RING_PERIMETER * (1 - pct / 100));
    }
    var hexCorePct = $('#tcp-hex-percent');
    if (hexCorePct) hexCorePct.textContent = pctInt + '%';
    var hexMiniPct = $('#tcp-hex-mini-percent');
    if (hexMiniPct) hexMiniPct.textContent = pctInt + '%';

    var radPct = $('#tcp-radar-percent');
    if (radPct) radPct.textContent = pctInt + '%';
    var diaVal = $('#tcp-diamond-percent-value');
    if (diaVal) diaVal.textContent = pctExact + '%';
    var diaFill = $('#tcp-diamond-percent-fill');
    if (diaFill) diaFill.style.width = fillWidth;

    var ringFill = $('#tcp-radar-ring-fill');
    if (ringFill) {
      ringFill.style.strokeDasharray = String(RADAR_RING_CIRCUMFERENCE);
      ringFill.style.strokeDashoffset = String(RADAR_RING_CIRCUMFERENCE * (1 - pct / 100));
    }
  }

  function renderQueue() {
    var list = $('#tcp-queue-list');
    if (!list) return;
    list.innerHTML = '';

    if (state.queue.length === 0) {
      list.innerHTML = '<div class="queue-empty">' + t('queue_empty') + '</div>';
      var remEl = $('#tcp-remaining-val');
      if (remEl) remEl.textContent = '0';
      var diaRem = $('#tcp-diamond-remaining');
      if (diaRem) diaRem.textContent = '0';
      return;
    }

    state.queue.forEach(function (item, index) {
      var el = document.createElement('div');
      el.className = 'queue-item';

      var badgeText = t('queue_pending');
      var badgeClass = 'pending';

      if (item.status === 'processing') {
        badgeText = t('queue_processing');
        badgeClass = 'processing';
      } else if (item.status === 'completed') {
        badgeText = t('queue_completed');
        badgeClass = 'completed';
      }

      el.innerHTML = `
        <div class="queue-item-left">
          <div class="queue-index">${index + 1}</div>
          <div class="queue-title" title="${item.title}">${item.title}</div>
        </div>
        <div class="queue-badge ${badgeClass}">${badgeText}</div>
      `;
      list.appendChild(el);
    });

    var remaining = state.queue.filter(function (q) { return q.status !== 'completed'; }).length;
    var remEl2 = $('#tcp-remaining-val');
    if (remEl2) remEl2.textContent = String(remaining);
    var diaRem2 = $('#tcp-diamond-remaining');
    if (diaRem2) diaRem2.textContent = String(remaining);
  }

  function stopActiveTask() {
    if (activeTaskCleanup) {
      try { activeTaskCleanup(); } catch (e) {}
      activeTaskCleanup = null;
    }
  }
  // #endregion

  // #region Automation & Quest Handlers
  function autoEnrollQuests(callback) {
    if (!isDiscordConnected || !QuestsStore || !api) {
      if (callback) callback(0);
      return;
    }
    try {
      var unenrolled = Array.from(QuestsStore.quests.values()).filter(function (x) {
        var tc = x.config.taskConfig || x.config.taskConfigV2;
        var hasTask = tc && supportedTasks.some(function (y) { return Object.keys(tc.tasks).includes(y); });
        return !x.userStatus?.enrolledAt && !x.userStatus?.completedAt && new Date(x.config.expiresAt).getTime() > Date.now() && hasTask;
      });

      if (unenrolled.length === 0) {
        if (callback) callback(0);
        return;
      }

      var accepted = 0;
      var completed = 0;

      function checkDone() {
        completed++;
        if (completed >= unenrolled.length && callback) {
          callback(accepted);
        }
      }

      unenrolled.forEach(function (q) {
        api.post({ url: '/quests/' + q.id + '/enroll', body: { location: 1 } })
          .then(function () {
            accepted++;
            checkDone();
          })
          .catch(function () {
            api.post({ url: '/quests/' + q.id + '/enroll' })
              .then(function () { accepted++; })
              .catch(function () {})
              .then(checkDone);
          });
      });
    } catch (e) {
      console.error("[QuestWidget] Error auto-enrolling quests:", e);
      if (callback) callback(0);
    }
  }

  function claimQuestReward(quest, questName, callback) {
    if (!state.autoClaimEnabled || !api) {
      if (callback) callback(false);
      return;
    }

    var endpoints = [
      { url: '/quests/' + quest.id + '/claim-reward', body: { platform: 0 } },
      { url: '/quests/' + quest.id + '/claim-reward', body: {} },
      { url: '/quests/' + quest.id + '/claim', body: { platform: 0 } },
      { url: '/quests/' + quest.id + '/claim', body: {} },
      { url: '/quests/' + quest.id + '/reward-code', body: {} }
    ];

    function tryClaim(idx) {
      if (idx >= endpoints.length) {
        if (callback) callback(false);
        return;
      }

      var ep = endpoints[idx];
      api.post({ url: ep.url, body: ep.body })
        .then(function (res) {
          var code = res && res.body && (res.body.code || res.body.reward_code || (res.body.claim_code && res.body.claim_code.code) || res.body.claim_code);
          if (code && typeof code === 'string') {
            showToast(t('toast_reward_code') + questName + '): ' + code, 8000, 'success');
            speakVoice(t('voice_reward_code'));
            try {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code);
              }
            } catch (e) {}
          } else {
            showToast(t('toast_reward_success') + questName + t('toast_reward_success_tail'), 4500, 'success');
            speakVoice(t('voice_reward_success'));
          }
          if (callback) callback(true);
        })
        .catch(function () {
          tryClaim(idx + 1);
        });
    }

    tryClaim(0);
  }

  function claimAllPreviouslyCompletedQuests(callback) {
    if (!state.autoClaimEnabled || !api || !QuestsStore) {
      if (callback) callback(0);
      return;
    }
    try {
      var completedUnclaimed = Array.from(QuestsStore.quests.values()).filter(function (x) {
        return x.userStatus && x.userStatus.completedAt && !x.userStatus.claimedAt;
      });

      if (completedUnclaimed.length === 0) {
        if (callback) callback(0);
        return;
      }

      var claimed = 0;
      var count = 0;

      completedUnclaimed.forEach(function (q) {
        var qName = q.config && q.config.messages ? q.config.messages.questName : 'Discord Quest';
        claimQuestReward(q, qName, function (ok) {
          if (ok) claimed++;
          count++;
          if (count >= completedUnclaimed.length && callback) {
            callback(claimed);
          }
        });
      });
    } catch (e) {
      if (callback) callback(0);
    }
  }

  function fetchDiscordQuests() {
    if (!isDiscordConnected || !QuestsStore) return [];
    try {
      return Array.from(QuestsStore.quests.values()).filter(function (x) {
        var tc = x.config.taskConfig || x.config.taskConfigV2;
        var hasTask = tc && supportedTasks.some(function (y) { return Object.keys(tc.tasks).includes(y); });
        return x.userStatus?.enrolledAt && !x.userStatus?.completedAt && new Date(x.config.expiresAt).getTime() > Date.now() && hasTask;
      });
    } catch (e) {
      console.error("[QuestWidget] Error fetching quests:", e);
      return [];
    }
  }

  function runNextQuest() {
    if (state.isStopped) return;

    if (state.currentStepIndex >= state.queue.length) {
      updateProgressUI(100, 100);
      showToast(t('all_quests_done'), 4000, 'success');
      speakVoice(t('all_quests_done_voice'));
      var lbl = $('#tcp-task-name-label');
      if (lbl) lbl.textContent = t('all_quests_completed_lbl');
      return;
    }

    var item = state.queue[state.currentStepIndex];
    item.status = 'processing';
    renderQueue();
    updateProgressUI(0, 100);

    var quest = item.quest;
    var questName = item.title;
    var lbl2 = $('#tcp-task-name-label');
    if (lbl2) lbl2.textContent = questName;
    speakVoice(t('voice_running_quest') + questName);

    var pid = Math.floor(Math.random() * 30000) + 1000;
    var taskConfig = quest.config.taskConfig || quest.config.taskConfigV2;
    var taskName = supportedTasks.find(function (x) { return taskConfig.tasks[x] != null; });
    var taskData = taskConfig.tasks[taskName];
    var applicationId = quest.config.application?.id || (taskData.applications && taskData.applications[0] && taskData.applications[0].id);
    var secondsNeeded = taskData.target;
    var secondsDone = quest.userStatus?.progress?.[taskName]?.value || 0;

    var halfwayAnnounced = false;

    updateProgressUI(secondsDone, secondsNeeded);

    var isCurrentCancelled = false;

    function onQuestFinished() {
      if (isCurrentCancelled) return;
      stopActiveTask();
      item.status = 'completed';
      state.currentStepIndex++;
      renderQueue();
      updateProgressUI(secondsNeeded, secondsNeeded);
      showToast(t('quest_completed') + questName, 3000, 'success');

      claimQuestReward(quest, questName, function () {
        setTimeout(function () { runNextQuest(); }, 1200);
      });
    }

    function checkMilestones(currentSec) {
      if (!halfwayAnnounced && (currentSec / secondsNeeded) >= 0.5) {
        halfwayAnnounced = true;
        speakVoice(t('voice_progress_50'));
      }
    }

    // task: watch video
    if (taskName === "WATCH_VIDEO" || taskName === "WATCH_VIDEO_ON_MOBILE") {
      var speed = 7;
      var isRunning = true;
      var curDone = secondsDone;

      activeTaskCleanup = function () {
        isRunning = false;
        isCurrentCancelled = true;
      };

      showToast(t('toast_watching_video') + questName, 2500);

      function videoStep() {
        if (!isRunning || state.isStopped) return;
        var remaining = Math.min(speed, secondsNeeded - curDone);

        setTimeout(function () {
          if (!isRunning || state.isStopped) return;
          var timestamp = curDone + speed;

          api.post({
            url: '/quests/' + quest.id + '/video-progress',
            body: { timestamp: Math.min(secondsNeeded, timestamp + Math.random()) }
          }).then(function (res) {
            curDone = Math.min(secondsNeeded, timestamp);
            updateProgressUI(curDone, secondsNeeded);
            checkMilestones(curDone);

            if ((res && res.body && res.body.completed_at != null) || timestamp >= secondsNeeded) {
              api.post({ url: '/quests/' + quest.id + '/video-progress', body: { timestamp: secondsNeeded } })
                .catch(function () {})
                .then(function () {
                  if (isRunning && !state.isStopped) onQuestFinished();
                });
            } else {
              videoStep();
            }
          }).catch(function (err) {
            console.error('[QuestWidget] Video task error:', err);
            if (isRunning && !state.isStopped) onQuestFinished();
          });
        }, remaining * 1000);
      }

      videoStep();
    } 

    // task: play on desktop
    else if (taskName === "PLAY_ON_DESKTOP") {
      if (!isApp) {
        showToast(t('toast_desktop_required') + questName, 3500);
        setTimeout(function () { onQuestFinished(); }, 2000);
        return;
      }

      api.get({ url: '/applications/public?application_ids=' + applicationId }).then(function (res) {
        if (isCurrentCancelled || state.isStopped) return;

        var appData = res.body[0];
        var winExe = appData.executables && appData.executables.find(function (x) { return x.os === "win32"; });
        var exeName = (winExe && winExe.name ? winExe.name.replace(">", "") : null) || appData.name.replace(/[\/\\:*?"<>|]/g, "");

        var fakeGame = {
          cmdLine: 'C:\\Program Files\\' + appData.name + '\\' + exeName,
          exeName: exeName,
          exePath: 'c:/program files/' + appData.name.toLowerCase() + '/' + exeName,
          hidden: false,
          isLauncher: false,
          id: applicationId,
          name: appData.name,
          pid: pid,
          pidPath: [pid],
          processName: appData.name,
          start: Date.now(),
        };

        var realGames = RunningGameStore.getRunningGames();
        var fakeGames = [fakeGame];
        var realGetRunningGames = RunningGameStore.getRunningGames;
        var realGetGameForPID = RunningGameStore.getGameForPID;

        RunningGameStore.getRunningGames = function () { return fakeGames; };
        RunningGameStore.getGameForPID = function (p) { return fakeGames.find(function (x) { return x.pid === p; }); };
        FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: realGames, added: [fakeGame], games: fakeGames });

        var fn = function (data) {
          if (isCurrentCancelled || state.isStopped) return;
          var progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.PLAY_ON_DESKTOP.value);
          updateProgressUI(progress, secondsNeeded);
          checkMilestones(progress);

          if (progress >= secondsNeeded) {
            onQuestFinished();
          }
        };

        activeTaskCleanup = function () {
          isCurrentCancelled = true;
          RunningGameStore.getRunningGames = realGetRunningGames;
          RunningGameStore.getGameForPID = realGetGameForPID;
          FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: [] });
          FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
        };

        FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
        showToast(t('toast_emulating_game') + appData.name, 3000);
      }).catch(function (err) {
        console.error(err);
        onQuestFinished();
      });
    }

    // task: stream on desktop
    else if (taskName === "STREAM_ON_DESKTOP") {
      if (!isApp) {
        showToast(t('toast_stream_required') + questName, 3500);
        setTimeout(function () { onQuestFinished(); }, 2000);
        return;
      }

      var realFunc = ApplicationStreamingStore.getStreamerActiveStreamMetadata;
      ApplicationStreamingStore.getStreamerActiveStreamMetadata = function () {
        return {
          id: applicationId,
          pid: pid,
          sourceName: null
        };
      };

      var streamFn = function (data) {
        if (isCurrentCancelled || state.isStopped) return;
        var progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.STREAM_ON_DESKTOP.value);
        updateProgressUI(progress, secondsNeeded);
        checkMilestones(progress);

        if (progress >= secondsNeeded) {
          onQuestFinished();
        }
      };

      activeTaskCleanup = function () {
        isCurrentCancelled = true;
        ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;
        FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", streamFn);
      };

      FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", streamFn);
      showToast(t('toast_stream_spoofed') + questName + t('toast_stream_spoofed_tail'), 4000);
    }

    // task: play activity
    else if (taskName === "PLAY_ACTIVITY") {
      var allGuilds = GuildChannelStore && GuildChannelStore.getAllGuilds ? GuildChannelStore.getAllGuilds() : {};
      var vocalGuild = Object.values(allGuilds).find(function (x) { return x != null && x.VOCAL && x.VOCAL.length > 0; });
      var channelId = (ChannelStore && ChannelStore.getSortedPrivateChannels && ChannelStore.getSortedPrivateChannels()[0]?.id) || (vocalGuild && vocalGuild.VOCAL[0]?.channel?.id);
      var streamKey = 'call:' + channelId + ':1';
      var isActivityRunning = true;

      activeTaskCleanup = function () {
        isActivityRunning = false;
        isCurrentCancelled = true;
      };

      showToast(t('toast_activity') + questName, 2500);

      function activityStep() {
        if (!isActivityRunning || state.isStopped) return;

        api.post({ url: '/quests/' + quest.id + '/heartbeat', body: { stream_key: streamKey, terminal: false } })
          .then(function (res) {
            var progress = res?.body?.progress?.PLAY_ACTIVITY?.value || 0;
            updateProgressUI(progress, secondsNeeded);
            checkMilestones(progress);

            if (progress >= secondsNeeded) {
              api.post({ url: '/quests/' + quest.id + '/heartbeat', body: { stream_key: streamKey, terminal: true } })
                .catch(function () {})
                .then(function () {
                  if (isActivityRunning && !state.isStopped) onQuestFinished();
                });
            } else {
              setTimeout(activityStep, 20000);
            }
          })
          .catch(function (err) {
            console.error('[QuestWidget] Play Activity error:', err);
            if (isActivityRunning && !state.isStopped) onQuestFinished();
          });
      }

      activityStep();
    }
  }

  function startAutomation() {
    stopActiveTask();
    state.isStopped = false;
    state.currentStepIndex = 0;
    state.progress = 0;
    state.elapsedSeconds = 0;

    var skipBtn = $('#tcp-skip-btn');
    if (skipBtn) skipBtn.disabled = false;
    var stopBtn = $('#tcp-stop-btn');
    if (stopBtn) stopBtn.disabled = false;

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      if (!state.isStopped) {
        state.elapsedSeconds++;
        var el = $('#tcp-elapsed-val');
        if (el) el.textContent = formatTime(state.elapsedSeconds);
      }
    }, 1000);

    var handled = false;
    function proceed(acceptedCount) {
      if (handled) return;
      handled = true;

      if (acceptedCount > 0) {
        showToast(t('toast_auto_enrolled') + acceptedCount, 3500, 'success');
        speakVoice(t('voice_auto_enrolled') + acceptedCount);
      }

      claimAllPreviouslyCompletedQuests(function (claimedPrev) {
        if (claimedPrev > 0) {
          showToast(t('toast_claimed_prev') + claimedPrev, 3500, 'success');
        }

        var rawQuests = fetchDiscordQuests();
        state.queue = rawQuests.map(function (q, idx) {
          return {
            id: q.id,
            title: q.config && q.config.messages ? q.config.messages.questName : 'Discord Quest',
            status: idx === 0 ? 'processing' : 'pending',
            quest: q
          };
        });

        renderQueue();

        if (state.queue.length === 0) {
          showToast(t('all_quests_done'), 3000);
          speakVoice(t('all_quests_done_voice'));
          var taskLabel = $('#tcp-task-name-label');
          if (taskLabel) taskLabel.textContent = t('no_active_quests_lbl');
          var progVal = $('#tcp-progress-val');
          if (progVal) progVal.textContent = '00:00 / 00:00 (100%)';
          updateProgressUI(100, 100);
        } else {
          runNextQuest();
        }
      });
    }

    setTimeout(function () { proceed(0); }, 2500);

    autoEnrollQuests(function (count) {
      proceed(count);
    });
  }
  // #endregion

  // #region Event Listeners
  $$('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      playSciFiClick();
      var tab = btn.dataset.tab;
      state.activeTab = tab;

      $$('.tab-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === tab); });
      var stView = $('#tcp-view-status');
      if (stView) stView.style.display = tab === 'status' ? 'flex' : 'none';
      var qView = $('#tcp-view-queue');
      if (qView) qView.style.display = tab === 'queue' ? 'flex' : 'none';
      var setView = $('#tcp-view-settings');
      if (setView) setView.style.display = 'none';
    });
  });

  var gearBtn = $('#tcp-gear-btn');
  if (gearBtn) {
    gearBtn.addEventListener('click', function () {
      playSciFiClick();
      var tBar = $('#tcp-tabs-bar');
      if (tBar) tBar.style.display = 'none';
      var aBar = $('#tcp-actions-bar');
      if (aBar) aBar.style.display = 'none';
      var sView = $('#tcp-view-status');
      if (sView) sView.style.display = 'none';
      var qView = $('#tcp-view-queue');
      if (qView) qView.style.display = 'none';
      card.classList.add('settings-open');

      var bgInp = $('#tcp-bg-url-input');
      if (bgInp) bgInp.value = backgroundImageUrl;
      var setView = $('#tcp-view-settings');
      if (setView) setView.style.display = 'flex';
    });
  }

  function closeSettings() {
    var setView = $('#tcp-view-settings');
    if (setView) setView.style.display = 'none';
    var tBar = $('#tcp-tabs-bar');
    if (tBar) tBar.style.display = 'flex';
    var aBar = $('#tcp-actions-bar');
    if (aBar) aBar.style.display = 'grid';
    card.classList.remove('settings-open');

    var activeTab = state.activeTab;
    var sView = $('#tcp-view-status');
    if (sView) sView.style.display = activeTab === 'status' ? 'flex' : 'none';
    var qView = $('#tcp-view-queue');
    if (qView) qView.style.display = activeTab === 'queue' ? 'flex' : 'none';
  }

  var cancelBtn = $('#tcp-settings-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      playSciFiClick();
      closeSettings();
    });
  }

  var saveBtn = $('#tcp-settings-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      playSciFiClick();
      var bgInp = $('#tcp-bg-url-input');
      var newUrl = bgInp ? bgInp.value.trim() : '';
      if (newUrl) updateMediaSources(newUrl);
      closeSettings();
      saveSettings();
      showToast(t('toast_saved'), 2500, 'success');
    });
  }

  var blurSlider = $('#tcp-blur-slider');
  if (blurSlider) {
    blurSlider.addEventListener('input', function (e) {
      state.glassBlur = parseInt(e.target.value, 10);
      applyGlassEffects();
    });
    blurSlider.addEventListener('change', function () { saveSettings(); });
  }

  var opSlider = $('#tcp-opacity-slider');
  if (opSlider) {
    opSlider.addEventListener('input', function (e) {
      state.glassOpacity = parseInt(e.target.value, 10);
      applyGlassEffects();
    });
    opSlider.addEventListener('change', function () { saveSettings(); });
  }

  var bgInp2 = $('#tcp-bg-url-input');
  if (bgInp2) bgInp2.addEventListener('keydown', function (e) { e.stopPropagation(); });

  $$('.mode-btn[data-lang-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      playSciFiClick();
      applyLanguage(btn.dataset.langMode);
      showToast(t('toast_lang_changed'), 2000, 'success');
    });
  });

  $$('.mode-btn[data-display-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      playSciFiClick();
      setDisplayMode(btn.dataset.displayMode);
    });
  });

  $$('.mode-btn[data-sound-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      playSciFiClick();
      state.soundEnabled = btn.dataset.soundMode === 'on';
      $$('.mode-btn[data-sound-mode]').forEach(function (b) {
        b.classList.toggle('active', b.dataset.soundMode === btn.dataset.soundMode);
      });
      if (state.soundEnabled) playNotifySound();
      saveSettings();
    });
  });

  $$('.mode-btn[data-click-sound-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.clickSoundsEnabled = btn.dataset.clickSoundMode === 'on';
      $$('.mode-btn[data-click-sound-mode]').forEach(function (b) {
        b.classList.toggle('active', b.dataset.clickSoundMode === btn.dataset.clickSoundMode);
      });
      playSciFiClick();
      saveSettings();
    });
  });

  $$('.mode-btn[data-voice-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      playSciFiClick();
      state.voiceEnabled = btn.dataset.voiceMode === 'on';
      $$('.mode-btn[data-voice-mode]').forEach(function (b) {
        b.classList.toggle('active', b.dataset.voiceMode === btn.dataset.voiceMode);
      });
      if (state.voiceEnabled) speakVoice(t('voice_enabled'));
      saveSettings();
    });
  });

  $$('.mode-btn[data-claim-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      playSciFiClick();
      state.autoClaimEnabled = btn.dataset.claimMode === 'on';
      $$('.mode-btn[data-claim-mode]').forEach(function (b) {
        b.classList.toggle('active', b.dataset.claimMode === btn.dataset.claimMode);
      });
      saveSettings();
    });
  });
  var dropdown = $('#tcp-dropdown');

  function positionDropdown(btnEl) {
    if (!dropdown || !btnEl) return;
    var menuWidth = Math.min(720, window.innerWidth - 30);
    var left = Math.max(15, Math.min(window.innerWidth - menuWidth - 15, (window.innerWidth - menuWidth) / 2));
    var btnRect = btnEl.getBoundingClientRect();
    var top = btnRect.bottom + 10;

    if (top + 460 > window.innerHeight) {
      top = Math.max(15, (window.innerHeight - 460) / 2);
    }

    dropdown.style.left = left + 'px';
    dropdown.style.top = top + 'px';
  }

  var qThBtn = $('#tcp-quick-theme-btn');
  if (qThBtn) {
    qThBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      playSciFiClick();
      positionDropdown(e.currentTarget);
      dropdown.classList.toggle('open');
    });
  }

  var moreBtn = $('#tcp-more-btn');
  if (moreBtn) {
    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      playSciFiClick();
      var opening = !dropdown.classList.contains('open');
      if (opening) {
        positionDropdown(e.currentTarget);
      }
      dropdown.classList.toggle('open');
    });
  }

  var dropCloseBtn = $('#tcp-dropdown-close-btn');
  if (dropCloseBtn) {
    dropCloseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      playSciFiClick();
      if (dropdown) dropdown.classList.remove('open');
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (dropdown && dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
      }
    }
  });

  document.addEventListener('click', function (e) {
    if (!host.contains(e.target) && dropdown) dropdown.classList.remove('open');
  });

  $$('#tcp-dropdown [data-layout]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      playSciFiClick();
      setLayoutMode(btn.dataset.layout);
    });
  });

  $$('#tcp-dropdown [data-structure]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      playSciFiClick();
      setStructureMode(btn.dataset.structure);
    });
  });

  var supBtn = $('#tcp-support-dev-btn');
  if (supBtn) {
    supBtn.addEventListener('click', function () {
      playSciFiClick();
      window.open(SUPPORT_DEV_URL, '_blank', 'noopener,noreferrer');
      if (dropdown) dropdown.classList.remove('open');
    });
  }

  var skipBtn = $('#tcp-skip-btn');
  if (skipBtn) {
    skipBtn.addEventListener('click', function () {
      playSciFiClick();
      if (state.currentStepIndex < state.queue.length) {
        stopActiveTask();
        state.queue[state.currentStepIndex].status = 'completed';
        state.currentStepIndex++;
        renderQueue();
        showToast(t('quest_skipped'), 2000);
        speakVoice(t('quest_skipped'));
        runNextQuest();
      }
    });
  }

  var reBtn = $('#tcp-restart-btn');
  if (reBtn) {
    reBtn.addEventListener('click', function () {
      playSciFiClick();
      startAutomation();
      showToast(t('process_restarted'), 2000);
    });
  }

  var stopBtn = $('#tcp-stop-btn');
  if (stopBtn) {
    stopBtn.addEventListener('click', function () {
      playSciFiClick();
      stopActiveTask();
      state.isStopped = true;
      if (timerInterval) clearInterval(timerInterval);
      var sk = $('#tcp-skip-btn');
      if (sk) sk.disabled = true;
      var st = $('#tcp-stop-btn');
      if (st) st.disabled = true;
      showToast(t('process_stopped'), 2500);
      speakVoice(t('voice_process_stopped'));
    });
  }

  var colBtn = $('#tcp-collapse-btn');
  if (colBtn) {
    colBtn.addEventListener('click', function () {
      playSciFiClick();
      state.isCollapsed = true;
      card.classList.add('collapsed');
      if (dropdown) dropdown.classList.remove('open');
    });
  }

  var unfBtn = $('#tcp-unfold-btn');
  if (unfBtn) {
    unfBtn.addEventListener('click', function () {
      playSciFiClick();
      state.isCollapsed = false;
      card.classList.remove('collapsed');
    });
  }

  var clsBtn = $('#tcp-close-btn');
  if (clsBtn) {
    clsBtn.addEventListener('click', function () {
      playSciFiClick();
      if (window.__task_widget_cleanup__) window.__task_widget_cleanup__();
      host.remove();
    });
  }

  var toastCls = $('#tcp-toast-close');
  if (toastCls) {
    toastCls.addEventListener('click', function () {
      playSciFiClick();
      var toastBox = $('#tcp-toast');
      if (toastBox) toastBox.classList.remove('show');
    });
  }
  // #endregion

  // #region Drag & Drop (Snapping)
  var dragHandle = $('#tcp-drag-handle');
  var isDragging = false;
  var startX = 0, startY = 0;
  var initialLeft = 0, initialTop = 0;

  function startDrag(e) {
    if (e.target.closest('button')) return;
    isDragging = true;
    startX = e.clientX; startY = e.clientY;
    var rect = host.getBoundingClientRect();
    initialLeft = rect.left; initialTop = rect.top;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  if (dragHandle) dragHandle.addEventListener('mousedown', startDrag);

  var hexCore = $('#tcp-hex-mini-core');
  if (hexCore) {
    hexCore.addEventListener('mousedown', function (e) {
      if (!state.isCollapsed) return;
      startDrag(e);
    });
    hexCore.addEventListener('click', function () {
      if (state.isCollapsed) $('#tcp-unfold-btn').click();
    });
  }

  var radarMediaCircle = $('#tcp-radar-media');
  if (radarMediaCircle) {
    radarMediaCircle.addEventListener('mousedown', function (e) {
      if (!state.isCollapsed) return;
      startDrag(e);
    });
    radarMediaCircle.addEventListener('click', function () {
      if (state.isCollapsed) $('#tcp-unfold-btn').click();
    });
  }

  var diamondPercent = $('#tcp-diamond-percent');
  if (diamondPercent) {
    diamondPercent.addEventListener('mousedown', function (e) {
      if (!state.isCollapsed) return;
      startDrag(e);
    });
    diamondPercent.addEventListener('click', function () {
      if (state.isCollapsed) $('#tcp-unfold-btn').click();
    });
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;

    var targetX = initialLeft + dx;
    var targetY = initialTop + dy;

    var snapDist = 24;
    var cardW = card.offsetWidth || 420;
    var cardH = card.offsetHeight || 310;

    if (targetX < snapDist) targetX = 0;
    if (targetX + cardW > window.innerWidth - snapDist) targetX = window.innerWidth - cardW;
    if (targetY < snapDist) targetY = 0;
    if (targetY + cardH > window.innerHeight - snapDist) targetY = window.innerHeight - cardH;

    host.style.left = targetX + 'px';
    host.style.top = targetY + 'px';

    state.posX = targetX;
    state.posY = targetY;

    if (dropdown) dropdown.classList.remove('open');
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    saveSettings();
  }
  // #endregion

  // #region Initialization
  function init() {
    try { applyGlassEffects(); } catch (e) {}
    try { applyTheme(state.theme); } catch (e) {}
    try { renderSwatches(); } catch (e) {}
    try { updateMediaSources(backgroundImageUrl); } catch (e) {}
    try { setDisplayMode(state.displayMode); } catch (e) {}
    try { setLayoutMode(state.layoutMode); } catch (e) {}
    try { if (state.structureMode !== 'classic') setStructureMode(state.structureMode); } catch (e) {}
    try { applyLanguage(state.language); } catch (e) {}

    var lImg = $('#tcp-loading-gif-img');
    if (lImg) lImg.src = LOADING_GIF_URL;

    var sImg = $('#tcp-support-gif-img');
    if (sImg) sImg.src = SUPPORT_DEV_GIF_URL;

    var loader = $('#tcp-loader');
    var loaderStatus = $('#tcp-loader-status');

    if (loader) {
      loader.onclick = function () {
        try { loader.remove(); } catch (e) { loader.style.display = 'none'; }
      };
    }

    setTimeout(function () {
      if (loaderStatus) loaderStatus.textContent = t('auto_enroll_status');
    }, 400);

    setTimeout(function () {
      if (loaderStatus) loaderStatus.textContent = t('sync_api_status');
    }, 800);

    setTimeout(function () {
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(function () {
          try { loader.remove(); } catch (e) { loader.style.display = 'none'; }
        }, 300);
      }
      startAutomation();
    }, 1200);
  }

  window.__task_widget_cleanup__ = function () {
    stopActiveTask();
    if (timerInterval) clearInterval(timerInterval);
  };

  init();
  // #endregion
})();
