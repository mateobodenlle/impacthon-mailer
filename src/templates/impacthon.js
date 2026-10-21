function getEmailHTML(name, email, password) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 40px; margin: 0;">
    <div style="max-width: 600px; margin: 0 auto; background: #111; border-radius: 16px; padding: 40px; border: 1px solid #333;">
        <div style="text-align: center; margin-bottom: 30px; overflow: hidden;">
            <img src="https://impacthon-web.vercel.app/title_logo.svg" alt="Impacthon 2026" style="width: 100%; max-width: 420px; height: auto; margin: -18% 0;" />
        </div>

        <p style="color: #fff; line-height: 1.6; margin: 0 0 16px 0; font-size: 17px;">Hola ${name},</p>

        <p style="color: #fff; line-height: 1.6; margin: 0 0 20px 0; font-size: 17px;">Ya tienes cuenta en la plataforma del Impacthon. Aquí están tus credenciales:</p>

        <table style="width: 100%; margin: 24px 0; border-collapse: collapse; background: #1a1a1a; border-radius: 8px; table-layout: fixed;">
            <tr>
                <td style="padding: 14px 16px; border-bottom: 1px solid #2a2a2a; color: #AAFF00; font-size: 14px; width: 90px;">Email</td>
                <td style="padding: 14px 16px; border-bottom: 1px solid #2a2a2a; color: #fff; font-size: 16px; word-break: break-all; overflow-wrap: break-word;">${email}</td>
            </tr>
            <tr>
                <td style="padding: 14px 16px; color: #AAFF00; font-size: 14px; width: 90px;">Contraseña</td>
                <td style="padding: 14px 16px; color: #fff; font-size: 16px; font-family: monospace; letter-spacing: 1px; word-break: break-all; overflow-wrap: break-word;">${password}</td>
            </tr>
        </table>

        <p style="color: #fff; line-height: 1.6; margin: 0 0 24px 0; font-size: 17px;">
            Entra en <a href="https://impacthon-web.vercel.app/login" style="color: #AAFF00;">impacthon-web.vercel.app</a> para completar tu perfil y unirte a un equipo.
        </p>

        <p style="color: #fff; line-height: 1.6; margin: 0; font-size: 17px;">¡Nos vemos!<br/><span style="color: #AAFF00;">Organización Impacthon</span></p>
    </div>

    <p style="text-align: center; color: #525252; font-size: 12px; margin-top: 24px;">
        GDG Santiago de Compostela
    </p>
</body>
</html>`;
}

module.exports = { getEmailHTML };
