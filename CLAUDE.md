# Impacthon Mailer

Herramienta CLI para registrar usuarios en Supabase y enviarles credenciales por email para Impacthon 2026.

## Setup

```bash
npm install
cp .env.example .env  # Rellenar con las credenciales reales
```

## Comandos

### Registro masivo (Excel/CSV → Supabase → Email)
```bash
# Ver quién se registraría sin hacer nada
node src/register.js data/asistentes.xlsx --dry-run

# Registrar y enviar emails
node src/register.js data/asistentes.xlsx
```

El Excel debe tener columnas: `Nombre | Apellidos | Email` (sin cabecera).
También acepta CSV con formato `Nombre,Email`.

### Enviar emails desde CSV de credenciales
```bash
# Enviar a todos
node src/send-emails.js data/credenciales.csv

# Enviar prueba
node src/send-emails.js data/credenciales.csv --test tu@email.com
```

### Utilidades
```bash
npm run check:users   # Listar usuarios de Supabase
npm run check:roles   # Listar perfiles con roles
npm run fix:roles     # Cambiar roles (editar array en el archivo)
```

## Estructura

```
src/
  config.js            - Conexiones Supabase + SMTP
  email-template.js    - Elige la plantilla según EMAIL_TEMPLATE
  templates/           - Plantillas por evento (impacthon, hack-the-vibe)
  supabase-helpers.js  - getAllUsers, createUser
  register.js          - Flujo completo: Excel → Supabase → Email
  send-emails.js       - Envío de emails desde CSV
  check-users.js       - Listar usuarios
  check-roles.js       - Listar roles
  fix-roles.js         - Cambiar roles
data/
  (aquí van los Excel/CSV de entrada y salida)
```

## Notas

- Las contraseñas se generan como strings aleatorios de 10 caracteres.
- Supabase tiene un trigger `handle_new_user` que auto-crea el perfil con rol `Asistente`.
- El script espera 1s después de crear el usuario para que el trigger actúe.
- Delay de 500ms entre emails para evitar rate limiting de Gmail.
- `send-emails.js` apunta cada envío en `<csv>.enviados.log`: relanzarlo continúa sin repetir correos.
- `register.js` cruza con Supabase usando paginación completa (no se limita a 50 usuarios).
