"use client";
import Image from "next/image";
import logoimg from "@/assets/task.png";
import Link from "next/link";
import FooterSAU from "@/components/FooterSAU";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
 
export default function Page() {
  //ตัวแปรเก็บค่าที่ส่งมา ณ ที่นี้คือ id
  const router = useRouter();
  const params = useParams();
 
  //สร้าง state แบบ Task เพื่อเก็บข้อมูลที่ดึงมาจาก supabase
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
 
  //ดึงข้อมูลจาก supabase มาแสดงในฟอร์มตอนที่ Component นี้ Render โดยใช้ id ที่ได้จาก params
  useEffect(() => {
    //สร้างเป็นฟังก์ชันเพื่อดึงข้อมูล และกำหนดค่าที่ดึงมาให้กับ state ที่สร้างไว้ เพื่อแสดงในฟอร์ม
    const fetchTasks = async () => {
      //ดึงข้อมูลจาก supabase
      const { data, error: fetchError } = await supabase
        .from("task_tb")
        .select("*")
        .eq("id", params.id)
        .single();
 
      //ตรวจสอบ Error
      if (fetchError) {
        Swal.fire({
          icon: "warning",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถดึงข้อมูลได้",
        });
        return;
      }
      //กำหนดค่าที่ดึงมาให้กับ state ที่สร้างไว้ เพื่อแสดงในฟอร์ม
      setTitle(data.title);
      setDetail(data.detail);
      setIsCompleted(data.is_completed);
      setImagePreview(data.image_url);
    };
    //เรียกใช้ฟัง์ชันดึงข้อมูล
    fetchTasks();
  }, []);
 
  // เลือกรูป
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
 
  // บันทึกแก้ไขงาน เพื่อส่งไปยังฐานข้อมูล
  const handleUpdateClick = async () => {
    //Validate UI
    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณากรอกชื่องาน",
      });
      return;
    }
    if (!detail.trim()) {
      Swal.fire({
        icon: "warning",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณากรอกรายละเอียดงาน",
      });
      return;
    }
    if (!imageFile) {
      Swal.fire({
        icon: "warning",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาเลือกรูปภาพ",
      });
      return;
    }
 
    //บันทึกข้อมูลแก้ไขลงฐานข้อมูล
    if (imageFile) {
      //มีการแก้ไขรูป
      // อัพโหลดรูปไปยังที่เก็บไฟล์ (เช่น Supabase Storage) เพื่อให้ได้ URL ของรูปที่อัพโหลด
      // ตัดเอาเฉพาะชื่อรูป imgePreview ออกมาเพื่อใช้ในการลบรูปเก่า
      const old_image_name = imagePreview.split("/").pop() || "";
      //ลบรูปเก่าจากที่เก็บไฟล์ (เช่น Supabase Storage)
      const { error : errorDeleteImage }  = await supabase.storage
        .from("task_bk")
        .remove([old_image_name]);
      
      if (errorDeleteImage){
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถลบรูปภาพเก่าได้",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      let image_url = ""; //ตัวแปรที่อยู่รูป
 
      //เปลี่ยนชื่อรูป
      const new_file_name = `${Date.now()}_${imageFile.name}`; //เปลื่ยนชื่อรูป
 
      //อัพโหลดรูปไปยัง Supabase Storage
      const { error: error1 } = await supabase.storage
        .from("task_bk")
        .upload(new_file_name, imageFile);
 
      //ดึง URL ของรูปที่อัพโหลด
      const { data } = await supabase.storage
        .from("task_bk")
        .getPublicUrl(new_file_name);
      image_url = data.publicUrl; //เก็บ URL ของรูปที่อัพโหลดไว้ในตัวแปร image_url
 
      if (error1) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถอัพโหลดรูปภาพได้",
        });
        return;
      }
 
      //บันทึกข้อมูลงานใหม่ลงฐานข้อมูล โดยส่ง title, detail, image_url, is_completed ไปยัง backend API หรือ Supabase
      const { error: error2 } = await supabase.from("task_tb").update({
        title: title,
        detail: detail,
        image_url: image_url,
        is_completed: isCompleted,
      }).eq("id", params.id);
      if (error2) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถบันทึกข้อมูลงานได้",
        });
        return;
      }
 
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "บันทึกงานใหม่เรียบร้อยแล้ว",
      });
    } else {
      //ไม่มีการแก้ไขรูป
     
    }
    router.back();
  };
 
  return (
    <>
      <div className="w-3/5 mt-10 p-10 shadow-xl mx-auto border border-gray-400 rounded-xl flex flex-col justify-center items-center">
        {/* แสดงรูปจาก internet */}
        <Image src={logoimg} alt="logo" width={100} height={100} />
        {/* แสดงชื่อแอป */}
        <h1 className="mt-5 text-2xl font-bold text-gray-700">
          Manage Task App
        </h1>
        <h1 className="mt-3 text-lg text-gray-700">แก้ไขงาน</h1>
        {/* ส่วนของการป้อนงาน แสดงรายละเอียดงาน */}
        <div className="w-full flex flex-col mt-5">
          <h1>ชื่องาน</h1>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="mt-1 p-2 border border-gray-400 rounded mb-2"
            placeholder="กรุณากรอกชื่องาน"
          />
          <h1>รายละเอียดงาน</h1>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="mt-1 p-2 border border-gray-400 rounded mb-2"
            placeholder="กรุณากรอกรายละเอียดงาน"
            rows={4}
          ></textarea>
        </div>
        {/* ส่วนเลือกรูป และแสดงรูป */}
        <div className="w-full mt-5 flex flex-col">
          <h1>อัพโหลดรูป</h1>
          <input
            id="selectImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSelectImage}
          />
          <label
            htmlFor="selectImage"
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded mt-1 mb-2 w-30 text-center"
          >
            เลือกรูปภาพ
          </label>
          {/* แสดงรูปที่เลือกมา */}
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="preview"
              width={150}
              height={150}
              className="rounded"
            />
          )}
        </div>
        {/* ส่วนเลือกสถานะงาน */}
        <div className="w-full mt-5 flex flex-col">
          <h1>สถานะงาน</h1>
          <select
            className="mt-1 p-2 border border-gray-400 rounded mb-2"
            value={isCompleted == true ? "1" : "0"}
            onChange={(e) => setIsCompleted(e.target.value === "1")}
          >
            <option value="0">ยังไม่เสร็จ</option>
            <option value="1">เสร็จแล้ว</option>
          </select>
        </div>
        {/* ปุ่มบันทึกงาน */}
        <button
          onClick={handleUpdateClick}
          className="w-full bg-green-500 py-2 px-4 rounded text-white hover:bg-green-600 mt-3"
        >
          บันทึกแก้ไขงาน
        </button>
        {/* ปุ่มกลับไปหน้าข้อมูลทั้งหมด /showalltask */}
        <Link
          href="/showalltask"
          className="w-full bg-purple-500 py-2 px-4 rounded text-white hover:bg-purple-600 mt-3 text-center cursor-pointer"
        >
          กลับไปหน้าข้อมูลทั้งหมด
        </Link>
      </div>
      {/* Footer */}
      <FooterSAU />
    </>
  );
}
 