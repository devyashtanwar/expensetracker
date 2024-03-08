import mongoose from 'mongoose';

//Defining MongoDB Schemas
const userSchema = new mongoose.Schema({
    fullName: String,
    username: String,
    email: String,
    password: String,
});

export const User = mongoose.model('User', userSchema);

const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    amount: Number,
    type: String,
    time: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
