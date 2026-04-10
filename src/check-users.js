// Lista todos los usuarios de Supabase Auth con su fecha de creación.
//
// Uso: node src/check-users.js

const { getAllUsers } = require('./supabase-helpers');

(async () => {
    const users = await getAllUsers();
    users.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    console.log(`\nTotal: ${users.length} usuarios\n`);
    console.log('Email'.padEnd(45) + '| Nombre'.padEnd(32) + '| Creado');
    console.log('-'.repeat(110));

    users.forEach(u => {
        const name = (u.user_metadata?.full_name || '-').padEnd(30);
        const date = new Date(u.created_at).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
        console.log(u.email.padEnd(45) + '| ' + name + '| ' + date);
    });
})();
