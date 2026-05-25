const express = require('express');
const { Rcon } = require('rcon-client');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const fs = require('fs');
const CONFIG_FILE = path.join(__dirname, 'config.json');

let RCON_CONFIG = {
  host: '',
  port: 0,
  password: '',
  timeout: 5000
};

let isConfigured = false;

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      if (data.host && data.port && data.password) {
        RCON_CONFIG.host = data.host;
        RCON_CONFIG.port = parseInt(data.port, 10);
        RCON_CONFIG.password = data.password;
        isConfigured = true;
        console.log(`📂 Configuración cargada con éxito: ${RCON_CONFIG.host}:${RCON_CONFIG.port}`);
        return true;
      }
    } catch (e) {
      console.error('❌ Error leyendo config.json:', e.message);
    }
  }
  isConfigured = false;
  console.log('⚠️ Sin configuración de RCON guardada. Esperando datos del usuario...');
  return false;
}

let rcon = null;
let isConnected = false;
let isConnecting = false;
let lastPingTime = 0;
let connectionError = null;

async function connectRcon() {
  if (!isConfigured) return;
  if (isConnecting || isConnected) return;
  isConnecting = true;
  connectionError = null;
  console.log('🔄 Conectando RCON...');

  try {
    const startTime = Date.now();
    rcon = await Rcon.connect({
      host: RCON_CONFIG.host,
      port: RCON_CONFIG.port,
      password: RCON_CONFIG.password,
      timeout: RCON_CONFIG.timeout
    });
    isConnected = true;
    isConnecting = false;
    lastPingTime = Date.now() - startTime;
    console.log(`✅ RCON OK (${lastPingTime}ms)`);

    rcon.on('error', (err) => handleDisconnect(err.message));
    rcon.on('end', () => handleDisconnect('Conexión finalizada.'));
  } catch (err) {
    isConnecting = false;
    isConnected = false;
    rcon = null;
    connectionError = err.message;
    console.error('❌ RCON Error:', err.message);
  }
}

function handleDisconnect(reason) {
  isConnected = false;
  rcon = null;
  connectionError = reason;
}

setInterval(() => {
  if (!isConfigured) return;
  if (!isConnected && !isConnecting) {
    connectRcon();
  } else if (isConnected && rcon) {
    const s = Date.now();
    rcon.send('ListPlayers')
      .then(() => { lastPingTime = Date.now() - s; })
      .catch((err) => handleDisconnect(err.message));
  }
}, 10000);

function parsePlayers(rawText) {
  if (!rawText || rawText.includes('No Players Connected') || rawText.trim() === '') return [];
  const lines = rawText.split('\n');
  const players = [];
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    const match = line.match(/^(?:\d+\.\s+)?([^,]+),\s*(\d+)$/);
    if (match) {
      players.push({ name: match[1].trim(), id: match[2].trim() });
    } else {
      const parts = line.split(',');
      if (parts.length >= 2) {
        players.push({ name: parts[0].trim().replace(/^\d+\.\s+/, ''), id: parts[1].trim() });
      }
    }
  }
  return players;
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- API ---

app.get('/api/status', (req, res) => {
  res.json({
    configured: isConfigured,
    connected: isConnected,
    connecting: isConnecting,
    ping: isConnected ? lastPingTime : null,
    serverIp: isConfigured ? RCON_CONFIG.host : null,
    serverPort: isConfigured ? RCON_CONFIG.port : null,
    error: connectionError
  });
});

