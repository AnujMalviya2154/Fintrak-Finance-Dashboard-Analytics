import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { 
    addIncome, 
    getAllIncomes, 
    updateIncome, 
    deleteIncome, 
    downloadIncomeExcel, 
    getIncomeOverview 
} from '../controllers/incomeController.js';

const incomeRouter = express.Router();

// Protected routes - all require authentication
incomeRouter.post('/add', authMiddleware, addIncome);
incomeRouter.get('/get', authMiddleware, getAllIncomes);

incomeRouter.put('/update/:id', authMiddleware, updateIncome);
incomeRouter.get('/downloadexcel', authMiddleware, downloadIncomeExcel);

incomeRouter.delete('/delete/:id', authMiddleware, deleteIncome);
incomeRouter.get('/overview', authMiddleware, getIncomeOverview);

export default incomeRouter;
