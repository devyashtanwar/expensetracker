"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//Defining MongoDB Schemas
const userSchema = new mongoose_1.default.Schema({
    fullName: String,
    username: String,
    email: String,
    password: String,
});
exports.User = mongoose_1.default.model('User', userSchema);
const transactionSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    amount: Number,
    type: String,
    time: Date,
    user: { type: mongoose_1.default.Schema.ObjectId, ref: 'User' },
});
exports.Transaction = mongoose_1.default.model('Transaction', transactionSchema);
