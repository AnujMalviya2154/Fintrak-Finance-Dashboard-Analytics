import incomeModel from "../models/incomeModel.js";
import XLSX from 'xlsx';
import getDateRange from "../utils/dateFilter.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { isNonEmptyString, parseAmount, parseDate, parsePagination } from "../utils/validators.js";

const RECENT_LIMIT = 5;

// ADD INCOME
export const addIncome = asyncHandler(async (req, res) => {
    const { description, category } = req.body;
    const amount = parseAmount(req.body.amount);
    const date = parseDate(req.body.date);

    if (!isNonEmptyString(description) || !isNonEmptyString(category) || amount === null || date === null) {
        throw new AppError(
            'All fields are required (amount must be a positive number, date must be valid)',
            400
        );
    }

    const income = await incomeModel.create({
        userId: req.user._id,
        description: description.trim(),
        amount,
        category: category.trim(),
        date,
    });

    res.status(201).json({ success: true, data: income, message: 'Income added successfully' });
});

// GET ALL INCOMES (paginated)
export const getAllIncomes = asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { userId: req.user._id };

    const [items, total] = await Promise.all([
        incomeModel.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
        incomeModel.countDocuments(filter),
    ]);

    res.json({
        success: true,
        data: items,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
});

// UPDATE AN INCOME (owner-scoped; supports all editable fields)
export const updateIncome = asyncHandler(async (req, res) => {
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

    const income = await incomeModel.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id }, // owner scope prevents editing others' data
        updates,
        { new: true, runValidators: true }
    );
    if (!income) throw new AppError('Income not found', 404);

    res.json({ success: true, message: 'Income updated successfully', data: income });
});

// DELETE AN INCOME (owner-scoped — fixes the previous IDOR)
export const deleteIncome = asyncHandler(async (req, res) => {
    const income = await incomeModel.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!income) throw new AppError('Income not found', 404);

    res.json({ success: true, message: 'Income deleted successfully' });
});

// DOWNLOAD INCOMES AS EXCEL (streamed from memory — no shared file on disk)
export const downloadIncomeExcel = asyncHandler(async (req, res) => {
    const incomes = await incomeModel.find({ userId: req.user._id }).sort({ date: -1 });

    const rows = incomes.map((inc) => ({
        Description: inc.description,
        Amount: inc.amount,
        Category: inc.category,
        Date: new Date(inc.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Incomes');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="income_details.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
});

// INCOME OVERVIEW (totals for a date range)
export const getIncomeOverview = asyncHandler(async (req, res) => {
    const { range = 'monthly' } = req.query;
    const { start, end } = getDateRange(range);

    const incomes = await incomeModel
        .find({ userId: req.user._id, date: { $gte: start, $lte: end } })
        .sort({ date: -1 });

    const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
    const numberOfTransactions = incomes.length;
    const averageIncome = numberOfTransactions > 0 ? totalIncome / numberOfTransactions : 0;

    res.json({
        success: true,
        data: {
            totalIncome,
            averageIncome,
            numberOfTransactions,
            recentTransactions: incomes.slice(0, RECENT_LIMIT),
            range,
        },
    });
});
