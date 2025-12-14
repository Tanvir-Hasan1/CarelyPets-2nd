const fs = require('fs');
const files = fs.readdirSync('node_modules/@hugeicons/core-free-icons/dist/esm');
// Expanding regex to be very broad to capture candidates
const regex = /Injection|Syringe|Vaccin|Medic|Pill|File|Scissor|Cut|Tooth|Dent|Note/i;
const found = files.filter(f => f.endsWith('.js') && regex.test(f)).map(f => f.replace('.js', ''));
fs.writeFileSync('found_icons.txt', found.join('\n'));
console.log('Done writing ' + found.length + ' icons');
