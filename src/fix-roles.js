// Cambia el rol de usuarios específicos.
//
// Uso: Edita el array ROLES de abajo y ejecuta:
//   node src/fix-roles.js

const { supabase } = require('./config');
const { getAllUsers } = require('./supabase-helpers');

// --- Editar aquí los cambios de rol ---
const ROLES = [
    // { email: 'ejemplo@email.com', nombre: 'Nombre Completo', rol: 'Jurado' },
    // Roles válidos: Asistente, Staff, Organizador, Jurado
];

(async () => {
    if (ROLES.length === 0) {
        console.log('No hay roles que cambiar. Edita el array ROLES en este archivo.');
        return;
    }

    const users = await getAllUsers();

    for (const config of ROLES) {
        const user = users.find(u => u.email.toLowerCase() === config.email.toLowerCase());
        if (!user) {
            console.error(`❌ No encontrado: ${config.email}`);
            continue;
        }

        const { error } = await supabase.from('profiles').upsert({
            id: user.id,
            full_name: config.nombre,
            role: config.rol
        });

        if (error) console.error(`❌ ${config.email}: ${error.message}`);
        else console.log(`✅ ${config.email} → ${config.rol}`);
    }
})();
