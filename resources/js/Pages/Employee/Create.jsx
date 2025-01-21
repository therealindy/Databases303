import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FlashMessage from '@/Components/FlashMessage';
import { usePage } from '@inertiajs/react';

const CreateEmployee = ({ departments }) => {
    // ใช้ useForm เพื่อจัดการฟอร์มและสถานะของฟอร์ม
    const { data, setData, post, errors } = useForm({
        first_name: '',
        last_name: '',
        gender: '',
        birth_date: '',
        hire_date: '',
        departments: '',
        img: '',
    });

    // ฟังก์ชันสำหรับจัดการการส่งฟอร์ม
    const handleSubmit = (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้า
        post(route('employee.store')); // ส่งข้อมูลฟอร์มไปยังเส้นทาง 'employee.store'
    };

    const { flash } = usePage().props; // ดึงข้อมูล flash message จาก props

    //การเพิ่มรูปคือเข้าไปในemployeec แล้วใช้คำสั่ง alter table employees add img varchar(2000); เพื่อเพิ่ม column ในการเก็บ URL
    // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงไฟล์
    const handFileChange = (e) => {
        const file = e.target.files[0]; // ดึงไฟล์ที่เลือก
        if (file) {
            const path = URL.createObjectURL(file); // สร้าง URL ของไฟล์
            data.img = path; // เก็บ URL ของไฟล์ใน data.img
        }
    };

    return (
        <>
            <AuthenticatedLayout>
                <FlashMessage flash={flash} /> {/* แสดง flash message ถ้ามี */}
                <div className="flex items-center justify-between mb-4 py-12">
                    <div className="p-6 border border-gray-300 rounded-md shadow-lg bg-white max-w-md mx-auto ">
                        <div className="text-center">
                            <label className="font-bold">Create</label>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mt-4">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={data.first_name} // กำหนดค่าเริ่มต้นของ input จาก state data.first_name
                                    onChange={(e) => setData('first_name', e.target.value)} // อัปเดตค่า data.first_name เมื่อมีการเปลี่ยนแปลงใน input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.first_name && <div className="text-red-500 text-sm">{errors.first_name}</div>} {/* แสดงข้อความ error ถ้าไม่กรอก */}
                            </div>
                            <div className="py-2">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.last_name && <div className="text-red-500 text-sm">{errors.last_name}</div>}
                            </div>
                            <div className="py-2">
                                <label>Gender</label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                                {errors.gender && <div className="text-red-500 text-sm">{errors.gender}</div>}
                            </div>
                            <div className="py-2">
                                <label>Birth Date</label>
                                <input
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.birth_date && <div className="text-red-500 text-sm">{errors.birth_date}</div>}
                            </div>
                            <div className="py-2">
                                <label>Hire Date</label>
                                <input
                                    type="date"
                                    value={data.hire_date}
                                    onChange={(e) => setData('hire_date', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.hire_date && <div className="text-red-500 text-sm">{errors.hire_date}</div>}
                            </div>
                            <div className="py-2">
                                <label>Department</label>
                                <select
                                    value={data.dept_no}
                                    onChange={(e) => setData('dept_no', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((department) => (
                                        <option key={department.dept_no} value={department.dept_no}>
                                            {department.dept_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.departments && <div className="text-red-500 text-sm">{errors.departments}</div>}
                            </div>
                            <div className="py-2">
                                <label>Picture</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handFileChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.img && <div className="text-red-500 text-sm">{errors.img}</div>}
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline py-2 px-4 mt-4"
                            >
                                Create Employee
                            </button>
                        </form>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
};

export default CreateEmployee;
