"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middle_1 = require("../middlewares/middle");
const db_1 = require("../db/db");
const zod_1 = require("zod");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const transactionInput = zod_1.z.object({
    title: zod_1.z.string().min(5).max(30),
    description: zod_1.z.undefined(),
    amount: zod_1.z.number().nonnegative().safe().finite(),
    type: zod_1.z.string(),
});
const router = express_1.default.Router();
router.post('/transaction', middle_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedResponse = transactionInput.safeParse(req.body);
    const currentTime = (0, moment_timezone_1.default)().tz('Asia/Kolkata').toISOString();
    const userId = req.headers['userId'];
    if (!parsedResponse) {
        return res.status(401).json({
            message: 'Give correct inputs.',
        });
    }
    const { title, description, amount, type } = req.body;
    console.log('Current Time', currentTime);
    const createTransaction = new db_1.Transaction({
        title,
        description,
        amount,
        type,
        currentTime,
        user: userId,
    });
    yield createTransaction.save();
    if (createTransaction) {
        res.status(200).json({
            message: 'Transaction created.',
        });
    }
    else {
        res.status(403).json({
            message: 'Transaction creation failed.',
        });
    }
}));
router.get('/transactions', middle_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers['userId'];
    const transactions = yield db_1.Transaction.find({ user: userId });
    res.json({ transactions });
}));
router.put('/transaction/:transactionId', middle_1.authenticatejwt, (req, res) => {
    const { transactionId } = req.params;
    const userId = req.headers['userId'];
    const updates = req.body;
    db_1.Transaction.findOneAndUpdate({ _id: transactionId, userId }, updates, {
        new: true,
    });
    if (db_1.Transaction) {
        res.json({
            message: ' Transaction updated successfully.',
        });
    }
    else {
        res.status(404).json({
            message: 'Transaction not found.',
        });
    }
});
exports.default = router;
