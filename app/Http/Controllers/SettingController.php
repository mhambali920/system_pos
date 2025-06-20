<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $settings = Setting::all();
        return Inertia::render('app-settings/index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validasi Data untuk Penambahan
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:settings,name', // Pastikan nama unik
            'value' => 'nullable|string|max:255',
            'type' => 'required|string|in:string,number,boolean,json,array,object', // Validasi tipe yang diizinkan
            'description' => 'nullable|string|max:255',
        ]);

        // 2. Buat Pengaturan Baru
        Setting::create($validatedData);

        // 3. Redirect kembali dengan pesan sukses
        return redirect()->back()->with('message', 'Setting added successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Setting $setting)
    {
        // 1. Validasi Data untuk Update
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:settings,name,' . $setting->id, // Unik kecuali untuk dirinya sendiri
            'value' => 'nullable|string|max:255',
            'type' => 'required|string|in:string,number,boolean,json,array,object',
            'description' => 'nullable|string|max:255',
        ]);

        // 2. Update Data
        $setting->update($validatedData);

        // 3. Redirect kembali dengan pesan sukses
        return redirect()->back()->with('message', 'Setting updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Setting $setting)
    {
        try {
            $setting->delete();
            return redirect()->back()->with('message', 'Setting deleted successfully!');
        } catch (\Exception $e) {
            // Tangani error jika gagal menghapus (misal: foreign key constraint)
            return redirect()->back()->withErrors(['delete' => 'Failed to delete setting. It might be in use elsewhere.'])->with('error', 'Failed to delete setting.');
        }
    }
}
