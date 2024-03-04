import express from "express";
import { createContract, deleteContract, getAllContracts, getContractById, getContractsByUserId, updateContract, updateContractStatus } from "../controllers/contractController.js";
const router = express.Router();


router.post('/create-contract/:user_id', createContract);
router.patch('/update-contract-status/:contract_id/:user_id', updateContractStatus);
router.patch('/update-contract/:contract_id/:user_id', updateContract);
router.delete('/delete-contract/:contract_id/:user_id', deleteContract);
router.get('/user-contracts/:user_id', getContractsByUserId);
router.get('/single-contract/:contract_id', getContractById);
router.get('/all-contracts', getAllContracts);





export default router;
