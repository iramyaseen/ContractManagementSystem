import contractModel from "../models/Contract.js";
import userModal from "../models/User.js";


const createContract = async (req, res) => {
    const { project_name, duration, budget, started_date, end_date } = req.body;
    const { user_id } = req.params;
    const userExist = await userModal.findById(user_id);

    if (!userExist) {
        res.status(404).json("User Not Found");
    }

    if (project_name, duration, budget, started_date, end_date) {
        try {
            const createNewContract = new contractModel({
                project_name,
                duration,
                budget,
                started_date,
                end_date,
                user_id: userExist._id
            });
            const newContract = await createNewContract.save();
            res.status(201).json({ contract: newContract, status: "successful" });

        } catch (error) {
            res.status(500).json({ message: "Internal server error! try later" });
        }
    } else {
        res.status(400).json({ message: "Invalid data, missing required fields" });
    }
}

const updateContractStatus = async (req, res) => {
    const { status } = req.body;
    const { contract_id, user_id } = req.params;

    if (status && contract_id && user_id) {
        const userExist = await userModal.findById(user_id);

        if (!userExist) {
            res.status(404).json("User Not Found");
        }

        try {
            const findContract = await contractModel.findById(contract_id);
            if (findContract) {
                if ((findContract.user_id.toString() === userExist._id.toString()) || userExist.role === "admin") {
                    if (['completed', 'incomplete'].includes(status)) {

                        findContract.status = status;
                        const updatedContract = await findContract.save();
                        res.status(200).json({ contract: updatedContract, status: "successful" });

                    } else {
                        res.status(400).json({ message: "Invalid status" });
                    }
                } else {
                    res.status(401).json("Unauthorized Access");
                }

            } else {
                res.status(400).json({ message: "Invalid id, contract not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error! try later" });
        }
    } else {
        res.status(400).json({ message: "Invalid data, missing required fields" });
    }

}

const updateContract = async (req, res) => {
    const { project_name, duration, budget, started_date, end_date } = req.body;
    const { contract_id, user_id } = req.params;

    if (contract_id && user_id) {
        const userExist = await userModal.findById(user_id);

        if (!userExist) {
            res.status(404).json("User Not Found");
        }

        if (project_name || duration || budget || started_date || end_date) {
            try {
                const findContract = await contractModel.findById(contract_id);

                if (findContract) {
                    if ((findContract.user_id.toString() === userExist._id.toString()) || userExist.role === "admin") {

                        if (project_name) findContract.project_name = project_name;
                        if (duration) findContract.duration = duration;
                        if (budget) findContract.budget = budget;
                        if (started_date) findContract.started_date = started_date;
                        if (end_date) findContract.end_date = end_date;

                        const updatedContract = await findContract.save();
                        res.status(200).json({ contract: updatedContract, status: "successful" });

                    } else {
                        res.status(401).json("Unauthorized Access");
                    }
                } else {
                    res.status(404).json({ message: "Contract not found" });
                }
            } catch (error) {
                res.status(500).json({ message: "Internal server error! Try later" });
            }
        } else {
            res.status(400).json({ message: "No valid data provided for update" });
        }
    } else {
        res.status(400).json({ message: "url params missing, invalid request" });
    }
};

const deleteContract = async (req, res) => {
    const { contract_id, user_id } = req.params;

    if (contract_id && user_id) {

        const userExist = await userModal.findById(user_id);
        if (!userExist) {
            res.status(404).json("User Not Found");
        }

        try {
            const findContract = await contractModel.findByIdAndDelete(contract_id);
            res.status(200).json({ contract: findContract, message: "Contract deleted successfully", status: "successful" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error! Try later" });
        }


    } else {
        res.status(400).json({ message: "url params missing, invalid request" });
    }

};


const getAllContracts = async (req, res) => {
    try {
        const allContracts = await contractModel.find().populate({
            path: "user_id",
            model: "user",
            select: "name email avatar",
        });
        res.status(200).json({ contracts: allContracts, status: "successful" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error! Try later" });
    }
};


const getContractById = async (req, res) => {
    const { contract_id } = req.params;

    try {
        const findContract = await contractModel.findById(contract_id);
        if (findContract) {
            res.status(200).json({ contract: findContract, status: "successful" });
        } else {
            res.status(404).json({ message: "Contract not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error! Try later" });
    }
};


const getContractsByUserId = async (req, res) => {
    const { user_id } = req.params;
    if (user_id) {
        const ExitsUser = await userModal.findById(user_id);

        if (!ExitsUser) {
            res.status(404).json("User Not Found");
        }
        const contracts = await contractModel.find({ user_id }).populate({
            path: "user_id",
            model: "user",
            select: "name email avatar",
        });
        res.status(200).json({ contracts, status: "successful" });

    } else {
        res.status(400).json({ message: "url params missing, invalid request" });
    }
}

export {
    createContract,
    updateContractStatus,
    updateContract,
    deleteContract,
    getAllContracts,
    getContractById,
    getContractsByUserId,
};