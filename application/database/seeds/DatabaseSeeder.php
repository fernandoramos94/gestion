<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => "Administrador",
            'email' => 'admin@ohlimpiacanarias.com',
            'password' => bcrypt('admin'),
            'rol' => 1,
        ]);

        DB::table('clients')->insert([
            ['name' => "RADISSON BLU MOGAN"], 
            ['name' => 'RADISSON BLU PATALAVACA'], 
            ['name' => 'RADISSON BLU REZIDOR'], 
            ['name'=> 'FACILITY SERVICES CANARIAS']
        ]);

        DB::table('categories')->insert([
            ['name' => "Camarer@ de Pisos"], 
            ['name' => "Valet"], 
            ['name' => 'Ayudante de Cocina'], 
            ['name' => 'Cociner@'], 
            ['name'=> 'Steward'],
            ['name'=> 'Ayudante de Camarero'],
            ['name'=> 'Camarer@'],
            ['name'=> 'Recepcionista'],
            ['name'=> 'Limpiador/a']
        ]);

        DB::table('client_categorie')->insert([
            [ 'id_categorie'=> 1, 'id_client'=> 1],
            [ 'id_categorie'=> 2, 'id_client'=> 1],
            [ 'id_categorie'=> 3, 'id_client'=> 1],
            [ 'id_categorie'=> 4, 'id_client'=> 1],
            [ 'id_categorie'=> 5, 'id_client'=> 1],
            [ 'id_categorie'=> 6, 'id_client'=> 1],
            [ 'id_categorie'=> 7, 'id_client'=> 1],
            [ 'id_categorie'=> 8, 'id_client'=> 1],
            [ 'id_categorie'=> 1, 'id_client'=> 2],
            [ 'id_categorie'=> 2, 'id_client'=> 2],
            [ 'id_categorie'=> 3, 'id_client'=> 2],
            [ 'id_categorie'=> 4, 'id_client'=> 2],
            [ 'id_categorie'=> 5, 'id_client'=> 2],
            [ 'id_categorie'=> 6, 'id_client'=> 2],
            [ 'id_categorie'=> 7, 'id_client'=> 2],
            [ 'id_categorie'=> 8, 'id_client'=> 2],
            [ 'id_categorie'=> 1, 'id_client'=> 3],
            [ 'id_categorie'=> 2, 'id_client'=> 3],
            [ 'id_categorie'=> 3, 'id_client'=> 3],
            [ 'id_categorie'=> 4, 'id_client'=> 3],
            [ 'id_categorie'=> 5, 'id_client'=> 3],
            [ 'id_categorie'=> 6, 'id_client'=> 3],
            [ 'id_categorie'=> 7, 'id_client'=> 3],
            [ 'id_categorie'=> 8, 'id_client'=> 3],
            [ 'id_categorie'=> 9, 'id_client'=> 4]
        ]);
    }
}
