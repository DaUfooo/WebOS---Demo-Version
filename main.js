/* ======================================================
   DaUfooo's BrowserOS — main.js
   Erstellt: 2025
   ======================================================
   Enthält: Theme-Handling, App-Registry, Fenster-Manager,
   Taskbar/Dock (mit Duplikat-Schutz), Vorschau, Notifier,
   Drag&Drop-Dateien, einfache Apps (Notepad, Terminal, Explorer,
   Rechner, Music, Settings, About, Notifications, SysInfo)
*/

const desktop = document.getElementById('desktop');
const windows = document.getElementById('windows');
const dock = document.getElementById('dock');
const startBtn = document.getElementById('startBtn');
const startMenu = document.getElementById('startMenu');
const clockEl = document.getElementById('clock');
const themeSelect = document.getElementById('themeSelect');
const notifySoundEl = document.getElementById('notifySound');

let zIndexCounter = 1000;
let notifications = [];

/* -----------------------
   Themes
   ----------------------- */
const themes = {
  default: { name: 'Neon Night', bg: 'radial-gradient(circle at 30% 40%, #050522, #000)', accent: '#00eaff', glassOpacity: 0.1, glassBlur: 14, wallpaper: '' },
  evening: { name: 'Neon Evening', bg: 'linear-gradient(180deg, #0b1220, #071422)', accent: '#2563eb', glassOpacity: 0.06, glassBlur: 10, wallpaper: '' },
  dark: { name: 'Neon Dark', bg: 'radial-gradient(circle at 10% 500%, #060522, #000)', accent: '#00eaff', glassOpacity: 0.1, glassBlur: 14, wallpaper: '' },
  retro: { name: 'Retro Terminal', bg: '#0f0f0f', accent: '#33ff33', glassOpacity: 0.04, glassBlur: 4, wallpaper: '' },
  cyberwave: { name: 'Cyberwave', bg: 'linear-gradient(180deg, #180038, #000)', accent: '#ff00ff', glassOpacity: 0.08, glassBlur: 12, wallpaper: '' },
  frostbyte: { name: 'Frostbyte', bg: 'radial-gradient(circle at 40% 40%, #002b36, #001018)', accent: '#00ffff', glassOpacity: 0.09, glassBlur: 16, wallpaper: '' },
  dusk: { name: 'Dusk Horizon', bg: 'linear-gradient(160deg, #2b1055, #7597de)', accent: '#a6b1ff', glassOpacity: 0.07, glassBlur: 12, wallpaper: '' },
  aurora: { name: 'Aurora Drift', bg: 'radial-gradient(circle at 70% 30%, #0a0022, #002b36)', accent: '#76ffc8', glassOpacity: 0.1, glassBlur: 15, wallpaper: '' },
  synthsun: { name: 'Synthwave Sunset', bg: 'linear-gradient(180deg, #ff0080, #8000ff, #000)', accent: '#ffd166', glassOpacity: 0.08, glassBlur: 12, wallpaper: '' },
  bluepulse: { name: 'Blue Pulse', bg: 'radial-gradient(circle at 60% 40%, #1a0033, #000933, #000)', accent: '#7a5fff', glassOpacity: 0.1, glassBlur: 14, wallpaper: '' },
  neonice: { name: 'Neon Ice', bg: 'radial-gradient(circle at 50% 30%, #001f33, #000)', accent: '#66e0ff', glassOpacity: 0.09, glassBlur: 13, wallpaper: '' },
  jadevoid: { name: 'Jade Void', bg: 'linear-gradient(180deg, #001a0f, #000)', accent: '#00ff99', glassOpacity: 0.08, glassBlur: 10, wallpaper: '' },
  plasma: { name: 'Plasma Flow', bg: 'radial-gradient(circle at 40% 60%, #5b00ff, #000011)', accent: '#ff66ff', glassOpacity: 0.1, glassBlur: 15, wallpaper: '' },
  goldnova: { name: 'Gold Nova', bg: 'linear-gradient(180deg, #1a0a00, #000)', accent: '#ffcc33', glassOpacity: 0.06, glassBlur: 10, wallpaper: '' },
  shadowgrid: { name: 'Shadow Grid', bg: 'radial-gradient(circle at 20% 50%, #080808, #000)', accent: '#00ffaa', glassOpacity: 0.05, glassBlur: 8, wallpaper: '' }
};

