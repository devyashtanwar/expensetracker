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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const middle_1 = require("../middlewares/middle");
const db_1 = require("../db/db");
const zod_1 = require("zod");
const signUpInput = zod_1.z.object({
    fullName: zod_1.z.string(),
    username: zod_1.z.string().min(5).max(20),
    email: zod_1.z.string().email().min(10).max(50),
    password: zod_1.z.string().min(8),
});
const router = express_1.default.Router();
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedResponse = signUpInput.safeParse(req.body);
    if (!parsedResponse) {
        return res.status(401).json({
            msg: 'Give correct inputs.',
        });
    }
    const { fullName, username, email, password } = req.body;
    const user = yield db_1.User.findOne({ username });
    if (user) {
        res.status(403).json({
            message: 'User Already Exists.',
        });
    }
    else {
        const newUser = new db_1.User({ fullName, username, email, password });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, middle_1.SECRET, {
            expiresIn: '1h',
        });
        res.json({
            message: 'User created successfully',
            token,
        });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.User.findOne({
        password,
        username,
    });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user._id }, middle_1.SECRET, { expiresIn: '1h' });
        res.json({
            Message: 'Logged in successfully.',
            token,
        });
    }
    else {
        res.status(403).json({
            message: 'Invalid username or password.',
        });
    }
}));
router.get('/me', middle_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers['userId'];
    const user = yield db_1.User.findOne({ _id: userId });
    if (user) {
        res.json({ user });
    }
    else {
        res.status(403).json({
            message: 'User not logged in.',
        });
    }
}));
exports.default = router;
