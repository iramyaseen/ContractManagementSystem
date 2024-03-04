import React from "react";
import { Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { RiDeleteBin6Line } from "react-icons/ri";
import moment from "moment";
import instance from "../../axiosConfig";
import { deleteContract } from "../redux/contractSlice";


const Delete: React.FC = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state?.contract?.data);
  const userId = useAppSelector((state) => state?.userAuth?.data?.user?._id);

  const onDeleteContract = async (contractId: string) => {
    try {
      const response = await instance.delete(`/api/contract/delete-contract/${contractId}/${userId}`)
      if (response.status == 200) {
        dispatch(deleteContract(response.data.contract))
      }
    } catch (error) {
      console.log("delete error-->", error)
    }
  }
  return (
    <div>
      <h2 className="mt-2">Delete Contracts</h2>
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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((item: any, index: any) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.project_name}</td>
              <td>{item?.duration}</td>
              <td>{item?.budget}</td>
              <td style={{ color: (item?.status == "incomplete") ? "red" : "green" }}>{item?.status}</td>
              <td>{moment(item?.started_date).format('DD-MM-YYYY')}</td>
              <td>{moment(item?.end_date).format('DD-MM-YYYY')}</td>
              <td>{item?.user_id?.name}</td>
              <td><RiDeleteBin6Line onClick={() => onDeleteContract(item?._id)} className="delete_icon" /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </div>
  );
};

export default Delete;
