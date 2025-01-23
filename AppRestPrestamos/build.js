const { execSync } = require('child_process');

try {
    // Ejecuta Babel con npx para evitar problemas de permisos
    execSync('npx babel src --out-dir dist', { stdio: 'inherit', shell: true });
    console.log('Build completed successfully.');
} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}
