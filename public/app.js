/* ==========================================================================
   POXI ARK RCON - FRONTEND v2 (INTELIGENTE)
   ========================================================================== */

// ===== BASE DE DATOS DE ITEMS (ESPAÑOL → GFI) =====
const ITEMS_DB = [
  // --- RECURSOS BÁSICOS ---
  { name: 'Madera', gfi: 'Wood', cat: 'Recursos' },
  { name: 'Piedra', gfi: 'Stone', cat: 'Recursos' },
  { name: 'Fibra', gfi: 'Fiber', cat: 'Recursos' },
  { name: 'Paja', gfi: 'Thatch', cat: 'Recursos' },
  { name: 'Pedernal / Sílex', gfi: 'Flint', cat: 'Recursos' },
  { name: 'Piel', gfi: 'Hide', cat: 'Recursos' },
  { name: 'Quitina', gfi: 'Chitin', cat: 'Recursos' },
  { name: 'Queratina', gfi: 'Keratin', cat: 'Recursos' },
  { name: 'Pelaje / Pelt', gfi: 'Pelt', cat: 'Recursos' },

  // --- RECURSOS AVANZADOS ---
  { name: 'Lingote de Metal', gfi: 'MetalIngot', cat: 'Recursos' },
  { name: 'Metal (mineral)', gfi: 'Metal', cat: 'Recursos' },
  { name: 'Cristal', gfi: 'Crystal', cat: 'Recursos' },
  { name: 'Obsidiana', gfi: 'Obsidian', cat: 'Recursos' },
  { name: 'Perlas de Silicio', gfi: 'Silicon', cat: 'Recursos' },
  { name: 'Perla Negra', gfi: 'BlackPearl', cat: 'Recursos' },
  { name: 'Polímero', gfi: 'Polymer', cat: 'Recursos' },
  { name: 'Polímero Orgánico', gfi: 'OrganicPolymer', cat: 'Recursos' },
  { name: 'Pasta Cementante', gfi: 'ChitinPaste', cat: 'Recursos' },
  { name: 'Electrónica', gfi: 'Electronics', cat: 'Recursos' },
  { name: 'Aceite / Petróleo', gfi: 'Oil', cat: 'Recursos' },
  { name: 'Gasolina', gfi: 'Gasoline', cat: 'Recursos' },
  { name: 'Pólvora', gfi: 'Gunpowder', cat: 'Recursos' },
  { name: 'Polvo de Chispa', gfi: 'Sparkpowder', cat: 'Recursos' },
  { name: 'Narcótico', gfi: 'Narcotics', cat: 'Recursos' },
  { name: 'Estimulante', gfi: 'Stimulant', cat: 'Recursos' },
  { name: 'Baya Estimulante', gfi: 'Stimberry', cat: 'Recursos' },
  { name: 'Baya Narcótica', gfi: 'Narcoberry', cat: 'Recursos' },
  { name: 'Baya Mejo', gfi: 'MejoBerry', cat: 'Recursos' },
  { name: 'Element', gfi: 'Element', cat: 'Recursos' },
  { name: 'Polvo de Element', gfi: 'ElementDust', cat: 'Recursos' },
  { name: 'Savia', gfi: 'Sap', cat: 'Recursos' },
  { name: 'Sustrato Absorbente', gfi: 'SubstrateAbsorbent', cat: 'Recursos' },
  { name: 'Carga Azul', gfi: 'ChargeBlue', cat: 'Recursos' },
  { name: 'Carga Roja', gfi: 'ChargeRed', cat: 'Recursos' },
  { name: 'Carga Verde', gfi: 'ChargeGreen', cat: 'Recursos' },

  // --- ARMAS ---
  { name: 'Pica', gfi: 'WeaponPike', cat: 'Armas' },
  { name: 'Escopeta', gfi: 'Shotgun', cat: 'Armas' },
  { name: 'Rifle Longneck', gfi: 'Longneck', cat: 'Armas' },
  { name: 'Rifle de Asalto', gfi: 'AssaultRifle', cat: 'Armas' },
  { name: 'Rifle Fabricado', gfi: 'FabSniper', cat: 'Armas' },
  { name: 'Pistola Fabricada', gfi: 'FabPistol', cat: 'Armas' },
  { name: 'Rifle de Francotirador Tek', gfi: 'TekSniper', cat: 'Armas' },
  { name: 'Espada Tek', gfi: 'TekSword', cat: 'Armas' },
  { name: 'Ballesta', gfi: 'Crossbow', cat: 'Armas' },
  { name: 'Arco', gfi: 'Bow', cat: 'Armas' },
  { name: 'Lanzacohetes', gfi: 'RocketLauncher', cat: 'Armas' },
  { name: 'C4 Carga', gfi: 'WeaponC4', cat: 'Armas' },
  { name: 'Espada', gfi: 'Sword', cat: 'Armas' },
  { name: 'Bola', gfi: 'WeaponBola', cat: 'Armas' },
  { name: 'Arpón', gfi: 'Harpoon', cat: 'Armas' },

  // --- MUNICIÓN ---
  { name: 'Balas Simples', gfi: 'SimpleBullet', cat: 'Munición' },
  { name: 'Balas Avanzadas', gfi: 'AdvancedBullet', cat: 'Munición' },
  { name: 'Balas Rifle Avanzadas', gfi: 'AdvancedRifleBullet', cat: 'Munición' },
  { name: 'Flechas', gfi: 'ArrowStone', cat: 'Munición' },
  { name: 'Flechas Tranquilizantes', gfi: 'ArrowTranq', cat: 'Munición' },
  { name: 'Dardos Tranquilizantes', gfi: 'TranqDart', cat: 'Munición' },
  { name: 'Dardos Impactantes', gfi: 'ShockingTranqDart', cat: 'Munición' },
  { name: 'Cohete', gfi: 'RocketAmmo', cat: 'Munición' },
  { name: 'Cartuchos Escopeta', gfi: 'ShotgunAmmo', cat: 'Munición' },
  { name: 'C4 Detonador', gfi: 'C4Ammo', cat: 'Munición' },

  // --- ARMADURA ---
  { name: 'Casco Flak', gfi: 'FlakHelmet', cat: 'Armadura' },
  { name: 'Pechera Flak', gfi: 'FlakShirt', cat: 'Armadura' },
  { name: 'Guantes Flak', gfi: 'FlakGloves', cat: 'Armadura' },
  { name: 'Pantalones Flak', gfi: 'FlakPants', cat: 'Armadura' },
  { name: 'Botas Flak', gfi: 'FlakBoots', cat: 'Armadura' },
  { name: 'Casco Tek', gfi: 'TekHelmet', cat: 'Armadura' },
  { name: 'Pechera Tek', gfi: 'TekShirt', cat: 'Armadura' },
  { name: 'Guantes Tek', gfi: 'TekGloves', cat: 'Armadura' },
  { name: 'Pantalones Tek', gfi: 'TekPants', cat: 'Armadura' },
  { name: 'Botas Tek', gfi: 'TekBoots', cat: 'Armadura' },
  { name: 'Riot Casco', gfi: 'RiotHelmet', cat: 'Armadura' },
  { name: 'Riot Pechera', gfi: 'RiotShirt', cat: 'Armadura' },
  { name: 'Escudo Tek', gfi: 'TekShield', cat: 'Armadura' },
  { name: 'Escudo de Metal', gfi: 'MetalShield', cat: 'Armadura' },

  // --- HERRAMIENTAS ---
  { name: 'Pico de Metal', gfi: 'MetalPick', cat: 'Herramientas' },
  { name: 'Hacha de Metal', gfi: 'MetalHatchet', cat: 'Herramientas' },
  { name: 'Motosierra', gfi: 'Chainsaw', cat: 'Herramientas' },
  { name: 'Catalejo', gfi: 'Spyglass', cat: 'Herramientas' },
  { name: 'GPS', gfi: 'GPS', cat: 'Herramientas' },
  { name: 'Brújula', gfi: 'Compass', cat: 'Herramientas' },

  // --- UTILIDADES ---
  { name: 'CryoPod', gfi: 'CryoPod', cat: 'Utilidades' },
  { name: 'CryoFridge', gfi: 'CryoFridge', cat: 'Utilidades' },
  { name: 'Transponder Nodo', gfi: 'TransGPS', cat: 'Utilidades' },
  { name: 'Transponder Tracker', gfi: 'TransponderTracker', cat: 'Utilidades' },
  { name: 'Paracaídas', gfi: 'WeaponParachute', cat: 'Utilidades' },
  { name: 'Ala Delta', gfi: 'Glider', cat: 'Utilidades' },
  { name: 'Antorcha', gfi: 'Torch', cat: 'Utilidades' },

  // --- KIBBLE ---
  { name: 'Kibble Extra Pequeño', gfi: 'Kibble_Base_XSmall', cat: 'Kibble' },
  { name: 'Kibble Pequeño', gfi: 'Kibble_Base_Small', cat: 'Kibble' },
  { name: 'Kibble Mediano', gfi: 'Kibble_Base_Medium', cat: 'Kibble' },
  { name: 'Kibble Grande', gfi: 'Kibble_Base_Large', cat: 'Kibble' },
  { name: 'Kibble Extra Grande', gfi: 'Kibble_Base_XLarge', cat: 'Kibble' },
  { name: 'Kibble Especial', gfi: 'Kibble_Base_Special', cat: 'Kibble' },

  // --- MONTURAS / SADDLES ---
  { name: 'Montura Rex', gfi: 'RexSaddle', cat: 'Monturas' },
  { name: 'Montura Raptor', gfi: 'RaptorSaddle', cat: 'Monturas' },
  { name: 'Montura Spino', gfi: 'SpinoSaddle', cat: 'Monturas' },
  { name: 'Montura Argentavis', gfi: 'ArgentavisSaddle', cat: 'Monturas' },
  { name: 'Montura Quetzal', gfi: 'QuetzSaddle', cat: 'Monturas' },
  { name: 'Montura Giga', gfi: 'GigaSaddle', cat: 'Monturas' },
  { name: 'Montura Trike', gfi: 'TrikeSaddle', cat: 'Monturas' },
  { name: 'Montura Pteranodon', gfi: 'PteroSaddle', cat: 'Monturas' },
  { name: 'Montura Mosasaurus', gfi: 'MosaSaddle', cat: 'Monturas' },
  { name: 'Montura Bronto', gfi: 'BrontoSaddle', cat: 'Monturas' },
  { name: 'Montura Yutyrannus', gfi: 'YutySaddle', cat: 'Monturas' },
  { name: 'Montura Therizino', gfi: 'TherizinoSaddle', cat: 'Monturas' },

  // --- COMIDA ---
  { name: 'Carne Cocida', gfi: 'CookedMeat', cat: 'Comida' },
  { name: 'Carne Prime Cocida', gfi: 'CookedPrimeMeat', cat: 'Comida' },
  { name: 'Cecina', gfi: 'CookedMeat_Jerky', cat: 'Comida' },
  { name: 'Caldo de Batalla', gfi: 'BattleTartare', cat: 'Comida' },
  { name: 'Agua (Cantimplora)', gfi: 'WaterJar', cat: 'Comida' },
  { name: 'Cerveza', gfi: 'Beer', cat: 'Comida' },

  // --- ESTRUCTURAS ---
  { name: 'Cimientos de Metal', gfi: 'MetalFloor', cat: 'Estructuras' },
  { name: 'Pared de Metal', gfi: 'MetalWall', cat: 'Estructuras' },
  { name: 'Puerta de Metal', gfi: 'MetalGate', cat: 'Estructuras' },
  { name: 'Techo de Metal', gfi: 'MetalCeiling', cat: 'Estructuras' },
  { name: 'Generador Eléctrico', gfi: 'ElectricalGenerator', cat: 'Estructuras' },
  { name: 'Refrigerador', gfi: 'Fridge', cat: 'Estructuras' },
  { name: 'Torreta Auto', gfi: 'AutoTurret', cat: 'Estructuras' },
  { name: 'Torreta Heavy', gfi: 'HeavyTurret', cat: 'Estructuras' },
  { name: 'Torreta Tek', gfi: 'TekTurret', cat: 'Estructuras' },
  { name: 'Cañón', gfi: 'CannonBall', cat: 'Estructuras' },
];

