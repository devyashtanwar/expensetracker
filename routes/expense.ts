import express from 'express';
import { authenticatejwt, SECRET } from '../middlewares/middle';
import { Transaction } from '../db/db';

const router = express.Router();

router.post('/transaction', authenticatejwt, async (req, res) => {
    const { title, description, amount, credit, debit } = req.body;
    const currentTime = new Date();
    const userId = req.headers['userId'];

    const transaction = new Transaction({
        title,
        description,
        amount,
        credit,
        debit,
        time: currentTime,
        userId,
    });
    await transaction.save();
    if (transaction) {
        res.send(401).json({
            message: 'Transaction created.',
        });
    } else {
        res.send(403).json({
            message: 'Transaction creation failed.',
        });
    }
});

router.get('/transaction', authenticatejwt, async (req, res) => {
    const userId = req.headers['userId'];
    const transactions = await Transaction.find({ userId });
    res.json({ transactions });
});

router.get('/trans', async (req, res) => {
    res.json({
        message: 'Hi there!',
    });
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
