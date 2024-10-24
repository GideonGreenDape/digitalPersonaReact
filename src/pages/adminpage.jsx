import account from "../assets/icons/account.svg";
import { Link } from "react-router-dom";
import Pb2 from "../components/Pb2";


function AdminPage() {
  return (
    <>
      <div className="flex h-100vh">
        <div className="flex flex-col h-screen items-center pt-[40px] w-[20%] bg-darkgreen ">
          <img
            className="w-[100px] self-start ml-[55px]  h-[100px] "
            src={account}
            alt="profile"
          />
          <p className="font-montserrat text-white self-start mt-[10px] ml-[49px] font-medium ">
            Administrator
          </p>
          <ul className="mt-[90px] self-start ml-[50px]">
            <Link>
              <li className=" font-montserrat font-bold text-white  mb-[17px]  ">
                Enrol FingerPrint
              </li>
            </Link>
            <Link>
              <li className=" font-montserrat text-mediumgray  mt-[17px] ">
                Attendance History
              </li>
            </Link>
            <Link>
              <li className=" font-montserrat text-mediumgray  mt-[17px] ">
                Registered Users
              </li>
            </Link>
          </ul>
        </div>
        <div className=" w-[65%]">
          <Pb2 />
        </div>
      </div>
    </>
  );
}

export default AdminPage;