// ===== BASE DE DATOS DE DINOS =====
const DINOS_DB = [
  { name: '🦖 T-Rex', id: 'Rex_Character_BP_C' },
  { name: '🦎 Raptor', id: 'Raptor_Character_BP_C' },
  { name: '🦏 Trike', id: 'Trike_Character_BP_C' },
  { name: '🐊 Spino', id: 'Spino_Character_BP_C' },
  { name: '🦕 Stego', id: 'Stego_Character_BP_C' },
  { name: '🦕 Bronto', id: 'Bronto_Character_BP_C' },
  { name: '🦅 Pteranodon', id: 'Ptero_Character_BP_C' },
  { name: '🦅 Argentavis', id: 'Argentavis_Character_BP_C' },
  { name: '🦅 Quetzal', id: 'Quetz_Character_BP_C' },
  { name: '🐉 Wyvern Fuego', id: 'Wyvern_Character_BP_Fire_C' },
  { name: '⚡ Wyvern Rayo', id: 'Wyvern_Character_BP_Lightning_C' },
  { name: '☠️ Wyvern Veneno', id: 'Wyvern_Character_BP_Poison_C' },
  { name: '❄️ Wyvern Hielo', id: 'Wyvern_Character_BP_Ice_C' },
  { name: '💀 Giganotosaurus', id: 'Giga_Character_BP_C' },
  { name: '🐷 Daeodon', id: 'Daeodon_Character_BP_C' },
  { name: '🐲 Yutyrannus', id: 'Yutyrannus_Character_BP_C' },
  { name: '🦎 Therizino', id: 'Therizino_Character_BP_C' },
  { name: '⛏️ Ankylo', id: 'Ankylo_Character_BP_C' },
  { name: '🪨 Doedicurus', id: 'Doedicurus_Character_BP_C' },
  { name: '🦈 Megalodon', id: 'Megalodon_Character_BP_C' },
  { name: '🐋 Mosasaurus', id: 'Mosa_Character_BP_C' },
  { name: '🐳 Basilosaurus', id: 'Basilosaurus_Character_BP_C' },
  { name: '🦅 Griffin', id: 'Griffin_Character_BP_C' },
  { name: '❄️ Managarmr', id: 'ManaGarmr_Character_BP_C' },
  { name: '🐺 Dire Wolf', id: 'Direwolf_Character_BP_C' },
  { name: '🐻 Dire Bear', id: 'Direbear_Character_BP_C' },
  { name: '🦂 Escorpión', id: 'Scorpion_Character_BP_C' },
  { name: '🐢 Carbonemys', id: 'Turtle_Character_BP_C' },
  { name: '🦩 Pelagornis', id: 'Pela_Character_BP_C' },
  { name: '🐸 Beelzebufo', id: 'Toad_Character_BP_C' },
];

