"use client";
import logoimg from "@/assets/task.png";
import Image from "next/image";
import Link from "next/link";
import FooterSAU from "@/components/FooterSAU";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import Swal from "sweetalert2";

{
  /* สร้าง interface ที่ล้อกับ columns ของตารางที่จะทำงานด้วย */
}
interface Task {
  id: string;
  created_at: string;
  title: string;
  detail: string;
  image_url: string;
  is_completed: boolean;
  updated_at: string;
}
export default function Page() {
  {/* สร้าง state สำหรับเก็บข้อมูลที่ดึงมาจากฐานข้อมูล */}
  const [tasks, setTasks] = useState<Task[]>([]);
  {/* สร้าง useEffect สำหรับดึงข้อมูลจากฐานข้อมูลเมื่อ component ถูก mount */}
  useEffect(() => {
    {/* ฟังก์ชันสำหรับดึงข้อมูลจากฐานข้อมูล */}
    const fetchTasks = async () => {
        //ดึงข้อมูล
        const { data, error } = await supabase.from("task_tb").select("*").order("created_at", { ascending: false });
        
        //ตรวจสอบ Error
        if (error) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "กรุณาลองใหม่อีกครั้ง",
          })
          return;
        } 
          //ถ้าไม่มี Error ให้เก็บข้อมูลที่ดึงมาไว้ใน state tasks
         if (data) {
          setTasks(data as Task[]);
         }
    };

    {/* เรียกใช้ฟังก์ชันดึงข้อมูล */}
    fetchTasks();
  }, []);
  return (
    <>
      <div className="w-3/5 mt-10 p-10 shadow-xl mx-auto border border-gray-400 rounded-xl flex flex-col justify-center items-center">
        {/* แสดงรูปจาก internet */}
        <Image src={logoimg} alt="logo" width={100} height={100} />
        {/* แสดงชื่อแอป */}
        <h1 className="mt-5 text-2xl font-bold text-gray-700">
          Manage Task App
        </h1>
        <h1 className="mt-3 text-lg text-gray-700">ข้อมูลงานทั้งหมด</h1>
        {/* แสดงปุ่มเพิ่มงาน */}
        <div className="w-full mt-5 flex justify-end">
          <Link href="/addtask">
            <button className="bg-purple-600 py-2 px-5 rounded text-white hover:bg-purple-800">
              เพิ่มงาน
            </button>{" "}
          </Link>
        </div>
        {/* แสดงตารางที่นำข้อมูลทั้งหมดจาก task_tb มาแสดง */}
        <table className="w-full bordor border-gry-500 mt-5">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-500 p-2">รูปงาน</th>
              <th className="border border-gray-500 p-2">งานที่ทำ</th>
              <th className="border border-gray-500 p-2">รายละเอียดงาน</th>
              <th className="border border-gray-500 p-2">สถานะ</th>
              <th className="border border-gray-500 p-2">วันที่เพิ่ม</th>
              <th className="border border-gray-500 p-2">วันที่แก้ไข</th>
              <th className="border border-gray-500 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((item) => (
                <tr key={item.id}>
              <td className="border border-gray-500 p-2">
                <Image src={item.image_url} alt={item.title} width={50} height={50} className="mx-auto" />
              </td>
              <td className="border border-gray-500 p-2 ">{item.title}</td>
              <td className="border border-gray-500 p-2">{item.detail}</td>
              <td className="border border-gray-500 p-2">{item.is_completed ? "เสร็จสิ้น" : "ยังไม่เสร็จ"}</td>
              <td className="border border-gray-500 p-2 text-center">{new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              <td className="border border-gray-500 p-2 text-center">{new Date(item.updated_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              <td className="border border-gray-500 p-2 text-center">แก้ไข | ลบ</td>
            </tr>
            ) )}
          </tbody>
        </table>
      </div>
      {/* FooterSAU */}
      <FooterSAU />
    </>
  );
}
