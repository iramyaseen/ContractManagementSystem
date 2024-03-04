import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { FaRegEdit } from "react-icons/fa";
import moment from "moment";
import instance from "../../axiosConfig";
import { IContract, updateContract } from "../redux/contractSlice";
import UpdateContractPortal from "./Modal";

const Update: React.FC = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state?.contract?.data);
  const userId = useAppSelector((state) => state?.userAuth?.data?.user?._id);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editContract, setEditContract] = useState<IContract | null>(null);
  const onUpdateContract = async (contract: IContract) => {
    setEditContract(contract);
    setShowModal(true);
  }

  const onUpdateContractStatus = async (currStatus:string, contractId: string) => {
        try {
          if (currStatus == 'incomplete') {
            const response = await instance.patch(`/api/contract/update-contract-status/${contractId}/${userId}`, { status: "completed"})
                if (response.status == 200) {
                  dispatch(updateContract(response.data.contract))
                }

          }else{
            const response = await instance.patch(`/api/contract/update-contract-status/${contractId}/${userId}`, { status: "incomplete"})
            if (response.status == 200) {
              dispatch(updateContract(response.data.contract))
            }
          }
        } catch (error) {
            console.log("update error-->", error)
        }
  }
  return (
    <div>
    <h2 className="mt-2">Update Contracts</h2>
    <hr />
    <div className="table_wrapper">
    <Table className="dashboard_table mt-3 table-striped">
      <thead className="table-secondary">
        <tr>
          <th>#</th>
          <th>Project Name</th>
          <th>Duration</th>
          <th>Budget</th>
          <th>Status</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Contractor</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {data && data.map((item: any, index: any) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item?.project_name}</td>
            <td>{item?.duration}</td>
            <td>{item?.budget}</td>
            <td><span 
             style={{ color: "white",
                      padding: "2px 5px",
                      borderRadius: 5,
                      background:(item?.status == "incomplete") ? "red" : "green", 
                      cursor:"pointer"
                    }}
                    onClick={()=>onUpdateContractStatus(item?.status, item?._id)} 
            >{item?.status}</span></td>
            <td>{moment(item?.started_date).format('DD-MM-YYYY')}</td>
            <td>{moment(item?.end_date).format('DD-MM-YYYY')}</td>
            <td>{item?.user_id?.name}</td>
            <td><FaRegEdit  onClick={() => onUpdateContract(item)} className="delete_icon" /></td>
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
    {
      showModal && <UpdateContractPortal showModal={showModal} setShowModal={setShowModal} contract={editContract}></UpdateContractPortal>
    }
  </div>
  );
};

export default Update;