// ===== ESTADO GLOBAL =====
const state = { isMuted: false, isConnected: false, isConfigured: false, players: [], pendingAction: null, pendingPayload: null, selectedGFI: null };

// ===== AUDIO =====
let audioCtx = null;
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); }
const sfx = {
  play(t) {
    if (state.isMuted) return;
    try {
      initAudio(); const n = audioCtx.currentTime;
      if (t === 'click') { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.type='sine'; o.frequency.setValueAtTime(1200,n); o.frequency.exponentialRampToValueAtTime(300,n+.07); g.gain.setValueAtTime(.1,n); g.gain.exponentialRampToValueAtTime(.01,n+.07); o.connect(g).connect(audioCtx.destination); o.start(n); o.stop(n+.07); }
      else if (t === 'ok') { [523,659,784].forEach((f,i) => { const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.type='sine'; o.frequency.setValueAtTime(f,n+i*.06); g.gain.setValueAtTime(.08,n+i*.06); g.gain.exponentialRampToValueAtTime(.01,n+i*.06+.15); o.connect(g).connect(audioCtx.destination); o.start(n+i*.06); o.stop(n+i*.06+.15); }); }
      else if (t === 'err') { const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.type='sawtooth'; o.frequency.setValueAtTime(180,n); o.frequency.linearRampToValueAtTime(60,n+.3); g.gain.setValueAtTime(.12,n); g.gain.exponentialRampToValueAtTime(.01,n+.3); const f=audioCtx.createBiquadFilter(); f.type='lowpass'; f.frequency.setValueAtTime(400,n); o.connect(f).connect(g).connect(audioCtx.destination); o.start(n); o.stop(n+.3); }
      else if (t === 'warn') { [0,.1].forEach(d => { const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.type='triangle'; o.frequency.setValueAtTime(880,n+d); g.gain.setValueAtTime(.1,n+d); g.gain.exponentialRampToValueAtTime(.01,n+d+.07); o.connect(g).connect(audioCtx.destination); o.start(n+d); o.stop(n+d+.07); }); }
    } catch(e){}
  }
};

