"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const expense_1 = __importDefault(require("./routes/expense"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/', auth_1.default);
app.use('/', expense_1.default);
app.listen(3000, () => {
    console.log('Example app listening at http:localhost:3000');
});
mongoose_1.default.connect('mongodb://localhost:27017/transactions', {
    dbName: 'transactions',
});
