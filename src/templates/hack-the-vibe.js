// Correo de credenciais do Hackathon ETSE (hack-the-vibe.osix.tech), en galego e coa paleta da landing.

const SITE = 'https://hack-the-vibe.osix.tech';
const NAVY = '#024289';
const SKY = '#3ABBC5';
const YELLOW = '#FCD83A';
const PAPER = '#FFFDF6';

const escape = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const firstName = (name) => String(name).trim().split(/\s+/)[0] || name;

function getEmailHTML(name, email, password) {
    const n = escape(firstName(name));
    const e = escape(email);
    const p = escape(password);
    return `<!DOCTYPE html>
<html lang="gl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>As túas credenciais do Hackathon ETSE</title>
</head>
<body style="margin: 0; padding: 32px 16px; background: ${PAPER}; font-family: Arial, Helvetica, sans-serif; color: ${NAVY};">
    <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 3px solid ${NAVY}; border-radius: 24px; box-shadow: 6px 6px 0 ${NAVY}; overflow: hidden;">
        <div style="background: ${SKY}; border-bottom: 3px solid ${NAVY}; padding: 24px 28px;">
            <div style="font-family: 'Courier New', monospace; font-size: 12px; font-weight: bold; letter-spacing: 1px;">■ XOVES 22 DE OUTUBRO · 12:00–20:00H · ETSE</div>
            <div style="font-size: 34px; font-weight: 800; line-height: 1.05; margin-top: 8px;">Hackathon <span style="font-family: Georgia, serif; font-style: italic; font-weight: normal; color: #ffffff;">ETSE</span></div>
        </div>

        <div style="padding: 28px;">
            <p style="font-size: 18px; line-height: 1.5; margin: 0 0 14px;">Ola ${n}!</p>
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Xa tes conta no portal do hackathon. Con ela formarás o teu equipo e, durante o evento, entregaredes o voso proxecto. Estas son as túas credenciais:
            </p>

            <table role="presentation" style="width: 100%; border-collapse: separate; border-spacing: 0; border: 2px solid ${NAVY}; border-radius: 16px; table-layout: fixed;">
                <tr>
                    <td style="padding: 14px 16px; border-bottom: 2px solid ${NAVY}; font-family: 'Courier New', monospace; font-size: 12px; font-weight: bold; width: 110px;">EMAIL</td>
                    <td style="padding: 14px 16px; border-bottom: 2px solid ${NAVY}; font-size: 16px; font-weight: bold; word-break: break-all;">${e}</td>
                </tr>
                <tr>
                    <td style="padding: 14px 16px; font-family: 'Courier New', monospace; font-size: 12px; font-weight: bold; width: 110px;">CONTRASINAL</td>
                    <td style="padding: 14px 16px; background: ${YELLOW}; border-radius: 0 0 14px 0; font-family: 'Courier New', monospace; font-size: 17px; font-weight: bold; word-break: break-all;">${p}</td>
                </tr>
            </table>

            <div style="text-align: center; margin: 28px 0 22px;">
                <a href="${SITE}/login" style="display: inline-block; background: #FF5A4E; color: ${NAVY}; border: 3px solid ${NAVY}; border-radius: 999px; box-shadow: 4px 4px 0 ${NAVY}; padding: 14px 30px; font-size: 17px; font-weight: 800; text-decoration: none;">Entrar no portal →</a>
            </div>

            <p style="font-size: 15px; line-height: 1.6; margin: 0 0 12px;">
                Garda este correo: mañá necesitarás o contrasinal. Se tes problemas para entrar, fala coa mesa de acreditación ou con calquera persoa da organización.
            </p>
            <p style="font-size: 16px; line-height: 1.6; margin: 0;">Vémonos mañá!<br><strong>Organización do Hackathon ETSE</strong></p>
        </div>
    </div>

    <p style="text-align: center; font-size: 12px; margin: 22px 0 0; color: ${NAVY};">
        Organizan <a href="https://osix.tech" style="color: ${NAVY};">OSIX Tech</a> e
        <a href="https://gdg.community.dev/gdg-santiago-de-compostela/" style="color: ${NAVY};">GDG Santiago de Compostela</a> · Co apoio de USC Emprende
    </p>
</body>
</html>`;
}

function getEmailText(name, email, password) {
    return `Ola ${firstName(name)}!

Xa tes conta no portal do Hackathon ETSE (xoves 22 de outubro, 12:00–20:00h, ETSE). Con ela formarás o teu equipo e, durante o evento, entregaredes o voso proxecto.

Email: ${email}
Contrasinal: ${password}

Entra en ${SITE}/login

Garda este correo: mañá necesitarás o contrasinal. Se tes problemas para entrar, fala coa mesa de acreditación ou con calquera persoa da organización.

Vémonos mañá!
Organización do Hackathon ETSE · OSIX Tech e GDG Santiago de Compostela
`;
}

module.exports = { getEmailHTML, getEmailText };
