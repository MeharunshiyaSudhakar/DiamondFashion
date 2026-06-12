const fs = require('fs');
const files = [
    'c:/diamond_fashion/frontend/src/pages/AdminDashboard.jsx',
    'c:/diamond_fashion/frontend/src/pages/AdminPage.jsx'
];
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/className="glass-morphism"/g, 'className="admin-glass"');
    fs.writeFileSync(f, content);
});
console.log('Done');
