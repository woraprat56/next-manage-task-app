"use client";

import logoimg from "@/assets/task.png";
import FooterSAU from "@/components/FooterSAU";
import Link from "next/dist/client/link";
import Image from "next/image";
import { useState } from "react";
 
export default function Page() {
    // สร้าง state สำหรับเก็บข้อมูลของงานใหม่
    const [title, setTitle] = useState<string>("");
    const [detail, setDetail] = useState<string>("");
    const [imagefile, setImageFile] = useState<File | null>(null); // เก็บไฟล์รูปที่อัพโหลด
    const [imagepreview, setImagePreview] = useState<string | null>(null); // เก็บ URL สำหรับแสดงตัวอย่างรูปที่อัพโหลด
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    // ฟังก์ชันสำหรับจัดการเมื่อผู้ใช้เลือกไฟล์รูป
    const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // ดึงไฟล์ที่ผู้ใช้เลือก
        if (file) {
            setImageFile(file); // เก็บไฟล์ใน state
                setImagePreview(URL.createObjectURL(file)); // เก็บ URL สำหรับแสดงตัวอย่างรูป
            }
        }
    
  return (
    <>
      <div className="w-3/5 mt-10 p-10 shadow-xl mx-auto border border-gray-400 rounded-xl flex flex-col justify-center items-center">
        {/* แสดงรูปจาก internet */}
        <Image
          src={"https://cdn-icons-png.flaticon.com/128/762/762686.png"}
          alt="logo"
          width={150}
          height={150}
        />
        {/* แสดงชื่อแอป */}
        <h1 className="mt-5 text-2xl font-bold text-gray-700">
          Manage Task App
        </h1>
        <h1 className="mt-3 text-lg text-gray-700">เพิ่มงาน</h1>

        {/* ส่วนของการป้อนงาน และรายละเอียดงาน */}
        <div className="w-full flex flex-col mt-5 mb-10">
          <h1>ชื่องาน</h1>
          <input
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="p-2 border border-gray-700 rounded mt-2"
          />
          <h1>รายละเอียดงาน</h1>
          <textarea
            value={detail} onChange={(e) => setDetail(e.target.value)}
            className="p-2 border border-gray-700 rounded mt-2"
            rows={4}
          ></textarea>
        </div>

        {/* ส่วนเลือกรูป และแสดงรูป */}
        <div className="w-full flex flex-col mt-5">
          <h1>อัพโหลดรูป</h1>
          <input
            id="selectimage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSelectImage}
          />
          <label
            htmlFor="selectimage"
            className="bg-blue-500 text-white p-2 rounded cursor-pointer mt-2 w-30 text-center"
          >
            เลือกรูป
          </label>
          {/* แสดงรูปที่อัพโหลด */}
          {/* ตรวจสอบว่ามีรูปที่อัพโหลดหรือไม่จาก imagepreview */}
          {imagepreview && (
            <Image
              src={imagepreview}
              alt="Preview"
              width={200}
              height={200}
              className="mt-2"
            />
          )}
        </div>

        {/* ส่วนเลือกสถานะ */}
        <div className="w-full flex flex-col mt-5">
          <h1>สถานะงาน</h1>
          <select className="p-2 border border-gray-700 rounded mt-1 mb-2">
            <option value={1}>✅เสร็จสิ้น</option>
            <option value={0}>❌ยังไม่ได้เริ่ม</option>
          </select>
        </div>

        {/* ปุ่มบันทึก */}
        <button
          className="w-full px-4 py-2 bg-green-500 text-white 
                                    hover:bg-green-600 p-2 rounded text-center mt-5 cursor-pointer"
        >
          บันทึกงานใหม่
        </button>

        {/* ส่วนปุ่มกลับไปหน้า /showtasks */}
        <Link href={"/showtasks"} className="text-blue-500 mt-3">
          กลับไปหน้าแสดงงาน
        </Link>
      </div>
      <FooterSAU />
    </>
  );
}
