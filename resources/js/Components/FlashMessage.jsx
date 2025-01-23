import { useEffect, useState } from 'react';

//หน้านี้มีหน้าที่เป็นคอมโพเนนต์ React ที่ทำหน้าที่แสดงข้อความแจ้งเตือน (flash message) โดยจะแสดงข้อความ success หรือ error เป็นเวลา 3 วินาทีแล้วซ่อนข้อความ

const FlashMessage = ({ flash }) => {
    // ใช้ useState เพื่อสร้าง state ชื่อ visible และฟังก์ชัน setVisible สำหรับเปลี่ยนแปลงสถานะนั้นค่าเริ่มต้นของ visible จะเป็น true
    // ถ้ามีค่า flash.success หรือ flash.error (ใช้ !! เพื่อแปลงค่าเป็น boolean)
    //ใช้ useEffect เพื่อทำงานเมื่อคอมโพเนนต์ถูกเรนเดอร์ใหม่หรือเมื่อค่า flash.success หรือ flash.error เปลี่ยนแปลง
    // ถ้าerror ให้ตั้งค่า visible เป็น true
    const [visible, setVisible] = useState(!!flash.success || !!flash.error);
    useEffect(() => {
        if (flash.success || flash.error) {
            setVisible(true);

            const timer = setTimeout(() => { // ตั้งเวลา 3 วินาทีเพื่อซ่อนข้อความ
                setVisible(false);
            }, 3000);

            return () => clearTimeout(timer);  // หลังจากที่ set visible ให้คืนค่า timer
        }
    }, [flash]);

    if (!visible) return null; // ถ้า visible เป็น false ไม่ต้องแสดงผลอะไร
    return (  // แสดงข้อความ flash
        <div
            className={`${flash.success
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'} md-4 rounded border p-4`}
        >
            <p>{flash.success || flash.error}</p>
        </div>
    );
};
export default FlashMessage; // ส่งออกคอมโพเนนต์ FlashMessage