app.post('/api/config', async (req, res) => {
  const { host, port, password } = req.body;
  if (!host || !port || !password) {
    return res.status(400).json({ error: 'IP, puerto y contraseña RCON son requeridos.' });
  }

  // Desconectar conexión existente si hay una activa
  if (rcon) {
    try {
      await rcon.end();
    } catch(e){}
    rcon = null;
    isConnected = false;
    isConnecting = false;
  }

  // Guardar en el objeto actual
  RCON_CONFIG.host = host.trim();
  RCON_CONFIG.port = parseInt(port, 10);
  RCON_CONFIG.password = password.trim();
  isConfigured = true;

  // Probar la conexión inmediatamente
  isConnecting = true;
  connectionError = null;
  console.log(`🔄 Probando conexión a ${RCON_CONFIG.host}:${RCON_CONFIG.port}...`);

  try {
    const startTime = Date.now();
    const testRcon = await Rcon.connect({
      host: RCON_CONFIG.host,
      port: RCON_CONFIG.port,
      password: RCON_CONFIG.password,
      timeout: 5000
    });

    // Éxito de conexión
    rcon = testRcon;
    isConnected = true;
    isConnecting = false;
    lastPingTime = Date.now() - startTime;
    console.log(`✅ Conexión de prueba RCON OK (${lastPingTime}ms)`);

    rcon.on('error', (err) => handleDisconnect(err.message));
    rcon.on('end', () => handleDisconnect('Conexión finalizada.'));

    // Escribir en el archivo
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({
      host: RCON_CONFIG.host,
      port: RCON_CONFIG.port,
      password: RCON_CONFIG.password
    }, null, 2), 'utf8');

    return res.json({ success: true, message: 'Configuración guardada y conexión exitosa.' });
  } catch (err) {
    isConnecting = false;
    isConnected = false;
    rcon = null;
    isConfigured = false;
    connectionError = err.message;
    console.error('❌ Error en prueba de conexión RCON:', err.message);
    return res.status(500).json({ error: `Fallo de conexión: ${err.message}` });
  }
});

app.post('/api/config/clear', async (req, res) => {
  if (rcon) {
    try {
      await rcon.end();
    } catch(e){}
    rcon = null;
    isConnected = false;
    isConnecting = false;
  }

  isConfigured = false;
  RCON_CONFIG = { host: '', port: 0, password: '', timeout: 5000 };

  if (fs.existsSync(CONFIG_FILE)) {
    try {
      fs.unlinkSync(CONFIG_FILE);
    } catch (e){}
  }

  console.log('📂 Configuración eliminada por petición del usuario.');
  res.json({ success: true, message: 'Configuración eliminada.' });
});

app.get('/api/players', async (req, res) => {
  if (!isConnected || !rcon) return res.status(503).json({ error: 'RCON no conectado.' });
  try {
    const raw = await rcon.send('ListPlayers');
    res.json({ players: parsePlayers(raw), raw });
  } catch (error) {
    res.status(500).json({ error: 'Error ListPlayers.' });
  }
});

app.get('/api/chat', async (req, res) => {
  if (!isConnected || !rcon) return res.status(503).json({ error: 'RCON no conectado.' });
  try {
    const response = await rcon.send('GetChat');
    res.json({ chat: response || '' });
  } catch (error) {
    res.status(500).json({ error: 'Error GetChat.' });
  }
});