function applyTheme(key) {
  const t = themes[key] || themes.default;
  document.documentElement.style.setProperty('--accent', t.accent);
  document.documentElement.style.setProperty('--glass-opacity', t.glassOpacity);
  document.documentElement.style.setProperty('--glass-blur', t.glassBlur + 'px');
  document.body.style.background = t.bg;
  localStorage.setItem('os:theme', key);
}

function initThemeSelector() {
  if (!themeSelect) return;
  Object.entries(themes).forEach(([k,v]) => {
    const o = document.createElement('option'); o.value = k; o.textContent = v.name; themeSelect.appendChild(o);
  });
  const saved = localStorage.getItem('os:theme') || 'default';
  themeSelect.value = saved; applyTheme(saved);
  themeSelect.addEventListener('change', e => applyTheme(e.target.value));
}

/* -----------------------
   App registry
   ----------------------- */
const apps = {
  notepad:    { title: 'Notepad', icon: '📝', create: createNotepad },
  terminal:   { title: 'Terminal', icon: '>_', create: createTerminal },
  files:      { title: 'Explorer', icon: '📁', create: createExplorer },
  calculator: { title: 'Rechner', icon: '➗', create: createCalculator },
  music:      { title: 'Music', icon: '🎵', create: createMusicPlayer },
  settings:   { title: 'Einstellungen', icon: '⚙️', create: createSettings },
  about:      { title: 'Info', icon: 'ℹ️', create: createAbout },
  notifications: { title: 'Benachrichtigungen', icon: '🔔', create: createNotificationCenter },
  sysinfo:    { title: 'Systeminfo', icon: '💻', create: createSysInfo }
};


/* -----------------------
   Apps
   ----------------------- */ 
   
/* Notepad */   
function createNotepad(container, id){
  container.classList.add('notepad');
  const ta = document.createElement('textarea'); ta.placeholder = 'Schreibe etwas...';
  const key = 'notepad:' + id; ta.value = localStorage.getItem(key) || '';
  ta.addEventListener('input', () => localStorage.setItem(key, ta.value)); container.appendChild(ta);
}

/* Terminal */  
function createTerminal(container){
  container.classList.add('terminal');
  const output = document.createElement('div'); output.className='term-output';
  const inputRow = document.createElement('div'); inputRow.className='term-input';
  const inp = document.createElement('input'); inp.placeholder='Befehl eingeben (help)'; inputRow.appendChild(inp); container.append(output, inputRow);
  const write = txt => { const p = document.createElement('div'); p.textContent = txt; output.appendChild(p); output.scrollTop = output.scrollHeight; };
  write('DaUfooo\u00B4s Terminal — type help');
  inp.addEventListener('keydown', e => { if (e.key === 'Enter'){ handle(inp.value.trim()); inp.value=''; }});
  function handle(cmd){ if (!cmd) return; write('> ' + cmd); const [c, ...args] = cmd.split(' ');
    if (c === 'help') write('commands: help, echo, date, clear, ls, cat, about');
    else if (c === 'echo') write(args.join(' '));
    else if (c === 'date') write(new Date().toString());
    else if (c === 'clear') output.innerHTML='';
    else if (c === 'ls') { const ks = Object.keys(localStorage).filter(k=>k.startsWith('file:')); if (!ks.length) write('(no files)'); else ks.forEach(k=>write(k.replace('file:',''))); }
    else if (c === 'cat') { const n=args[0]; if(!n) write('usage: cat filename'); else { const f=localStorage.getItem('file:'+n); if(!f) write('(file not found)'); else { try{ const p=JSON.parse(f); write(p.type==='image' ? '(binary image data)' : p.data); }catch{ write(f); }}}}
    else if (c === 'about') write('DaUfooo\u00B4s BrowserOS Terminal');
    else write('unknown command: ' + c);
  }
}

