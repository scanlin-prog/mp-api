#!/usr/bin/env node
import app from '@app';
import debug from 'debug';
import { createServer } from 'http';

// Получаем порт из окружающей среды и сохраняем в Express.
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

// Создаем HTTP сервер
const server = createServer(app);
const debugServer = debug('mp-api:server');

// Прослушивание через указанный порт на всех сетевых интерфейсах
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
server.on('error', onError);
server.on('listening', onListening);

// Преобразование порта в число, строку или указание его отсутствия
function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

// Обратная фукнция для события "ошибка" HTTP-сервера.
function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Устранение конкретных ошибок при прослушивании
  // с помощью дружественных сообщений
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Обратная фукнция для события "прослушивания" HTTP-сервера.
function onListening() {
  const addr = server.address();
  if (addr) {
    const bind =
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debugServer('Listening on ' + bind);
  }
}