// ===== DOM =====
const $ = id => document.getElementById(id);

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('poxi_muted') === 'true') setMuted(true);
  setupNav();
  setupEvents();
  buildDinoChips();
  buildItemCategories();
  buildDinoDatalist();
  setupItemSearch();
  
  // Comprobar la config al arrancar
  refreshAll().then(() => {
    // Si ya está configurado y conectado, hacemos un sonido de bienvenida
    if (state.isConfigured && state.isConnected) {
      setTimeout(() => sfx.play('ok'), 500);
    }
  });

  setInterval(refreshAll, 5000);
});

// ===== NAV =====
function setupNav() {
  document.querySelectorAll('.sidebar-btn').forEach(b => {
    b.addEventListener('click', () => {
      sfx.play('click');
      document.querySelectorAll('.sidebar-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      $(`tab-${b.dataset.tab}`).classList.add('active');
    });
  });
}

// ===== EVENTS =====
function setupEvents() {
  $('sound-toggle').onclick = () => { setMuted(!state.isMuted); sfx.play('click'); };
  $('refresh-players').onclick = () => { sfx.play('click'); fetchPlayers(); };
  $('refresh-chat').onclick = () => { sfx.play('click'); fetchChat(); };
  $('cmd-send').onclick = sendCmd;
  $('cmd-input').onkeypress = e => { if (e.key === 'Enter') sendCmd(); };
  $('clear-console').onclick = () => { sfx.play('click'); $('term-body').innerHTML = ''; termLog('sys', 'Consola limpiada.'); };
  $('modal-cancel').onclick = () => { sfx.play('click'); closeModal(); };
  $('modal-ok').onclick = () => { sfx.play('ok'); if (state.pendingAction) doAction(state.pendingAction, state.pendingPayload); closeModal(); };
  
  // Botones de Configuración
  $('btn-save-config').onclick = saveConfig;
  $('btn-disconnect').onclick = disconnectConfig;
}

async function saveConfig() {
  const host = $('cfg-host').value.trim();
  const port = $('cfg-port').value.trim();
  const password = $('cfg-password').value.trim();

  if (!host || !port || !password) {
    sfx.play('err');
    toast('Todos los campos son obligatorios.', 'fail');
    return;
  }

  const btn = $('btn-save-config');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando...';
  sfx.play('click');

  try {
    const r = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, port, password })
    });
    const d = await r.json();
    if (r.ok) {
      sfx.play('ok');
      toast('✅ ¡Configuración guardada y RCON Conectado!', 'ok');
      await refreshAll();
    } else {
      sfx.play('err');
      toast(`❌ ${d.error}`, 'fail');
    }
  } catch (e) {
    sfx.play('err');
    toast('Error de red al intentar conectar.', 'fail');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-plug"></i> Conectar y Guardar';
  }
}

