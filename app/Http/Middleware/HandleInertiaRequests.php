<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

//หน้านี้มีหน้าที่เป็นตัวกลางในการส่งข้อมูลไปยังหน้าต่างๆ หลักๆจะมี
//1.กำหนด root template ที่จะถูกโหลดเมื่อมีการเยี่ยมชมหน้าแรก
//2.กำหนดเวอร์ชันของทรัพยา(asset)กรปัจจุบัน
//3.กำหนด props ที่จะถูกแชร์โดยค่าเริ่มต้น(default)
class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),  // เรียกใช้ method share จาก class แล้วรวมผลลัพธ์เข้ากับ props ที่กำหนดเอง

            'auth' => [
                'user' => $request->user(), // / ส่งข้อมูลผู้ใช้ที่ล็อกอินอยู่ในปัจจุบัน
            ],
            // ส่งข้อมูล flash ไปยังหน้าต่างๆ โดยใช้ session
            'flash' => [
                'success' => $request->session()->get('success') ?? null, // ส่งข้อมูล flash message ประเภท success
                'error' => $request->session()->get('error') ?? null, // ส่งข้อมูล flash message ประเภท error
            ],
        ];
    }
}
