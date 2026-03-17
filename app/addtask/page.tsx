"use client";
import Image from "next/image";
import logoimg from "@/assets/task.png";
import Link from "next/link";
import FooterSAU from "@/components/FooterSAU";
import { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
 
export default function Page() {
    const router = useRouter();
  // state
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
 
  // เลือกรูป
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
 
  // บันทึกงาน เพื่อส่งไปยังฐานข้อมูล
  const handleSaveClick = async() => {
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
 
    // อัพโหลดรูปไปยังที่เก็บไฟล์ (เช่น Supabase Storage) เพื่อให้ได้ URL ของรูปที่อัพโหลด
    let image_url = "";//ตัวแปรที่อยู่รูป
 
    //เปลี่ยนชื่อรูป
    const new_file_name = `${Date.now()}_${imageFile.name}`;
 
    //อัพโหลดรูปไปยัง Supabase Storage
    const {error} = await supabase.storage.from("task_bk").upload(new_file_name, imageFile);
 
    //ดึง URL ของรูปที่อัพโหลด
    const { data } = await supabase.storage.from("task_bk").getPublicUrl(new_file_name);
    image_url = data.publicUrl; //เก็บ URL ของรูปที่อัพโหลดไว้ในตัวแปร image_url
 
    if (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถอัพโหลดรูปภาพได้",
      });
      return;
    }
 
 
    //บันทึกข้อมูลงานใหม่ลงฐานข้อมูล โดยส่ง title, detail, image_url, is_completed ไปยัง backend API หรือ Supabase
    const {error: error2} = await supabase.from("task_tb").insert({
      title: title,
      detail: detail,
      image_url: image_url,
      is_completed: isCompleted
    });
 
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
    })
    router.push("/showalltask");
  };
 
  return (
    <>
      <div className="w-3/5 mt-10 p-10 shadow-xl mx-auto border border-gray-400 rounded-xl flex flex-col justify-center items-center">
        <Image src={logoimg} alt="logo" width={100} height={100} />
 
        <h1 className="mt-5 text-2xl font-bold text-gray-700">
          Manage Task App
        </h1>
        <h1 className="mt-3 text-lg text-gray-700">เพิ่มงาน</h1>
 
        {/* input */}
        <div className="w-full flex flex-col mt-5">
          <h1>ชื่องาน</h1>
          <input
            type="text"
            className="mt-1 p-2 border border-gray-400 rounded mb-2"
            placeholder="กรุณากรอกชื่องาน"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
 
          <h1>รายละเอียดงาน</h1>
          <textarea
            className="mt-1 p-2 border border-gray-400 rounded mb-2"
            placeholder="กรุณากรอกรายละเอียดงาน"
            rows={4}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </div>
 
        {/* upload */}
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
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded mt-1 mb-2 w-40 text-center cursor-pointer"
          >
            เลือกรูปภาพ
          </label>
 
          {/* preview */}
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="preview"
              width={200}
              height={200}
              className="rounded"
            />
          )}
        </div>
 
        {/* status */}
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
 
        {/* buttons */}
        <button onClick={handleSaveClick}
        className="w-full bg-green-500 py-2 px-4 rounded text-white hover:bg-green-600 mt-3">
          บันทึกงานใหม่
        </button>
 
        <Link
          href="/showalltask"
          className="w-full bg-purple-500 py-2 px-4 rounded text-white hover:bg-purple-600 mt-3 text-center cursor-pointer"
        >
          กลับไปหน้าข้อมูลทั้งหมด
        </Link>
      </div>
 
      <FooterSAU />
    </>
  );
}