async function disconnectConfig() {
  sfx.play('warn');
  if (!confirm('¿Seguro que deseas desconectarte de este servidor? Se eliminará la configuración guardada.')) return;
  try {
    const r = await fetch('/api/config/clear', { method: 'POST' });
    if (r.ok) {
      sfx.play('ok');
      toast('Configuración de servidor eliminada.', 'info');
      await refreshAll();
    }
  } catch (e) {
    toast('Error de red al desconectar.', 'fail');
  }
}

function setMuted(m) {
  state.isMuted = m;
  localStorage.setItem('poxi_muted', m);
  $('sound-icon').className = m ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
  $('sound-toggle').classList.toggle('muted', m);
}

// ===== DATA =====
async function refreshAll() {
  await fetchStatus();
  if (state.isConfigured) {
    await fetchPlayers();
  }
}

async function fetchStatus() {
  try {
    const d = await (await fetch('/api/status')).json();
    state.isConfigured = d.configured;
    state.isConnected = d.connected;

    if (!d.configured) {
      $('config-screen').style.display = 'flex';
      $('app-panel').style.display = 'none';
      return;
    } else {
      $('config-screen').style.display = 'none';
      $('app-panel').style.display = 'flex';
    }

    $('status-led').className = d.connected ? 'status-led on' : d.connecting ? 'status-led' : 'status-led off';
    $('status-label').innerText = d.connected ? 'CONECTADO' : d.connecting ? 'CONECTANDO' : 'OFFLINE';
    $('ping-label').innerText = d.connected ? d.ping : '--';
    if ($('info-ping')) $('info-ping').innerText = d.connected ? `${d.ping} ms` : '-- ms';
    if ($('info-state')) $('info-state').innerText = d.connected ? 'Online' : d.connecting ? 'Reconectando...' : 'Offline';
    if ($('info-ip')) $('info-ip').innerText = d.serverIp || '--';
    if ($('info-port')) $('info-port').innerText = d.serverPort || '--';
  } catch(e) {
    $('status-led').className = 'status-led off';
    $('status-label').innerText = 'ERROR';
  }
}

