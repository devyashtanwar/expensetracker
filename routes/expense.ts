import express from 'express';
import { authenticatejwt, SECRET } from '../middlewares/middle';
import { Transaction } from '../db/db';
import { z } from 'zod';
import moment from 'moment-timezone';

const transactionInput = z.object({
    title: z.string().min(5).max(30),
    description: z.undefined(),
    amount: z.number().nonnegative().safe().finite(),
    type: z.string(),
});

const router = express.Router();

router.post('/transaction', authenticatejwt, async (req, res) => {
    const parsedResponse = transactionInput.safeParse(req.body);
    const currentTime = moment().tz('Asia/Kolkata').toISOString();
    const userId = req.headers['userId'];

    if (!parsedResponse) {
        return res.status(401).json({
            message: 'Give correct inputs.',
        });
    }

    const { title, description, amount, type } = req.body;

    console.log('Current Time', currentTime);

    const createTransaction = new Transaction({
        title,
        description,
        amount,
        type,
        currentTime,
        user: userId,
    });

    await createTransaction.save();

    if (createTransaction) {
        res.status(200).json({
            message: 'Transaction created.',
        });
    } else {
        res.status(403).json({
            message: 'Transaction creation failed.',
        });
    }
});

router.get('/transactions', authenticatejwt, async (req, res) => {
    const userId = req.headers['userId'];
    const transactions = await Transaction.find({ user: userId });
    res.json({ transactions });
});

router.put('/transaction/:transactionId', authenticatejwt, (req, res) => {
    const { transactionId } = req.params;
    const userId = req.headers['userId'];
    const updates = req.body;

    Transaction.findOneAndUpdate({ _id: transactionId, userId }, updates, {
        new: true,
    });
    if (Transaction) {
        res.json({
            message: ' Transaction updated successfully.',
        });
    } else {
        res.status(404).json({
            message: 'Transaction not found.',
        });
    }
});

export default router;