app.post('/api/command', async (req, res) => {
  const { command } = req.body;
  if (!command || !command.trim()) return res.status(400).json({ error: 'Comando vacío.' });
  if (!isConnected || !rcon) return res.status(503).json({ error: 'RCON no conectado.' });
  try {
    console.log(`CMD: ${command}`);
    const response = await rcon.send(command);
    res.json({ success: true, response: response || 'Ejecutado (sin respuesta).' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const GFI_TO_BP = {
  // Recursos Básicos
  'Wood': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Wood.PrimalItemResource_Wood'",
  'Stone': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Stone.PrimalItemResource_Stone'",
  'Fiber': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Fibers.PrimalItemResource_Fibers'",
  'Thatch': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Thatch.PrimalItemResource_Thatch'",
  'Flint': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Flint.PrimalItemResource_Flint'",
  'Hide': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Hide.PrimalItemResource_Hide'",
  'Chitin': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Chitin.PrimalItemResource_Chitin'",
  'Keratin': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Keratin.PrimalItemResource_Keratin'",
  'Pelt': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Pelt.PrimalItemResource_Pelt'",

  // Recursos Avanzados
  'MetalIngot': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_MetalIngot.PrimalItemResource_MetalIngot'",
  'Metal': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Metal.PrimalItemResource_Metal'",
  'Crystal': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Crystal.PrimalItemResource_Crystal'",
  'Obsidian': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Obsidian.PrimalItemResource_Obsidian'",
  'Silicon': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Silicon.PrimalItemResource_Silicon'",
  'BlackPearl': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_BlackPearl.PrimalItemResource_BlackPearl'",
  'Polymer': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Polymer.PrimalItemResource_Polymer'",
  'OrganicPolymer': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_PolymerOrganic.PrimalItemResource_PolymerOrganic'",
  'ChitinPaste': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_ChitinPaste.PrimalItemResource_ChitinPaste'",
  'Electronics': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Electronics.PrimalItemResource_Electronics'",
  'Oil': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Oil.PrimalItemResource_Oil'",
  'Gasoline': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Gasoline.PrimalItemResource_Gasoline'",
  'Gunpowder': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Gunpowder.PrimalItemResource_Gunpowder'",
  'Sparkpowder': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Sparkpowder.PrimalItemResource_Sparkpowder'",
  'Narcotics': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Consumables/PrimalItemConsumable_Narcotic.PrimalItemConsumable_Narcotic'",
  'Stimulant': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Consumables/PrimalItemConsumable_Stimulant.PrimalItemConsumable_Stimulant'",
  'Stimberry': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Consumables/PrimalItemConsumable_Berry_Stimberry.PrimalItemConsumable_Berry_Stimberry'",
  'Narcoberry': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Consumables/PrimalItemConsumable_Berry_Narcoberry.PrimalItemConsumable_Berry_Narcoberry'",
  'MejoBerry': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Consumables/PrimalItemConsumable_Berry_Mejoberry.PrimalItemConsumable_Berry_Mejoberry'",
  'Element': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Element.PrimalItemResource_Element'",
  'ElementDust': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_ElementDust.PrimalItemResource_ElementDust'",
  'Sap': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_Sap.PrimalItemResource_Sap'",
  'SubstrateAbsorbent': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_SubstrateAbsorbent.PrimalItemResource_SubstrateAbsorbent'",

  // Armas
  'WeaponPike': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponPike.PrimalItem_WeaponPike'",
  'Shotgun': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponShotgun.PrimalItem_WeaponShotgun'",
  'Longneck': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponSniperRifle.PrimalItem_WeaponSniperRifle'",
  'AssaultRifle': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponMachinedRifle.PrimalItem_WeaponMachinedRifle'",
  'FabSniper': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponMachinedSniper.PrimalItem_WeaponMachinedSniper'",
  'FabPistol': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponMachinedPistol.PrimalItem_WeaponMachinedPistol'",
  'TekSniper': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponTekSniper.PrimalItem_WeaponTekSniper'",
  'TekSword': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponTekSword.PrimalItem_WeaponTekSword'",
  'Crossbow': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponCrossbow.PrimalItem_WeaponCrossbow'",
  'Bow': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponBow.PrimalItem_WeaponBow'",
  'RocketLauncher': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponRocketLauncher.PrimalItem_WeaponRocketLauncher'",
  'WeaponC4': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponC4.PrimalItem_WeaponC4'",
  'Sword': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponSword.PrimalItem_WeaponSword'",
  'WeaponBola': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponBola.PrimalItem_WeaponBola'",
  'Harpoon': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponHarpoon.PrimalItem_WeaponHarpoon'",

  // Munición
  'SimpleBullet': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItemAmmo_SimpleBullet.PrimalItemAmmo_SimpleBullet'",
  'AdvancedBullet': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItemAmmo_AdvancedBullet.PrimalItemAmmo_AdvancedBullet'",
  'AdvancedRifleBullet': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItemAmmo_AdvancedRifleBullet.PrimalItemAmmo_AdvancedRifleBullet'",
  'ArrowStone': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItemAmmo_ArrowStone.PrimalItemAmmo_ArrowStone'",
  'ArrowTranq': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItemAmmo_ArrowTranq.PrimalItemAmmo_ArrowTranq'",
  'TranqDart': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItemAmmo_TranqDart.PrimalItemAmmo_TranqDart'",
  'ShockingTranqDart': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItemAmmo_RefinedTranqDart.PrimalItemAmmo_RefinedTranqDart'",
  'RocketAmmo': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItemAmmo_Rocket.PrimalItemAmmo_Rocket'",
  'ShotgunAmmo': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItemAmmo_SimpleShotgunBullet.PrimalItemAmmo_SimpleShotgunBullet'",
  'C4Ammo': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItemWeaponAmmo_C4.PrimalItemWeaponAmmo_C4'",

  // Armaduras
  'FlakHelmet': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Metal/PrimalItemArmor_MetalHelmet.PrimalItemArmor_MetalHelmet'",
  'FlakShirt': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Metal/PrimalItemArmor_MetalShirt.PrimalItemArmor_MetalShirt'",
  'FlakGloves': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Metal/PrimalItemArmor_MetalGloves.PrimalItemArmor_MetalGloves'",
  'FlakPants': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Metal/PrimalItemArmor_MetalPants.PrimalItemArmor_MetalPants'",
  'FlakBoots': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Metal/PrimalItemArmor_MetalBoots.PrimalItemArmor_MetalBoots'",
  'TekHelmet': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/TEK/PrimalItemArmor_TekHelmet.PrimalItemArmor_TekHelmet'",
  'TekShirt': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/TEK/PrimalItemArmor_TekShirt.PrimalItemArmor_TekShirt'",
  'TekGloves': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/TEK/PrimalItemArmor_TekGloves.PrimalItemArmor_TekGloves'",
  'TekPants': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/TEK/PrimalItemArmor_TekPants.PrimalItemArmor_TekPants'",
  'TekBoots': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/TEK/PrimalItemArmor_TekBoots.PrimalItemArmor_TekBoots'",

  // Herramientas
  'MetalPick': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponMetalPick.PrimalItem_WeaponMetalPick'",
  'MetalHatchet': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponMetalHatchet.PrimalItem_WeaponMetalHatchet'",
  'Chainsaw': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_ChainSaw.PrimalItem_ChainSaw'",
  'Spyglass': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponSpyglass.PrimalItem_WeaponSpyglass'",
  'GPS': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/PrimalItemArmor_GPS.PrimalItemArmor_GPS'",
  'Compass': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponCompass.PrimalItem_WeaponCompass'",

  // Utilidades
  'CryoPod': "Blueprint'/Game/Extinction/CoreBlueprints/Weapons/PrimalItem_WeaponEmptyCryopod.PrimalItem_WeaponEmptyCryopod'",
  'CryoFridge': "Blueprint'/Game/Extinction/CoreBlueprints/Structures/PrimalStructure_CryoFridge.PrimalStructure_CryoFridge'",
  'Torch': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Weapons/PrimalItem_WeaponTorch.PrimalItem_WeaponTorch'",

  // Kibble
  'Kibble_Base_XSmall': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Consumables/PrimalItemConsumable_Kibble_Base_XSmall.PrimalItemConsumable_Kibble_Base_XSmall'",
  'Kibble_Base_Small': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Consumables/PrimalItemConsumable_Kibble_Base_Small.PrimalItemConsumable_Kibble_Base_Small'",
  'Kibble_Base_Medium': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Consumables/PrimalItemConsumable_Kibble_Base_Medium.PrimalItemConsumable_Kibble_Base_Medium'",
  'Kibble_Base_Large': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Consumables/PrimalItemConsumable_Kibble_Base_Large.PrimalItemConsumable_Kibble_Base_Large'",
  'Kibble_Base_XLarge': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Consumables/PrimalItemConsumable_Kibble_Base_XLarge.PrimalItemConsumable_Kibble_Base_XLarge'",
  'Kibble_Base_Special': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Consumables/PrimalItemConsumable_Kibble_Base_Special.PrimalItemConsumable_Kibble_Base_Special'",

  // Monturas
  'RexSaddle': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Saddles/PrimalItemArmor_RexSaddle.PrimalItemArmor_RexSaddle'",
  'RaptorSaddle': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Saddles/PrimalItemArmor_RaptorSaddle.PrimalItemArmor_RaptorSaddle'",
  'SpinoSaddle': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Saddles/PrimalItemArmor_SpinoSaddle.PrimalItemArmor_SpinoSaddle'",
  'ArgentavisSaddle': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Saddles/PrimalItemArmor_ArgentavisSaddle.PrimalItemArmor_ArgentavisSaddle'",
  'QuetzSaddle': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Saddles/PrimalItemArmor_QuetzSaddle.PrimalItemArmor_QuetzSaddle'",
  'GigaSaddle': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Saddles/PrimalItemArmor_GiganotosaurusSaddle.PrimalItemArmor_GiganotosaurusSaddle'",
  'TrikeSaddle': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Saddles/PrimalItemArmor_TrikeSaddle.PrimalItemArmor_TrikeSaddle'",
  'PteroSaddle': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Armor/Saddles/PrimalItemArmor_PteroSaddle.PrimalItemArmor_PteroSaddle'",

  // Comida
  'CookedMeat': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Consumables/PrimalItemConsumable_CookedMeat.PrimalItemConsumable_CookedMeat'",
  'CookedPrimeMeat': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Consumables/PrimalItemConsumable_CookedPrimeMeat.PrimalItemConsumable_CookedPrimeMeat'",

  // Estructuras
  'MetalFloor': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Structures/Metal/PrimalItemStructure_MetalFloor.PrimalItemStructure_MetalFloor'",
  'MetalWall': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Structures/Metal/PrimalItemStructure_MetalWall.PrimalItemStructure_MetalWall'",
  'AutoTurret': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Structures/Misc/PrimalItemStructure_TurretAuto.PrimalItemStructure_TurretAuto'",
  'HeavyTurret': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Structures/Misc/PrimalItemStructure_TurretHeavy.PrimalItemStructure_TurretHeavy'",
  'TekTurret': "Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Structures/Misc/PrimalItemStructure_TurretTek.PrimalItemStructure_TurretTek'"
};

app.post('/api/action', async (req, res) => {
  const { action, payload, payload2, payload3, payload4 } = req.body;
  if (!action) return res.status(400).json({ error: 'Acción no especificada.' });
  if (!isConnected || !rcon) return res.status(503).json({ error: 'RCON no conectado.' });

  let cmd = '';

  switch (action) {
    // Jugadores
    case 'kick':
      if (!payload) return res.status(400).json({ error: 'Steam ID requerido.' });
      cmd = `KickPlayer ${payload}`;
      break;
    case 'ban':
      if (!payload) return res.status(400).json({ error: 'Steam ID requerido.' });
      cmd = `BanPlayer ${payload}`;
      break;
    case 'unban':
      if (!payload) return res.status(400).json({ error: 'Steam ID requerido.' });
      cmd = `UnbanPlayer ${payload}`;
      break;
    case 'whitelist_add':
      if (!payload) return res.status(400).json({ error: 'Steam ID requerido.' });
      cmd = `AllowPlayerToJoinNoCheck ${payload}`;
      break;
    case 'whitelist_remove':
      if (!payload) return res.status(400).json({ error: 'Steam ID requerido.' });
      cmd = `DisallowPlayerToJoinNoCheck ${payload}`;
      break;
    case 'rename_player':
      if (!payload || !payload2) return res.status(400).json({ error: 'Nombre actual y nuevo requeridos.' });
      cmd = `RenamePlayer "${payload}" "${payload2}"`;
      break;
    case 'rename_tribe':
      if (!payload || !payload2) return res.status(400).json({ error: 'Nombre actual y nuevo requeridos.' });
      cmd = `RenameTribe "${payload}" "${payload2}"`;
      break;
    case 'kill_player':
      if (!payload) return res.status(400).json({ error: 'Player ID requerido.' });
      cmd = `KillPlayer ${payload}`;
      break;
    case 'clear_inventory':
      if (!payload) return res.status(400).json({ error: 'Player ID requerido.' });
      cmd = `ClearPlayerInventory ${payload} 1 1 1`;
      break;
    case 'defeat_boss':
      if (!payload || !payload2 || !payload3) return res.status(400).json({ error: 'Jugador, Jefe y Dificultad requeridos.' });
      cmd = `DefeatBoss ${payload} "${payload2}" ${payload3}`;
      break;
    case 'force_join_tribe':
      if (!payload || !payload2) return res.status(400).json({ error: 'Jugador y Nombre de Tribu requeridos.' });
      cmd = `ForcePlayerToJoinTribe ${payload} "${payload2}"`;
      break;

    // Mensajería
    case 'broadcast':
      if (!payload || !payload.trim()) return res.status(400).json({ error: 'Mensaje vacío.' });
      cmd = `Broadcast ${payload}`;
      break;
    case 'serverchat':
      if (!payload || !payload.trim()) return res.status(400).json({ error: 'Mensaje vacío.' });
      cmd = `ServerChat ${payload}`;
      break;
    case 'serverchat_player':
      if (!payload || !payload2) return res.status(400).json({ error: 'Jugador y mensaje requeridos.' });
      cmd = `ServerChatToPlayer "${payload}" ${payload2}`;
      break;
    case 'setmotd':
      if (!payload) return res.status(400).json({ error: 'MOTD requerido.' });
      cmd = `SetMessageOfTheDay ${payload}`;
      break;
    case 'showmotd':
      cmd = 'ShowMessageOfTheDay';
      break;

    // Servidor
    case 'save':
      cmd = 'SaveWorld';
      break;
    case 'save_broadcast': {
      // Guardar con broadcast
      const msg = payload || 'El mundo se está guardando...';
      try {
        await rcon.send(`Broadcast ${msg}`);
        await new Promise(r => setTimeout(r, 500));
        const saveResp = await rcon.send('SaveWorld');
        return res.json({ success: true, command: `Broadcast + SaveWorld`, response: saveResp || 'Mundo guardado con aviso.' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
    case 'doexit':
      cmd = 'DoExit';
      break;
    case 'slomo':
      if (!payload) return res.status(400).json({ error: 'Velocidad requerida.' });
      cmd = `Slomo ${payload}`;
      break;

    // Hora y Clima
    case 'time':
      if (!payload) return res.status(400).json({ error: 'Hora requerida.' });
      cmd = `SetTimeOfDay ${payload}`;
      break;
    case 'weather':
      if (!payload) return res.status(400).json({ error: 'Tipo de clima requerido.' });
      cmd = `CE ${payload}`;
      break;

    // Dinosaurios
    case 'wilddinos':
      cmd = 'DestroyWildDinos';
      break;
    case 'destroyall_class':
      if (!payload) return res.status(400).json({ error: 'Nombre de clase de criatura requerido.' });
      cmd = `DestroyAll ${payload}`;
      break;
    case 'settargetdinocount':
      if (!payload) return res.status(400).json({ error: 'Cantidad requerida.' });
      cmd = `SetTargetDinoCount ${payload}`;
      break;

    // Items
    case 'giveitem':
      if (!payload || !payload2) return res.status(400).json({ error: 'Item y cantidad requeridos.' });
      if (payload4) {
        // Dar a jugador específico
        let bpPath = GFI_TO_BP[payload];
        if (!bpPath) {
          // Fallback inteligente (predecir la ruta si es de recursos, estructuras, etc.)
          if (payload.includes('Floor') || payload.includes('Wall') || payload.includes('Ceiling') || payload.includes('Gate')) {
            bpPath = `Blueprint'/Game/PrimalEarth/CoreBlueprints/Items/Structures/Metal/PrimalItemStructure_${payload}.PrimalItemStructure_${payload}'`;
          } else {
            bpPath = `Blueprint'/Game/PrimalEarth/CoreBlueprints/Resources/PrimalItemResource_${payload}.PrimalItemResource_${payload}'`;
          }
        }
        cmd = `GiveItemToPlayer ${payload4} "${bpPath}" ${payload2} ${payload3 || '0'} 0`;
      } else {
        // Dar a sí mismo
        cmd = `GFI ${payload} ${payload2} ${payload3 || '0'} 0`;
      }
      break;

    // Experiencia a jugador específico
    case 'giveexp_player':
      if (!payload || !payload2) return res.status(400).json({ error: 'ID de jugador y cantidad requeridos.' });
      cmd = `GiveExpToPlayer ${payload} ${payload2} 0 1`;
      break;

    // Wipes de Tribus y Globales
    case 'destroytribe_dinos':
      if (!payload) return res.status(400).json({ error: 'ID de Tribu requerido.' });
      cmd = `DestroyTribeIdDinos ${payload}`;
      break;
    case 'destroytribe_structures':
      if (!payload) return res.status(400).json({ error: 'ID de Tribu requerido.' });
      cmd = `DestroyTribeIdStructures ${payload}`;
      break;
    case 'destroytribe_players':
      if (!payload) return res.status(400).json({ error: 'ID de Tribu requerido.' });
      cmd = `DestroyTribeIdPlayers ${payload}`;
      break;
    case 'destroy_all_structures':
      cmd = `DestroyStructures`;
      break;

    default:
      return res.status(400).json({ error: `Acción desconocida: ${action}` });
  }

  try {
    console.log(`⚡ ${action} → [${cmd}]`);
    const response = await rcon.send(cmd);
    res.json({ success: true, command: cmd, response: response || 'Acción enviada con éxito.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 RCON Web → http://localhost:${PORT}`);
  loadConfig();
  if (isConfigured) {
    connectRcon();
  }
});
