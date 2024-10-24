import testaccount from "../assets/icons/testaccount.svg";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col mt-[100px] items-center">
        <p className="text-[26px] w-[700px] text-center font-bold font-montserrat text-darkgreen">
          Welcome to Our Biometric FingerPrint Attendance System Portal
        </p>
        <p className="mt-[25px] text-[14px] text-center font-montserrat w-[650px] ">
          Your identity matters, and we're here to make it safer and easier for
          you. Use our fast, secure, and reliable system to capture your
          fingerprint effortlessly.
        </p>
      </div>
      <div className="flex gap-[15px] mt-[60px]  ">
            <div className="flex flex-col gap-[25px] border-[2px] border-gray p-[60px] rounded ">
              <div className="flex flex-col item-center">
              <img className="w-[100px]  h-[100px] " src={testaccount} alt="profile" />
              <p className="font-montserrat">Administrator</p>
               </div>
               <Link to={`/admin`} ><p className="font-montserrat text-white text-center bg-green py-[6px] rounded-md " >Login</p></Link>
            </div>
            <div className="flex flex-col gap-[25px] border-[2px] border-gray p-[60px] rounded ">
              <div className="flex flex-col item-center">
              <img className="w-[100px]  h-[100px] " src={testaccount} alt="profile" />
             <p className="font-montserrat ml-[34px]">User</p>
               </div>
               <Link to={`/user`} ><p className="font-montserrat text-white text-center bg-green py-[6px] rounded-md " >Login</p></Link>
            </div>
      </div>
    </div>
  );
}


export default HomePage