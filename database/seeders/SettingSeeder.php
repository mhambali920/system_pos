<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('settings')->insert([
            [
                'name' => 'store_name',
                'value' => 'Minimarket POS',
                'description' => 'Nama toko',
                'type' => 'string',
            ],
            [
                'name' => 'currency',
                'value' => 'IDR',
                'description' => 'Mata uang',
                'type' => 'string',
            ],
            [
                'name' => 'tax_rate',
                'value' => '0',
                'description' => 'Tarif pajak (%)',
                'type' => 'number',
            ],
            [
                'name' => 'receipt_footer',
                'value' => 'Terima kasih atas kunjungan Anda!',
                'description' => 'Footer struk',
                'type' => 'string',
            ],
            [
                'name' => 'auto_print_receipt',
                'value' => 'true',
                'description' => 'Cetak struk otomatis',
                'type' => 'boolean',
            ],
            [
                'name' => 'low_stock_alert',
                'value' => '10',
                'description' => 'Alert stok rendah',
                'type' => 'number',
            ],
        ]);
    }
}
