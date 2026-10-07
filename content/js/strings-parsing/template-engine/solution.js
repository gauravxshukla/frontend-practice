const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (text) => text.replace(/[&<>"']/g, (char) => ESCAPES[char]);

// Triple braces come first so `{{{x}}}` isn't read as `{` + `{{x}}` + `}`.
const TOKEN = /\{\{\{\s*([^{}]+?)\s*\}\}\}|\{\{\s*([^{}]+?)\s*\}\}/g;

const resolve = (data, path) => path.split('.').reduce((obj, key) => obj?.[key], data);

/**
 * @param {string} template
 * @param {object} data
 * @return {string}
 */
export default function render(template, data) {
  return template.replace(TOKEN, (_, rawPath, escapedPath) => {
    const value = resolve(data, rawPath ?? escapedPath);
    if (value == null) return '';
    return rawPath ? String(value) : escapeHtml(String(value));
  });
}
