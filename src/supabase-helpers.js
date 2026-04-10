const { supabase } = require('./config');

// Lista TODOS los usuarios (con paginación completa)
async function getAllUsers() {
    let allUsers = [];
    let page = 1;
    while (true) {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) throw error;
        allUsers = allUsers.concat(data.users);
        if (data.users.length < 1000) break;
        page++;
    }
    return allUsers;
}

// Crea un usuario en Supabase Auth + actualiza perfil
async function createUser(nombre, email, password) {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: nombre }
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // Esperar al trigger que crea el perfil en blanco
    await new Promise(r => setTimeout(r, 1000));

    const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'Asistente', full_name: nombre })
        .eq('id', userId);

    if (profileError) {
        console.warn(`  ⚠️ Perfil no actualizado: ${profileError.message}`);
    }

    return userId;
}

module.exports = { getAllUsers, createUser };
