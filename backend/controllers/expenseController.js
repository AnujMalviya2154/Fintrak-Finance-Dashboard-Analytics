import expenseModel from "../models/expenseModel.js";
import XLSX from 'xlsx';
import getDateRange from "../utils/dateFilter.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { isNonEmptyString, parseAmount, parseDate, parsePagination } from "../utils/validators.js";

const RECENT_LIMIT = 5;

// ADD EXPENSE
export const addExpense = asyncHandler(async (req, res) => {
    const { description, category } = req.body;
    const amount = parseAmount(req.body.amount);
    const date = parseDate(req.body.date);

    if (!isNonEmptyString(description) || !isNonEmptyString(category) || amount === null || date === null) {
        throw new AppError(
            'All fields are required (amount must be a positive number, date must be valid)',
            400
        );
    }

    const expense = await expenseModel.create({
        userId: req.user._id,
        description: description.trim(),
        amount,
        category: category.trim(),
        date,
    });

    res.status(201).json({ success: true, data: expense, message: 'Expense added successfully' });
});

// GET ALL EXPENSES (paginated)
export const getAllExpenses = asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { userId: req.user._id };

    const [items, total] = await Promise.all([
        expenseModel.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
        expenseModel.countDocuments(filter),
    ]);

    res.json({
        success: true,
        data: items,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
});

// UPDATE AN EXPENSE (owner-scoped; supports all editable fields)
export const updateExpense = asyncHandler(async (req, res) => {
    const updates = {};

    if (req.body.description !== undefined) {
        if (!isNonEmptyString(req.body.description)) throw new AppError('Description must be a non-empty string', 400);
        updates.description = req.body.description.trim();
    }
    if (req.body.category !== undefined) {
        if (!isNonEmptyString(req.body.category)) throw new AppError('Category must be a non-empty string', 400);
        updates.category = req.body.category.trim();
    }
    if (req.body.amount !== undefined) {
        const amount = parseAmount(req.body.amount);
        if (amount === null) throw new AppError('Amount must be a positive number', 400);
        updates.amount = amount;
    }
    if (req.body.date !== undefined) {
        const date = parseDate(req.body.date);
        if (date === null) throw new AppError('Date must be valid', 400);
        updates.date = date;
    }
    if (Object.keys(updates).length === 0) {
        throw new AppError('No valid fields to update', 400);
    }

    const expense = await expenseModel.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id }, // owner scope prevents editing others' data
        updates,
        { new: true, runValidators: true }
    );
    if (!expense) throw new AppError('Expense not found', 404);

    res.json({ success: true, message: 'Expense updated successfully', data: expense });
});

// DELETE AN EXPENSE (owner-scoped — fixes the previous IDOR)
export const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await expenseModel.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!expense) throw new AppError('Expense not found', 404);

    res.json({ success: true, message: 'Expense deleted successfully' });
});

// DOWNLOAD EXPENSES AS EXCEL (streamed from memory — no shared file on disk)
export const downloadExpenseExcel = asyncHandler(async (req, res) => {
    const expenses = await expenseModel.find({ userId: req.user._id }).sort({ date: -1 });

    const rows = expenses.map((exp) => ({
        Description: exp.description,
        Amount: exp.amount,
        Category: exp.category,
        Date: new Date(exp.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="expense_details.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
});

// EXPENSE OVERVIEW (totals for a date range)
export const getExpenseOverview = asyncHandler(async (req, res) => {
    const { range = 'monthly' } = req.query;
    const { start, end } = getDateRange(range);

    const expenses = await expenseModel
        .find({ userId: req.user._id, date: { $gte: start, $lte: end } })
        .sort({ date: -1 });

    const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
    const numberOfTransactions = expenses.length;
    const averageExpense = numberOfTransactions > 0 ? totalExpense / numberOfTransactions : 0;

    res.json({
        success: true,
        data: {
            totalExpense,
            averageExpense,
            numberOfTransactions,
            recentTransactions: expenses.slice(0, RECENT_LIMIT),
            range,
        },
    });
});
