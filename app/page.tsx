"use client"

import Image from "next/image";
import FooterSAU from "@/components/FooterSAU";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Page() {
  const router = useRouter();
  const [secureCode, setSecureCode] = useState<string>("");
  const handleAccessClick = () => {
    if (secureCode.toLowerCase() === "sauiot") {
      router.push("/showalltask");
    } else {
      Swal.fire({
        icon: "warning",
        title: "ผิดพลาด",
        text: "Secure Code ไม่ถูกต้อง",
      });
    }
  } 

  return (
    <>
      <div className="w-3/5 mt-10 p-10 shadow-xl mx-auto border border-gray-400 rounded-xl flex flex-col justify-center items-center">
      {/* แสดงรูปจาก internet */}
        <Image src={"https://cdn-icons-png.flaticon.com/128/762/762686.png"} alt="logo" width={150} height={150}/>
        {/* แสดงชื่อแอป */}
        <h1 className="mt-5 text-2xl font-bold text-gray-700">
          Manage Task App
          </h1>
          <h1 className="mt-3 text-lg text-gray-700">
          บริหารจัดการงานที่ทำ
          </h1>
          {/* ป้อน secure code สำหรับเข้าใช้งาน */}
          <input value={secureCode} onChange={(e)=>setSecureCode(e.target.value)} type="text" className="p-3 border border-gray-400 rounded mt-5 w-1/2" />
          {/* ปุ่มเข้าใช้งาน */}
          <button onClick={handleAccessClick} className="mt-5 w-1/2 bg-purple-800 py-3 text-white rounded hover:bg-purple-900 cursor-pointer">
            เข้าใช้งาน 
          </button>
      </div>
      {/* แสดง footer */}
      <FooterSAU/>
    </>
  );
}
