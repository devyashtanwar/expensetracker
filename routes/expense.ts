import express from 'express';
import { authenticatejwt, SECRET } from '../middlewares/middle';
import { Transaction } from '../db/db';

const router = express.Router();

router.post('/transaction', authenticatejwt, async (req, res) => {
    const { title, description, amount, type } = req.body;
    const currentTime = new Date();
    const userId = req.headers['userId'];

    const transaction = new Transaction({
        title,
        description,
        amount,
        type,
        time: currentTime,
        user: userId,
    });
    await transaction.save();
    if (transaction) {
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
