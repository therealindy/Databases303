import { useEffect, useState } from 'react';

//หน้านี้มีหน้าที่เป็นคอมโพเนนต์ React ที่ทำหน้าที่แสดงข้อความแจ้งเตือน (flash message) โดยจะแสดงข้อความ success หรือ error เป็นเวลา 3 วินาทีแล้วซ่อนข้อความ

const FlashMessage = ({ flash }) => {
    // สร้าง state สำหรับ visible โดยเริ่มต้นเป็น true ถ้ามีข้อความ success หรือ error
    const [visible, setVisible] = useState(!!flash.success || !!flash.error);
    useEffect(() => {
        if (flash.success || flash.error) {
            setVisible(true);  // ถ้าerror ให้ตั้งค่า visible เป็น true

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
