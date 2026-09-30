const fs = require('fs');
const code = fs.readFileSync('/tmp/bundle.js', 'utf8');

// Find all string literals in the bundle that look like UI text
const strRegex = /"([^"\\]{4,120})"/g;
let m;
const set = new Set();
while ((m = strRegex.exec(code)) !== null) {
  const s = m[1];
  if (/[a-zA-Z]{3,}/.test(s) && !s.includes('{') && !s.includes(';') && !s.includes('\\')) {
    if (/Afran|hospital|patient|feedback|complaint|track|staff|admin|portal|rating|department|urgent|status|submit|review|triage/i.test(s)) {
      set.add(s);
    }
  }
}

console.log('--- Matched UI Text Count ---', set.size);
console.log(Array.from(set).slice(0, 150).join('\n'));
