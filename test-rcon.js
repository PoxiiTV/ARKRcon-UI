const { Rcon } = require('rcon-client');

async function testConnection() {
  console.log('🧪 Iniciando prueba RCON (TDD)...');
  console.log('Intentando conectar al servidor de ARK:');
  console.log('Host: 167.17.71.121');
  console.log('Puerto: 25205');

  try {
    // Intentar establecer conexión con rcon-client
    const rcon = await Rcon.connect({
      host: '167.17.71.121',
      port: 25205,
      password: 'aujihsfbdiuasf89hq3tr',
      timeout: 10000 // 10 segundos de timeout
    });

    console.log('✅ ¡Conectado con éxito al servidor RCON de ARK!');

    // Enviar comando para listar jugadores
    console.log('Enviando comando: ListPlayers');
    const playersResponse = await rcon.send('ListPlayers');
    console.log('Respuesta del Servidor (Jugadores):');
    console.log('------------------------------------');
    console.log(playersResponse || '(Vacío)');
    console.log('------------------------------------');

    // Enviar comando para enviar un chat global discreto en el juego
    console.log('Enviando chat de prueba: ServerChat "RCON Web Client Connected"');
    const chatResponse = await rcon.send('ServerChat RCON Web Client Connected');
    console.log('Respuesta del Servidor (Chat):', chatResponse || 'OK');

    // Cerrar conexión
    await rcon.end();
    console.log('🔌 Conexión RCON cerrada limpiamente.');
    console.log('🚀 PRUEBA RCON COMPLETADA CON ÉXITO.');
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR AL CONECTAR O ENVIAR COMANDOS RCON:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