async function fetchPlayers() {
  if (!state.isConnected) { renderPlayers([]); return; }
  try {
    const d = await (await fetch('/api/players')).json();
    state.players = d.players || [];
    $('sidebar-players').innerText = state.players.length;
    renderPlayers(state.players);
    updatePlayerSelects();
  } catch(e) { renderPlayers([]); }
}

async function fetchChat() {
  if (!state.isConnected) { $('chat-box').innerHTML = '<p class="muted">RCON no conectado.</p>'; return; }
  try {
    const d = await (await fetch('/api/chat')).json();
    const c = d.chat || '';
    $('chat-box').innerText = (c.trim() && !c.includes('no response')) ? c : 'No hay mensajes recientes.';
    sfx.play('ok');
  } catch(e) { $('chat-box').innerHTML = '<p class="muted">Error obteniendo chat.</p>'; }
}

// ===== RENDER PLAYERS =====
function renderPlayers(players) {
  const el = $('players-grid');
  if (players.length === 0) {
    el.innerHTML = `<div class="empty"><i class="fa-solid fa-ghost"></i><p>${state.isConnected ? 'No hay sobrevivientes conectados.' : 'Esperando conexión RCON...'}</p></div>`;
    $('sidebar-players').innerText = '0';
    return;
  }
  el.innerHTML = players.map(p => {
    const ini = p.name ? p.name[0].toUpperCase() : '?';
    return `<div class="player-row">
      <div class="player-info">
        <div class="player-avatar">${ini}</div>
        <div><div class="player-name">${esc(p.name)}</div><div class="player-id">${p.id}</div></div>
      </div>
      <div class="player-actions">
        <button class="p-btn tp" title="Teleportar a ti" onclick="doAction('teleport_to_me','${ea(p.name)}')"><i class="fa-solid fa-location-arrow"></i></button>
        <button class="p-btn kick" title="Expulsar" onclick="confirmAction('¿Expulsar a ${ea(p.name)}?','kick','${ea(p.id)}')"><i class="fa-solid fa-right-from-bracket"></i></button>
        <button class="p-btn ban" title="Banear" onclick="confirmAction('¿BANEAR a ${ea(p.name)}?','ban','${ea(p.id)}')"><i class="fa-solid fa-gavel"></i></button>
      </div>
    </div>`;
  }).join('');
}

