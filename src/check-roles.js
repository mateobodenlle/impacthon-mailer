// Lista todos los perfiles con sus roles.
//
// Uso: node src/check-roles.js

const { supabase } = require('./config');

(async () => {
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, contact_email')
        .order('role');

    if (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }

    console.log(`\nTotal: ${profiles.length} perfiles\n`);

    const byRole = {};
    profiles.forEach(p => {
        const role = p.role || 'Sin rol';
        if (!byRole[role]) byRole[role] = [];
        byRole[role].push(p);
    });

    Object.entries(byRole).forEach(([role, ps]) => {
        console.log(`\n=== ${role} (${ps.length}) ===`);
        ps.forEach(p => console.log(`  ${(p.full_name || '-').padEnd(30)} ${p.contact_email || ''}`));
    });
})();
