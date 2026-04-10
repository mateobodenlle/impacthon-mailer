// Registro masivo: lee un Excel/CSV, cruza con Supabase, registra los nuevos y envía emails.
//
// Uso:
//   node src/register.js data/asistentes.xlsx
//   node src/register.js data/asistentes.xlsx --dry-run   (solo muestra quién se registraría)
//
// El Excel debe tener columnas: Nombre | Apellidos | Email (sin cabecera, una fila por persona)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const XLSX = require('xlsx');
const { transporter, emailConfig } = require('./config');
const { getAllUsers, createUser } = require('./supabase-helpers');
const { getEmailHTML } = require('./email-template');

function generatePassword() {
    return crypto.randomBytes(6).toString('base64url').slice(0, 10);
}

function readExcel(filePath) {
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json(ws, { header: 1 });
    return raw
        .filter(r => r[2] && r[2].toString().includes('@'))
        .map(r => ({
            nombre: (r[0] + ' ' + r[1]).trim(),
            email: r[2].toString().trim().toLowerCase()
        }));
}

function readCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    // Detectar si tiene cabecera
    const start = lines[0].toLowerCase().includes('nombre') ? 1 : 0;
    return lines.slice(start)
        .map(l => {
            const parts = l.split(',');
            if (!parts[1] || !parts[1].includes('@')) return null;
            return {
                nombre: parts[0].trim(),
                email: parts[1].trim().toLowerCase()
            };
        })
        .filter(Boolean);
}

async function main() {
    const inputFile = process.argv[2];
    const dryRun = process.argv.includes('--dry-run');

    if (!inputFile) {
        console.log('Uso: node src/register.js <archivo.xlsx|csv> [--dry-run]');
        process.exit(1);
    }

    const filePath = path.resolve(inputFile);
    if (!fs.existsSync(filePath)) {
        console.error(`Archivo no encontrado: ${filePath}`);
        process.exit(1);
    }

    // 1. Leer input
    const ext = path.extname(filePath).toLowerCase();
    const personas = (ext === '.csv') ? readCSV(filePath) : readExcel(filePath);
    console.log(`\nLeídos ${personas.length} registros de ${path.basename(filePath)}`);

    // 2. Obtener todos los usuarios de Supabase
    console.log('Consultando Supabase...');
    const existingUsers = await getAllUsers();
    const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));
    console.log(`${existingUsers.length} usuarios en Supabase\n`);

    // 3. Filtrar nuevos
    const nuevos = personas.filter(p => !existingEmails.has(p.email));
    const yaExisten = personas.length - nuevos.length;

    console.log(`Ya registrados: ${yaExisten}`);
    console.log(`Nuevos: ${nuevos.length}\n`);

    if (nuevos.length === 0) {
        console.log('No hay usuarios nuevos. Nada que hacer.');
        return;
    }

    if (dryRun) {
        console.log('=== DRY RUN (no se crea ni envía nada) ===\n');
        nuevos.forEach(p => console.log(`  🆕 ${p.nombre} — ${p.email}`));
        return;
    }

    // 4. Procesar nuevos
    const outputPath = path.join('data', `credenciales-${Date.now()}.csv`);
    fs.writeFileSync(outputPath, 'Nombre,Email,Contraseña\n');

    let ok = 0, fail = 0;

    for (const user of nuevos) {
        const password = generatePassword();
        console.log(`--- ${user.nombre} (${user.email}) ---`);

        // Registrar en Supabase
        try {
            const userId = await createUser(user.nombre, user.email, password);
            console.log(`  ✅ Creado (ID: ${userId})`);
        } catch (err) {
            console.error(`  ❌ Supabase: ${err.message}`);
            fail++;
            continue;
        }

        // Guardar en CSV
        fs.appendFileSync(outputPath, `${user.nombre},${user.email},${password}\n`);

        // Enviar email
        try {
            await transporter.sendMail({
                from: `"${emailConfig.fromName}" <${emailConfig.fromAddress}>`,
                to: user.email,
                subject: emailConfig.subject,
                html: getEmailHTML(user.nombre, user.email, password)
            });
            console.log(`  ✅ Email enviado`);
            ok++;
        } catch (err) {
            console.error(`  ❌ Email: ${err.message}`);
            fail++;
        }

        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n=== COMPLETADO: ${ok} OK, ${fail} errores ===`);
    console.log(`Credenciales guardadas en: ${outputPath}\n`);
}

main();