/* Explorer */  
function createExplorer(container){
  container.classList.add('explorer');
  const nameInput = document.createElement('input'); nameInput.placeholder='Neuer Dateiname...'; styleInput(nameInput);
  const contentInput = document.createElement('textarea'); contentInput.placeholder='Dateiinhalt...'; styleInput(contentInput);
  const saveBtn = document.createElement('button'); saveBtn.textContent='Speichern'; styleButton(saveBtn);
  const list = document.createElement('div'); list.className='file-list';
  saveBtn.addEventListener('click', ()=> { const name = nameInput.value.trim(); if(!name) return notify('Bitte Dateinamen eingeben.'); localStorage.setItem('file:'+name, JSON.stringify({ type:'text', data: contentInput.value })); notify('Gespeichert: ' + name, true); refresh(); nameInput.value=''; contentInput.value=''; });
  container.append(nameInput, contentInput, saveBtn, list);
  function refresh(){ list.innerHTML=''; const keys = Object.keys(localStorage).filter(k=>k.startsWith('file:')); if (!keys.length) return (list.textContent='Keine Dateien'); keys.forEach(k => { const nm = k.replace('file:', ''); const item = document.createElement('div'); item.className='file-item'; item.innerHTML = `<div>${nm}</div><div><button data-open="${nm}">Öffnen</button> <button data-del="${nm}">Löschen</button></div>`; list.appendChild(item); });
    list.querySelectorAll('button[data-open]').forEach(b => b.addEventListener('click', ()=> openFile(b.dataset.open)));
    list.querySelectorAll('button[data-del]').forEach(b => b.addEventListener('click', ()=> { if(confirm('Datei löschen?')){ localStorage.removeItem('file:'+b.dataset.del); notify('Gelöscht: '+b.dataset.del,true); refresh(); }}));
  }
  function openFile(n){ const raw = localStorage.getItem('file:' + n); if (!raw) return; try { const parsed = JSON.parse(raw); if (parsed.type === 'image'){ const img=document.createElement('img'); img.src=parsed.data; img.style.maxWidth='100%'; img.style.height='auto'; list.innerHTML=''; list.appendChild(img); } else { nameInput.value = n; contentInput.value = parsed.data || ''; } } catch { nameInput.value = n; contentInput.value = raw; } }
  refresh();
}

/* Rechner */  
function createCalculator(container){
  container.innerHTML = `<div style='display:flex;flex-direction:column;height:100%'><input id='calcDisplay' readonly style='padding:12px;border-radius:8px;border:0;margin-bottom:8px;background:rgba(0,0,0,0.12);font-size:18px' /><div class='calc'></div></div>`;
  const grid = container.querySelector('.calc'); const disp = container.querySelector('#calcDisplay');
  const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+','C'];
  buttons.forEach(t => { const b = document.createElement('button'); b.textContent = t; grid.appendChild(b); b.addEventListener('click', ()=> { if (t === 'C') disp.value = ''; else if (t === '='){ try { if (/^[0-9+\-*/.() ]+$/.test(disp.value)) disp.value = String(Function(`"use strict";return (${disp.value})`)()); else disp.value = 'Error'; } catch { disp.value = 'Error'; } } else disp.value += t; }); });
}

/* Musik Player */  
function createMusicPlayer(container){
  container.innerHTML = `<div style="display:flex;flex-direction:column;height:100%"><div id="musicList" style="flex:1;overflow:auto;margin-bottom:8px"></div><div style="display:flex;gap:8px"><input id="musicFile" type="file" accept="audio/*"><button id="playBtn">Play</button></div></div>`;
  const audio = document.createElement('audio'); audio.controls = true; container.appendChild(audio);
  const fileInput = container.querySelector('#musicFile'); const playBtn = container.querySelector('#playBtn'); const list = container.querySelector('#musicList');
  fileInput.addEventListener('change', e => { const f = e.target.files[0]; if (!f) return; const url = URL.createObjectURL(f); const key = 'music:' + f.name; localStorage.setItem(key, JSON.stringify({ name: f.name, url })); const item = document.createElement('div'); item.textContent = f.name; item.style.cursor='pointer'; item.addEventListener('click', ()=> { audio.src = url; audio.play(); }); list.appendChild(item); notify('Musik hinzugefügt: ' + f.name, true); });
  playBtn.addEventListener('click', ()=> audio.play());
}

