const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs'); // '..' para retroceder un nivel al directorio 'src'

// Definir niveles de log
const logLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
};

// Formato de los logs
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Crear logger para desarrollo
const developmentLogger = createLogger({
    levels: logLevels.levels,
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.Console({ level: 'debug' }),
    ]
});

// Crear logger para producción
const productionLogger = createLogger({
    levels: logLevels.levels,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.Console({ level: 'info' }),
        new transports.File({ filename: path.join(logsDir, 'errors.log'), level: 'error' }),
    ]
});

// Aquí decides manualmente en qué modo estás
const isProduction = false; // Cambiar manualmente según el entorno

// Asignar el logger correspondiente según el modo
const logger = isProduction ? productionLogger : developmentLogger;

// Agregar colores a los niveles de log
require('winston').addColors(logLevels.colors);

// Middleware para agregar el logger a req.logger
const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.warning(`${new Date().toDateString()} ${req.method} ${req.url}`);
    next();
};

module.exports = {
    addLogger,
    logger
};
