const { execSync } = require('child_process');
const path = require('path');

try {
    // Construye la ruta al ejecutable de Babel de manera multiplataforma
    const babelPath = path.join('node_modules', '.bin', 'babel');
    const command = `${babelPath} src --out-dir dist`;

    // Ejecuta el comando
    execSync(command, { stdio: 'inherit', shell: true });
    console.log('Build completed successfully.');
} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}
