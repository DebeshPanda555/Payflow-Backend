"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('common')); // Use common format for production safety mapping
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Apply rate limiter purely to /api routes
app.use('/api', rateLimiter_1.apiLimiter);
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'PayFlow backend is running optimally.' });
});
app.get('/', (req, res) => {
    res.redirect('/api/docs');
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
