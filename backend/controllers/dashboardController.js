import incomeModel from "../models/incomeModel.js";
import expenseModel from "../models/expenseModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const RECENT_LIMIT = 10;

export const getDashboardOverview = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const dateFilter = { userId, date: { $gte: startOfMonth, $lte: now } };

    // Run both reads in parallel — they don't depend on each other.
    const [incomes, expenses] = await Promise.all([
        incomeModel.find(dateFilter).lean(),
        expenseModel.find(dateFilter).lean(),
    ]);

    const monthlyIncome = incomes.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
    const monthlyExpense = expenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
    const savings = monthlyIncome - monthlyExpense;
    const savingsRate = monthlyIncome === 0 ? 0 : Math.round((savings / monthlyIncome) * 100);

    const recentTransactions = [
        ...incomes.map((i) => ({ ...i, type: "income" })),
        ...expenses.map((e) => ({ ...e, type: "expense" })),
    ]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, RECENT_LIMIT);

    const spendByCategory = {};
    for (const exp of expenses) {
        const cat = exp.category || "Other";
        spendByCategory[cat] = (spendByCategory[cat] || 0) + Number(exp.amount || 0);
    }

    const expenseDistribution = Object.entries(spendByCategory).map(([category, amount]) => ({
        category,
        amount,
        percent: monthlyExpense === 0 ? 0 : Math.round((amount / monthlyExpense) * 100),
    }));

    res.status(200).json({
        success: true,
        data: {
            monthlyIncome,
            monthlyExpense,
            savings,
            savingsRate,
            recentTransactions,
            expenseDistribution,
        },
    });
});
