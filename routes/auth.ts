import jwt from 'jsonwebtoken';
import express from 'express';
import { authenticatejwt, SECRET } from '../middlewares/middle';
import { User } from '../db/db';
import { z } from 'zod';

const signUpInput = z.object({
    fullName: z.string(),
    username: z.string().min(5).max(20),
    email: z.string().email().min(10).max(50),
    password: z.string().min(8),
});

const router = express.Router();

router.post('/signup', async (req, res) => {
    const parsedResponse = signUpInput.safeParse(req.body);
    if (!parsedResponse) {
        return res.status(401).json({
            msg: 'Give correct inputs.',
        });
    }

    const { fullName, username, email, password } = req.body;

    const user = await User.findOne({ username });
    if (user) {
        res.status(403).json({
            message: 'User Already Exists.',
        });
    } else {
        const newUser = new User({ fullName, username, email, password });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, SECRET, {
            expiresIn: '1h',
        });
        res.json({
            message: 'User created successfully',
            token,
        });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({
        password,
        username,
    });

    if (user) {
        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
        res.json({
            Message: 'Logged in successfully.',
            token,
        });
    } else {
        res.status(403).json({
            message: 'Invalid username or password.',
        });
    }
});

router.get('/me', authenticatejwt, async (req, res) => {
    const userId = req.headers['userId'];
    const user = await User.findOne({ _id: userId });

    if (user) {
        res.json({ user });
    } else {
        res.status(403).json({
            message: 'User not logged in.',
        });
    }
});

export default router;
