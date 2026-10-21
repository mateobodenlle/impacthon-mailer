// Envía emails a partir de un CSV de credenciales ya generado.
//
// Uso:
//   node src/send-emails.js data/credenciales.csv              (envía a todos)
//   node src/send-emails.js data/credenciales.csv --test email (envía solo a esa dirección como prueba)
//
// El CSV debe tener: Nombre,Email,Contraseña
//
// Cada envío correcto se apunta en <csv>.enviados.log: si el envío se corta, volver a
// lanzarlo continúa donde quedó y no repite correos.

const fs = require('fs');
const path = require('path');
const { transporter, emailConfig } = require('./config');
const { getEmailHTML, getEmailText } = require('./email-template');

function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const start = lines[0].toLowerCase().includes('nombre') ? 1 : 0;
    return lines.slice(start)
        .map(l => {
            const parts = l.split(',');
            if (!parts[1] || !parts[2]) return null;
            return {
                nombre: parts[0].trim(),
                email: parts[1].trim(),
                password: parts[2].trim()
            };
        })
        .filter(Boolean)
        .filter(p => p.password !== 'YA_REGISTRADO');
}

async function main() {
    const csvFile = process.argv[2];
    const testMode = process.argv[3] === '--test';
    const testEmail = process.argv[4];

    if (!csvFile) {
        console.log('Uso:');
        console.log('  node src/send-emails.js <credenciales.csv>');
        console.log('  node src/send-emails.js <credenciales.csv> --test <email>');
        process.exit(1);
    }

    const filePath = path.resolve(csvFile);
    const entries = parseCSV(filePath);
    console.log(`\n${entries.length} emails pendientes de enviar\n`);

    if (testMode) {
        if (!testEmail) {
            console.error('Falta el email de prueba: --test <email>');
            process.exit(1);
        }
        const sample = entries[0] || { nombre: 'Test', email: testEmail, password: 'ABC123xyz' };
        console.log(`Enviando email de prueba a ${testEmail}...`);
        await transporter.sendMail({
            from: `"${emailConfig.fromName}" <${emailConfig.fromAddress}>`,
            to: testEmail,
            subject: `[TEST] ${emailConfig.subject}`,
            html: getEmailHTML(sample.nombre, sample.email, sample.password),
            ...(getEmailText && { text: getEmailText(sample.nombre, sample.email, sample.password) })
        });
        console.log('✅ Email de prueba enviado');
        return;
    }

    const logFile = `${filePath}.enviados.log`;
    const alreadySent = new Set(
        fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf-8').split(/?
/).filter(Boolean) : []
    );
    const pending = entries.filter(e => !alreadySent.has(e.email));
    if (alreadySent.size) console.log(`${entries.length - pending.length} xa enviados antes (${path.basename(logFile)}): sáltanse
`);

    let ok = 0, fail = 0;

    for (let i = 0; i < pending.length; i++) {
        const { nombre, email, password } = pending[i];
        try {
            await transporter.sendMail({
                from: `"${emailConfig.fromName}" <${emailConfig.fromAddress}>`,
                to: email,
                subject: emailConfig.subject,
                html: getEmailHTML(nombre, email, password),
                ...(getEmailText && { text: getEmailText(nombre, email, password) })
            });
            fs.appendFileSync(logFile, email + '
');
            ok++;
            console.log(`[${i + 1}/${pending.length}] ✅ ${email}`);
            await new Promise(r => setTimeout(r, 500));
        } catch (err) {
            fail++;
            console.error(`[${i + 1}/${pending.length}] ❌ ${email}: ${err.message}`);
        }
    }

    console.log(`\n=== COMPLETADO: ${ok} enviados, ${fail} errores ===\n`);
}

main();