/* Settings */  
function createSettings(container){
  const wrap = document.createElement('div'); wrap.style.display = 'flex'; wrap.style.flexDirection = 'column'; wrap.style.gap='10px';
  const accent = labeledInput('Akzentfarbe (#hex):','accent'); const bg = labeledInput('Hintergrund (CSS):','bg'); const op = labeledRange('Glas-Opazität:','glassOp',0,0.25,0.01,getCSS('--glass-opacity')); const blur = labeledRange('Glas-Unschärfe:','glassBlur',0,24,1,parseInt(getCSS('--glass-blur'),10));
  const apply = document.createElement('button'); apply.textContent='Anwenden'; styleButton(apply);
  const clear = document.createElement('button'); clear.textContent='LocalStorage löschen (Achtung)'; styleButton(clear); clear.style.background='rgba(255,0,0,0.08)';
  wrap.append(accent,bg,op,blur,apply,clear); container.appendChild(wrap);
  accent.querySelector('input').value = getCSS('--accent'); op.querySelector('input').value = getCSS('--glass-opacity'); blur.querySelector('input').value = parseInt(getCSS('--glass-blur'),10);
  apply.addEventListener('click', ()=> { const a = accent.querySelector('input').value.trim(); const b = bg.querySelector('input').value.trim(); const o = op.querySelector('input').value; const bl = blur.querySelector('input').value; if (a) document.documentElement.style.setProperty('--accent', a); if (b) document.body.style.background = b; document.documentElement.style.setProperty('--glass-opacity', o); document.documentElement.style.setProperty('--glass-blur', bl + 'px'); notify('Einstellungen übernommen.', true); });
  clear.addEventListener('click', ()=> { if (confirm('Alles löschen?')) { localStorage.clear(); notify('LocalStorage gelöscht. Neustart...'); setTimeout(()=> location.reload(),800); }});
}

/* Info App */  
function createAbout(container){ container.innerHTML = `<h3>DaUfooo\u00B4s BrowserOS — Demo Version</h3><p> Themes, Snap, Notifications, Dock-Preview, Music und Systeminfo.</p><p>Klick auf Symbole öffnet Apps. Dateien per Drag & Drop ablegen.</p>`;
}
/* Systeminfo */  
function createSysInfo(container){ container.innerHTML = `<div style="font-family:monospace"><div>Navigator: ${navigator.userAgent}</div><div>Platform: ${navigator.platform}</div><div>Memory: ${performance.memory ? Math.round(performance.memory.usedJSHeapSize/1024/1024)+' MB' : 'n/a'}</div><div>Viewport: ${innerWidth}×${innerHeight}</div></div>`;
}

function labeledInput(labelText, id){ const label = document.createElement('label'); label.textContent = labelText + ' '; const input = document.createElement('input'); input.id = id; styleInput(input); label.appendChild(input); return label;
}
function labeledRange(labelText, id, min, max, step, value){ const label = document.createElement('label'); label.textContent = labelText + ' '; const input = document.createElement('input'); input.type='range'; input.id=id; input.min=min; input.max=max; input.step=step; input.value=value; label.appendChild(input); return label;
}


/* -----------------------
   DOMContentLoaded init
   ----------------------- */
