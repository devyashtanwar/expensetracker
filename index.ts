import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';
import expenseRoutes from './routes/expense';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', authRoutes);
app.use('/', expenseRoutes);

app.listen(3000, () => {
    console.log('Example app listening at http:localhost:3000');
});

mongoose.connect('mongodb://localhost:27017/transactions', {
    dbName: 'transactions',
});
