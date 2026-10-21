// Elixe a plantilla do evento con EMAIL_TEMPLATE no .env (impacthon por defecto).
const path = require('path');

const name = (process.env.EMAIL_TEMPLATE || 'impacthon').replace(/[^a-z0-9-]/gi, '');
const template = require(path.join(__dirname, 'templates', name));

module.exports = {
    getEmailHTML: template.getEmailHTML,
    getEmailText: template.getEmailText || null,
};