window.addEventListener('DOMContentLoaded', () => {
  // Theme
  initThemeSelector();

  // Start-Button Toggle
  startBtn.addEventListener('click', e => { e.stopPropagation(); startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block'; });
  document.addEventListener('click', e => { if (!startMenu.contains(e.target) && e.target !== startBtn) startMenu.style.display = 'none'; });

  // Desktop / Startmenu App-Launcher Binding
  bindAppLaunchers();

  // Clock
  setInterval(() => clockEl.textContent = new Date().toLocaleTimeString(), 1000);

  // Drag & Drop for files
  desktop.addEventListener('dragover', e => e.preventDefault());
  desktop.addEventListener('drop', handleFileDrop);

  // Initialize dock previews
  enableDockPreview();

  // Initial notification
  notify('DaUfooo\u00B4s BrowserOS — Demo Version gestartet 🚀', true);
});

/* -----------------------
   Dock helpers (prevent duplicate icons)
   ----------------------- */
function addDockStarter(appName){
  const icon = apps[appName]?.icon || '•';
  if (dock.querySelector(`[data-app='${appName}']`)) return; // bereits vorhanden
  const el = document.createElement('div'); el.className = 'task-item'; el.dataset.app = appName; el.title = apps[appName]?.title || appName; el.textContent = icon;
  el.addEventListener('click', () => {
    const w = document.querySelector(`.window[data-app='${appName}']`);
    if (w) w.classList.contains('minimized') ? restoreWindow(w) : focusWindow(w);
    else openApp(appName);
  });
  dock.appendChild(el);
}

function addDockItemForWindow(id, title, icon){
  // id is window.dataset.id
  if (dock.querySelector(`[data-win='${id}']`)) return;
  const el = document.createElement('div'); el.className = 'task-item'; el.dataset.win = id; el.title = title; el.innerText = icon;
  el.addEventListener('click', () => {
    const w = document.querySelector(`.window[data-id='${id}']`);
    if (!w) return;
    w.classList.contains('minimized') ? restoreWindow(w) : focusWindow(w);
  });
  dock.appendChild(el);
}

/* -----------------------
   Open App -> create window
   ----------------------- */
function openApp(name){
  if (!apps[name]) return;
  // create unique id per window instance
  const id = `${name}-${Date.now()}`;
  const { title, icon, create } = apps[name];
  const win = createWindow(id, title, icon, create);
  addDockItemForWindow(id, title, icon);
  enableDockPreview();
  focusWindow(win);
}

function createWindow(id, title, icon, contentFactory){
  // Base window element
  const win = document.createElement('div'); win.className = 'window'; win.dataset.id = id; win.dataset.app = title.toLowerCase(); win.dataset.max = '0';
  win.style.left = '80px'; win.style.top = '60px'; win.style.width = '640px'; win.style.height = '420px'; win.style.zIndex = ++zIndexCounter;

  win.innerHTML = `
    <div class="titlebar">
      <div class="title">
        <div style="width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,0.02);display:flex;align-items:center;justify-content:center">${icon}</div>
        <div>${title}</div>
      </div>
      <div class="controls">
        <div class="ctrl" data-action="min">—</div>
        <div class="ctrl" data-action="max">▢</div>
        <div class="ctrl" data-action="close">✕</div>
      </div>
    </div>
    <div class="content"></div>
	<div class="resizer"></div>
  `;

  windows.appendChild(win);
  const content = win.querySelector('.content');
  // inject app content
  try { contentFactory(content, id); } catch (e) { content.textContent = 'Fehler beim Laden der App'; console.error(e); }

  // controls
  win.querySelectorAll('.ctrl').forEach(c => c.addEventListener('click', () => handleWindowAction(win, c.dataset.action)));
  makeDraggable(win, win.querySelector('.titlebar'));
  makeResizable(win, win.querySelector('.resizer'));
  win.addEventListener('mousedown', () => focusWindow(win));
  win.querySelector('.titlebar').addEventListener('dblclick', () => toggleMax(win));
  return win;
}

function handleWindowAction(win, action){ if (action === 'close') closeWindow(win); if (action === 'min') minimizeWindow(win); if (action === 'max') toggleMax(win); }

function focusWindow(win){
  document.querySelectorAll('.window').forEach(w => w.classList.add('inactive'));
  win.classList.remove('inactive');
  win.style.zIndex = ++zIndexCounter;
  win.style.filter = 'brightness(1.03) drop-shadow(0 0 12px var(--accent))';
  setTimeout(()=> win.style.filter = '', 250);
}

function closeWindow(win){
  const id = win.dataset.id;
  dock.querySelector(`[data-win='${id}']`)?.remove();
  win.remove();
}

function minimizeWindow(win){ win.classList.add('minimized'); win.style.display = 'none'; }
function restoreWindow(win){ win.classList.remove('minimized'); win.style.display = 'flex'; focusWindow(win); }

function toggleMax(win){
  if (win.dataset.max === '1'){
    win.style.left = win.dataset.preLeft; win.style.top = win.dataset.preTop;
    win.style.width = win.dataset.preWidth; win.style.height = win.dataset.preHeight; win.dataset.max = '0';
  } else {
    win.dataset.preLeft = win.style.left; win.dataset.preTop = win.style.top;
    win.dataset.preWidth = win.style.width; win.dataset.preHeight = win.style.height;
    win.style.left = '0'; win.style.top = '0'; win.style.width = '100%'; win.style.height = 'calc(100% - 48px)'; win.dataset.max = '1';
  }
}

/* -----------------------
   Dragging & Resizing
   ----------------------- */
function makeDraggable(win, handle){
  let isDown=false, startX=0, startY=0, startL=0, startT=0;
  const start = (x,y)=>{ isDown=true; startX=x; startY=y; startL = parseInt(win.style.left)||0; startT = parseInt(win.style.top)||0; win.style.transition='none'; };
  const move = (x,y)=>{ if(!isDown) return; win.style.left = (startL + (x - startX)) + 'px'; win.style.top = (startT + (y - startY)) + 'px'; };
  const end = ()=>{ if(!isDown) return; isDown=false; win.style.transition='all .12s ease'; const rect = win.getBoundingClientRect(); const W = window.innerWidth, H = window.innerHeight;
    if (rect.top < 12) toggleMax(win);
    else if (rect.left < 12) { win.style.left='0'; win.style.top='0'; win.style.width='50%'; win.style.height='calc(100% - 48px)'; }
    else if (rect.right > W - 12) { win.style.left='50%'; win.style.top='0'; win.style.width='50%'; win.style.height='calc(100% - 48px)'; }
  };
  handle.addEventListener('mousedown', e=>{ start(e.clientX,e.clientY); e.preventDefault(); });
  window.addEventListener('mousemove', e=> move(e.clientX,e.clientY));
  window.addEventListener('mouseup', end);
  handle.addEventListener('touchstart', e=>{ const t=e.touches[0]; start(t.clientX,t.clientY); }, {passive:false});
  window.addEventListener('touchmove', e=>{ if(!isDown) return; const t=e.touches[0]; move(t.clientX,t.clientY); }, {passive:false});
  window.addEventListener('touchend', end);
}

function makeResizable(win, handle){
  let isDown=false, sx=0, sy=0, sw=0, sh=0;
  const start = (x,y)=>{ isDown=true; sx=x; sy=y; sw=win.offsetWidth; sh=win.offsetHeight; win.style.transition='none'; };
  const move = (x,y)=>{ if(!isDown) return; win.style.width = Math.max(220, sw + (x - sx)) + 'px'; win.style.height = Math.max(140, sh + (y - sy)) + 'px'; };
  const end = ()=>{ if(!isDown) return; isDown=false; win.style.transition='all .12s ease'; };
  handle.addEventListener('mousedown', e=>{ start(e.clientX,e.clientY); e.preventDefault(); });
  window.addEventListener('mousemove', e=> move(e.clientX,e.clientY));
  window.addEventListener('mouseup', end);
  handle.addEventListener('touchstart', e=>{ const t=e.touches[0]; start(t.clientX,t.clientY); }, {passive:false});
  window.addEventListener('touchmove', e=>{ if(!isDown) return; const t=e.touches[0]; move(t.clientX,t.clientY); }, {passive:false});
  window.addEventListener('touchend', end);
}

/* -----------------------
   File Drag & Drop (localStorage)
   ----------------------- */
function handleFileDrop(e){
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files || []);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ()=> {
      const key = `file:${file.name}`;
      const value = file.type.startsWith('image/') ? { type: 'image', data: reader.result } : { type: 'text', data: reader.result };
      localStorage.setItem(key, JSON.stringify(value));
      notify(`Gespeichert: ${file.name}`, true);
    };
    file.type.startsWith('image/') ? reader.readAsDataURL(file) : reader.readAsText(file);
  });
}

