import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: [300, 'Description cannot exceed 300 characters']
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount cannot be negative']
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    type: {
        type: String,
        default: "expense",
    },
}, {
    timestamps: true
});

// Every query filters by userId and sorts by date — index it or it's a collection scan.
expenseSchema.index({ userId: 1, date: -1 });

const expenseModel = mongoose.models.expense || mongoose.model('expense', expenseSchema);
export default expenseModel;
