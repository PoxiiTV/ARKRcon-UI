const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Iniciar el servidor Express
require('./server.js');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 850,
    icon: "F:\\FORMATEO 2025 - OCTUBRE WIN 11\\CARPETAS IMPORTANTES\\Downloads\\PoxiSpotifyDownloader\\test\\Poxi V4 SUPER PERFECT redondo.ico",
    title: "POXI ARK RCON - PREMIUM CLIENT",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Ocultar menú de Electron para aspecto premium nativo
  Menu.setApplicationMenu(null);

  // Cargar el servidor local con retardo corto para asegurar el arranque del backend
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 800);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