/* -----------------------
   Notifications
   ----------------------- */
function notify(msg, withSound = false){
  const time = new Date().toLocaleTimeString();
  notifications.push(`[${time}] ${msg}`);
  if (notifications.length > 40) notifications.shift();

  const note = document.createElement('div'); note.textContent = msg; Object.assign(note.style, { position:'fixed', bottom:'60px', right:'20px', background:'rgba(255,255,255,0.12)', color:'#fff', padding:'8px 14px', borderRadius:'8px', backdropFilter:'blur(8px)', transition:'opacity .4s', opacity:'1', zIndex:99999 });
  document.body.appendChild(note);
  setTimeout(()=> note.style.opacity = '0', 1800);
  setTimeout(()=> note.remove(), 2300);

  if (withSound && notifySoundEl) {
    if (!notifySoundEl.src) {
      try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.type='sine'; o.frequency.value=880; g.gain.value=0.02; o.connect(g); g.connect(ctx.destination); o.start(); setTimeout(()=>{ o.stop(); ctx.close(); }, 120); } catch {}
    } else { notifySoundEl.currentTime = 0; notifySoundEl.play().catch(()=>{}); }
  }
}

function createNotificationCenter(container){
  container.classList.add('terminal');
  const list = document.createElement('div'); list.className = 'term-output';
  notifications.slice().reverse().forEach(n => { const p = document.createElement('div'); p.textContent = n; list.appendChild(p); });
  container.appendChild(list);
}

