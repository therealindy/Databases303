<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Controller;

//หน้าที่หน้านี้คิดว่าจะเป็นหน้าที่จะเรียกใช้ข้อมูลจากตาราง employees
class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $query = $request->input('search', '');  //หาข้อตวามได้ทั้งชื่อและนามสกุล

        //ค้นหาข้อมูลจากตาราง employees โดยใช้คำสั่ง SQL
        $employees = DB::table('employees')
        ->where('first_name', 'like', '%'.$query.'%')
        ->orWhere('last_name', 'like', '%'.$query.'%')
        ->orderBy('emp_no', 'desc')
        ->paginate(20);

        //Log::info($employees);

        //ส่งข้อมูลไปที่หน้า Index ในรูปแบบของ JSON
        return Inertia::render('Employee/Index',[
            'employees' => $employees,
            'query' => $query,

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //select departments จากตาราง departments
        $departments = DB::table('departments')->select('dept_no', 'dept_name')->get();

        //Inertia จะส่งข้อมูล derpartments ไปที่หน้า Create ในรูปแบบของ JSON
        return Inertia::render('Employee/Create',[
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //คือการเขียนข้อมูลลงใน log แล้วแสดงข้อมูลที่รับมาจากฟอร์ม
        Log::info($request->all());


        //ตรวจสอบข้อมูลที่รับมาจากฟอร์ม ว่าตรงตามเงื่อนไขหรือไม่
        $validated = $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'gender' => 'required|in:M,F',
            'birth_date' => 'required|date',
            'hire_date' => 'date',
            'dept_no' => 'required',
            'img'   => 'nullable|image|mimes:jpg,png,jpeg,gif,svg|max:2048', // เพิ่มการตรวจสอบ img

        ]);

        try {
        DB::transaction(function() use ($validated){
            //หาค่า emp_no ล่าสุด
            $latestEmpNo = DB::table('employees')->max('emp_no')?? 0;//ถ้าไม่มีข้อมูลให้เป็น 0
            $newEmpNo = $latestEmpNo + 1; //ค่าล่าสุด + 1

            //ฝากข้อมูลลงใน log แล้วแสดงค่า emp_no ที่ได้
            Log::info($newEmpNo);

            $img = null; //กำหนดค่าเริ่มต้นให้ $img เป็น null

            if(request()->hasFile('img')){ //ตรวจสอบว่ามีไฟล์ img หรือไม่
                $file = request()->file('img'); // ดึงข้อมูลไฟล์ img มาเก็บไว้ในตัวแปร $file
                $extention = $file->getClientOriginalExtension(); //ดึงนามสกุลไฟล์มาเก็บไว้ในตัวแปร $extention
                $filename = $newEmpNo.'.'.$extention; //สร้างชื่อไฟล์ใหม่โดยใช้ค่า emp_no และนามสกุลไฟล์
                $path = 'img/employee/'; //กำหนด path ที่จะบันทึกไฟล์
                $file->move(public_path($path), $filename); //ย้ายไฟล์ไปยัง path ไปเก็บไว้ในโฟลเดอร์ public/img/employee
                $img = $path.$filename; //กำหนดค่าให้กับ $img
            }

            //บันทึกข้อมูลลงในตาราง employees
            DB::table('employees')->insert([
                'emp_no' => $newEmpNo,
                'birth_date' => $validated['birth_date'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'gender' => $validated['gender'],
                'hire_date' => $validated['hire_date'] ?? now(),
                'img' => $img,
            ]);

            //บันทึกข้อมูลลงในตาราง dept_emp
            DB::table('dept_emp')->insert([
                'emp_no' => $newEmpNo,
                'dept_no' => $validated['dept_no'],
                'from_date' => now(),
                'to_date' => '9999-01-01',
            ]);


        });

            return redirect()->route('employee.index')
                ->with('success', 'Employee created successfully.');  //ส่งข้อความไปที่หน้า Index ว่าบันทึกข้อมูลสำเร็จ
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create employee. Please try again.'); //ถ้ามีข้อผิดพลาดจะส่งข้อความไปที่หน้า Create
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
