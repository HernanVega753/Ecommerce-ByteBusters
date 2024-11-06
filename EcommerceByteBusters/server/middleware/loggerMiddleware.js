// loggerMiddleware.js
const loggerMiddleware = (req, res, next) => {
    const now = new Date();
    console.log(`[${now.toISOString()}] ${req.method} ${req.url}`);
    next(); // Llama a next() para continuar al siguiente middleware o ruta
};

export default loggerMiddleware;