/* -----------------------
   Dock hover preview
   ----------------------- */
function enableDockPreview(){
  dock.querySelectorAll('.task-item').forEach(item=>{
    item.removeEventListener('mouseenter', item._enterHandler);
    item.removeEventListener('mouseleave', item._leaveHandler);

    const enterHandler = () => {
      const id = item.dataset.win;
      const w = document.querySelector(`.window[data-id="${id}"]`);
      if (!w) return;
      const preview = w.cloneNode(true);
      preview.classList.add('window-preview');
      preview.style.position = 'fixed'; preview.style.width = '220px'; preview.style.height = '150px'; preview.style.bottom = '60px';
      const left = Math.max(8, item.getBoundingClientRect().left - 80);
      preview.style.left = left + 'px'; preview.style.transform = 'scale(.3)'; preview.style.opacity = '0.95'; preview.style.pointerEvents = 'none'; preview.style.zIndex = 99998;
      document.body.appendChild(preview);
      item._preview = preview;
    };
    const leaveHandler = () => { if (item._preview) { item._preview.remove(); item._preview = null; } };

    item._enterHandler = enterHandler; item._leaveHandler = leaveHandler;
    item.addEventListener('mouseenter', enterHandler); item.addEventListener('mouseleave', leaveHandler);
  });
}

/* -----------------------
   Helper: styles
   ----------------------- */
function styleInput(el){ Object.assign(el.style, { width:'100%', padding:'8px', borderRadius:'8px', border:'0', background:'rgba(255,255,255,0.02)', color:'var(--text)', marginBottom:'8px' }); }
function styleButton(btn){ Object.assign(btn.style, { padding:'8px 12px', borderRadius:'8px', border:'0', cursor:'pointer' }); }
function getCSS(prop){ return getComputedStyle(document.documentElement).getPropertyValue(prop).trim(); }

/* -----------------------
   Binders: desktop icons & startmenu
   ----------------------- */
function bindAppLaunchers(){
  document.querySelectorAll('[data-app]').forEach(el => {
    if (el._hasListener) return; // verhindert doppelte Bindung
    el.addEventListener('click', e => {
      e.stopPropagation();
      const appName = el.dataset.app;
      if (apps[appName]) { openApp(appName); startMenu.style.display='none'; }
      else notify(`App \"${appName}\" nicht gefunden.`);
    });
    el._hasListener = true;
  });
}

/* -----------------------
   Fehlerbehandlung / Debug Helfer
   ----------------------- */
window.addEventListener('error', e => { console.error('Window error', e); });

/* =======================
   Ende
   ======================= */
