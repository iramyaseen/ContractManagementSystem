import "../App.css";
import { FaBars } from "react-icons/fa6";
import Stack from "react-bootstrap/Stack";
import { MdOutlineDashboard } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { GrUpdate } from "react-icons/gr";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useState } from "react";
import Dashboard from "../components/Dashbord";
import Add from "../components/Add";
import Update from "../components/Update";
import Delete from "../components/Delete";
import AboutUs from "../components/About";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import axiosInstance from '../../axiosConfig';
import { logout } from "../redux/userSlice";


function Dashbaord() {
  const dispatch = useAppDispatch();
  const [currentView, setCurrentView] = useState("dashboard");
  const auth_user = useAppSelector((state) => state.userAuth.data)
  const baseUrl = axiosInstance.defaults.baseURL;
  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "add":
        return <Add />;
      case "update":
        return <Update />;
      case "delete":
        return <Delete />;
      case "about":
        return <AboutUs />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* <h1 className="mb-4 heading">Contract Management System</h1> */}

      <div className="dashboard-header bg-dark">
        <div className="d-flex align-items-center justify-content-between management-box">
          <div className="d-flex align-items-center justify-content-between white-text">
            {" "}
            <FaBars />
            <h5 className="m-0">Contract Management System</h5>
          </div>
          <div className="d-flex align-items-center justify-content-between white-text">

            <p className="m-0">{auth_user?.user?.name}</p>
            <img className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" src={`${baseUrl}/${auth_user?.user?.avatar}`} alt="user" width={50} />
            <ul className="dropdown-menu bg-dark">
              <li><span onClick={() => dispatch(logout())} title="Logout" style={{ cursor: 'pointer' }} className=" dropdown-item white-text me-2">
                <strong> Logout </strong>
              </span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="dashboard-box">
        <Stack direction="horizontal" gap={2} className="align-items-start stack_container">
          <div className="p-2 side-bar-menu bg-dark white-text">
            <ul className="p-0">
              <li onClick={() => setCurrentView("dashboard")}>
                <MdOutlineDashboard />
                <p className="m-0">Dashboard</p>
              </li>
              <li onClick={() => setCurrentView("add")}>
                <IoAddCircleOutline />
                <p className="m-0 pt-1 cursor-pointer">Add</p>
              </li>
              <li onClick={() => setCurrentView("update")}>
                <GrUpdate />
                <p className="m-0 pt-1 ">Update</p>
              </li>
              <li onClick={() => setCurrentView("delete")}>
                <RiDeleteBin5Fill />
                <p className="m-0 pt-1 ">Delete</p>
              </li>
              <li onClick={() => setCurrentView("about")}>
                <IoInformationCircleOutline />
                <p className="m-0 pt-1 ">About Us</p>
              </li>
            </ul>
          </div>
          <div className="p-2 dashboard-menu">
            <div className="main-content">{renderView()}</div>

            {/* <div>
              <p className="m-0 text-danger">Contracts</p>
              <div>
                <input type="text" placeholder="Search..." />
                <IoMdSearch />
              </div>
            </div> */}
          </div>
        </Stack>
      </div>
    </>
  );
}

export default Dashbaord;