// ===== UPDATE PLAYER SELECTS =====
function updatePlayerSelects() {
  document.querySelectorAll('.player-select').forEach(sel => {
    const current = sel.value;
    sel.innerHTML = '<option value="">-- Seleccionar jugador --</option>';
    state.players.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} (${p.id})`;
      sel.appendChild(opt);
    });
    sel.value = current;
  });
}

// ===== SMART ITEM SEARCH =====
function setupItemSearch() {
  const input = $('item-search');
  const results = $('item-results');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { results.classList.remove('show'); return; }

    const matches = ITEMS_DB.filter(item =>
      item.name.toLowerCase().includes(q) || item.gfi.toLowerCase().includes(q)
    ).slice(0, 12);

    if (matches.length === 0) { results.classList.remove('show'); return; }

    results.innerHTML = matches.map(m => `
      <div class="search-result-item" data-gfi="${m.gfi}" data-name="${esc(m.name)}">
        <span><span class="sr-name">${esc(m.name)}</span><span class="sr-cat">${m.cat}</span></span>
        <span class="sr-gfi">${m.gfi}</span>
      </div>
    `).join('');

    results.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        sfx.play('click');
        state.selectedGFI = el.dataset.gfi;
        input.value = el.dataset.name;
        $('selected-item').style.display = 'flex';
        $('selected-item-name').innerText = el.dataset.name;
        $('selected-item-gfi').innerText = el.dataset.gfi;
        results.classList.remove('show');
      });
    });

    results.classList.add('show');
  });

  input.addEventListener('focus', () => { if (input.value.trim().length >= 2) input.dispatchEvent(new Event('input')); });
  document.addEventListener('click', e => { if (!e.target.closest('.search-input-wrap')) results.classList.remove('show'); });
}

window.giveSelectedItem = function() {
  const gfi = state.selectedGFI || $('item-search').value.trim();
  if (!gfi) { sfx.play('err'); toast('Busca y selecciona un item primero.', 'fail'); return; }
  const player = getPlayerOrManual('item-player-sel', 'item-player-manual');
  doAction('giveitem', gfi, gv('item-qty'), gv('item-quality'), player);
};

// ===== BUILD UI =====
function buildDinoChips() {
  $('dino-chips').innerHTML = DINOS_DB.map(d => `<button class="chip" onclick="document.getElementById('dino-name').value='${d.id}'; sfx.play('click');">${d.name}</button>`).join('');
}

function buildDinoDatalist() {
  const dl = document.getElementById('dino-datalist');
  if (!dl) return;
  dl.innerHTML = DINOS_DB.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
}

function buildItemCategories() {
  const cats = {};
  ITEMS_DB.forEach(item => {
    if (!cats[item.cat]) cats[item.cat] = [];
    cats[item.cat].push(item);
  });

  const icons = { Recursos: 'fa-gem', Armas: 'fa-gun', Munición: 'fa-crosshairs', Armadura: 'fa-shield-halved', Herramientas: 'fa-screwdriver-wrench', Utilidades: 'fa-toolbox', Kibble: 'fa-egg', Monturas: 'fa-horse', Comida: 'fa-drumstick-bite', Estructuras: 'fa-building' };

  $('item-categories').innerHTML = Object.entries(cats).map(([cat, items]) => `
    <div>
      <div class="item-cat-header"><i class="fa-solid ${icons[cat] || 'fa-cube'}"></i> ${cat}</div>
      <div class="chip-grid">${items.map(i => `<button class="chip" onclick="selectItem('${i.gfi}','${esc(i.name)}')">${i.name}</button>`).join('')}</div>
    </div>
  `).join('');
}

window.selectItem = function(gfi, name) {
  sfx.play('click');
  state.selectedGFI = gfi;
  $('item-search').value = name;
  $('selected-item').style.display = 'flex';
  $('selected-item-name').innerText = name;
  $('selected-item-gfi').innerText = gfi;
  // Switch to items tab and scroll up
  document.querySelectorAll('.sidebar-btn').forEach(b => { b.classList.toggle('active', b.dataset.tab === 'items'); });
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  $('tab-items').classList.add('active');
  $('main-content').scrollTop = 0;
};

// ===== CONSOLE =====
async function sendCmd() {
  const cmd = $('cmd-input').value.trim();
  if (!cmd) { sfx.play('err'); return; }
  $('cmd-input').value = '';
  sfx.play('click');
  termLog('cmd', `> ${cmd}`);
  if (!state.isConnected) { termLog('err', 'RCON no conectado.'); sfx.play('err'); return; }
  try {
    const d = await (await fetch('/api/command', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({command:cmd}) })).json();
    termLog('res', d.response || d.error);
    sfx.play(d.error ? 'err' : 'ok');
  } catch(e) { termLog('err', 'Error de red.'); sfx.play('err'); }
}

function termLog(type, text) {
  const t = new Date().toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const line = document.createElement('div');
  line.className = `term-line ${type}`;
  line.innerHTML = `<span class="t-time">[${t}]</span><span>${esc(text)}</span>`;
  $('term-body').appendChild(line);
  $('term-body').scrollTo({ top: $('term-body').scrollHeight, behavior: 'smooth' });
}

// ===== ACTIONS =====
window.doAction = async function(action, payload, payload2, payload3, payload4) {
  sfx.play('click');
  if (!state.isConnected) { toast('RCON desconectado.', 'fail'); sfx.play('err'); return; }
  try {
    const r = await fetch('/api/action', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({action,payload,payload2,payload3,payload4}) });
    const d = await r.json();
    if (r.ok) {
      toast(`✅ ${d.response}`, 'ok');
      termLog('res', `[${action}] ${d.response}`);
      sfx.play('ok');
      if (['kick','ban'].includes(action)) setTimeout(fetchPlayers, 2000);
    } else { toast(`❌ ${d.error}`, 'fail'); sfx.play('err'); }
  } catch(e) { toast('Error de red.', 'fail'); sfx.play('err'); }
};

window.sendAction = window.doAction; // alias

// ===== MODAL =====
window.confirmAction = function(text, action, payload) {
  sfx.play('warn');
  state.pendingAction = action;
  state.pendingPayload = payload;
  $('modal-text').innerText = text;
  $('modal').classList.add('active');
};
function closeModal() { $('modal').classList.remove('active'); state.pendingAction = null; state.pendingPayload = null; }

// ===== TOAST =====
function toast(msg, type='info') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icon = type === 'ok' ? 'fa-circle-check' : type === 'fail' ? 'fa-circle-xmark' : 'fa-circle-info';
  t.innerHTML = `<i class="fa-solid ${icon}"></i><span>${esc(msg)}</span>`;
  $('toasts').appendChild(t);
  setTimeout(() => { if (t.parentNode) t.remove(); }, 4200);
}

// ===== HELPERS =====
window.gv = function(id) { return $(id)?.value?.trim() || ''; };
window.getPlayerOrManual = function(selId, manualId) {
  const sel = $(selId)?.value;
  const manual = $(manualId)?.value?.trim();
  return sel || manual || '';
};
function esc(s) { return s ? s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c)) : ''; }
function ea(s) { return s ? s.replace(/'/g, "\\'").replace(/"/g, '&quot;') : ''; }
