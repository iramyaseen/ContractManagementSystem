import { createSlice } from "@reduxjs/toolkit";

export interface IUser {
    _id: string,
    name: string,
    email: string,
    avatar: string
}

export interface IContract {
    _id: string
    project_name: string;
    duration: string;
    budget: number;
    started_date: string;
    end_date: string;
    status?: string;
    user_id: IUser
}


export interface IContractSlice{
    data: IContract[]
}

export const contractSlice = createSlice({
    name: "contract",
    initialState: {
        data: [],
    } as IContractSlice,
    reducers:{
        setAllContracts: (state, action)=>{
            state.data = action.payload;
        },
        addNewContract: (state, action) => {
            state.data.push(action.payload);
        },
        updateContract: (state, action) => {
            const updatedContract = action.payload;
            state.data = state.data.map(contract => {
                if (contract._id === updatedContract._id) {
                    return updatedContract;
                }
                return contract;
            });
        },
        deleteContract: (state, action) => {
            state.data = state.data.filter(contract => contract._id !== action.payload._id);
        }
    }   
});





export const {setAllContracts, deleteContract, updateContract, addNewContract} = contractSlice.actions;
export default contractSlice.reducer;