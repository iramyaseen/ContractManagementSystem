import React, { useState, useEffect } from "react";
import FormData from "./Type";
import { BiSearch } from "react-icons/bi";
import instance from "../../axiosConfig";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { Table } from "react-bootstrap";
import moment from "moment";
import { setAllContracts } from "../redux/contractSlice";


const Dashboard: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [records, setRecords] = useState<FormData[]>([]);
  const dispatch = useAppDispatch();
  const { role, _id } = useAppSelector((state) => state?.userAuth?.data?.user);

  useEffect(() => {
    getContracts();
  }, []);
  const getContracts = async () => {
    try {
      const route = (role == "admin") ? "api/contract/all-contracts" : `/api/contract/user-contracts/${_id}`;
      const response = await instance.get(route)
      console.log("response", response.data.contracts)
      setRecords(response?.data?.contracts)
      dispatch(setAllContracts(response?.data?.contracts));
    } catch (error: any) {
      console.error(error.message);

    }
  }
  return (

    <div className="dashboard_container ">
      <div className="dashboard mt-2">
        <h2>Contracts</h2>
        <div className="input-search">
          <div>
            <input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="input-search-icon">
            <BiSearch />
          </div>
        </div>
      </div>
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
            </tr>
          </thead>
          <tbody>
            {records && records?.filter(item => item?.project_name?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()))
              ?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.project_name}</td>
                  <td>{item?.duration}</td>
                  <td>{item?.budget}</td>
                  <td style={{ color: (item?.status == "incomplete") ? "red" : "green" }}>{item?.status}</td>
                  <td>{moment(item?.started_date).format('DD-MM-YYYY')}</td>
                  <td>{moment(item?.end_date).format('DD-MM-YYYY')}</td>
                  <td>{item?.user_id?.name}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>

    </div>
  );
};

export default Dashboard;