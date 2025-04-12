const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const rootDir = path.join(__dirname, '..');
const nextDir = path.join(rootDir, '.next');
const standaloneDir = path.join(nextDir, 'standalone');
const publicDir = path.join(rootDir, 'public');

// Create required directories
const targetStaticDir = path.join(standaloneDir, '.next', 'static');
const targetPublicDir = path.join(standaloneDir, 'public');

// Ensure directories exist
fs.mkdirSync(targetStaticDir, { recursive: true });
fs.mkdirSync(targetPublicDir, { recursive: true });

// Copy static files
console.log('Copying static files...');
execSync(`xcopy /E /I /Y "${path.join(nextDir, 'static')}" "${targetStaticDir}"`);

// Copy public files if they exist
if (fs.existsSync(publicDir)) {
    console.log('Copying public files...');
    execSync(`xcopy /E /I /Y "${publicDir}" "${targetPublicDir}"`);
}

// Copy static files to root static directory
console.log('Copying static files to root...');
const rootStaticDir = path.join(standaloneDir, 'static');
fs.mkdirSync(rootStaticDir, { recursive: true });
execSync(`xcopy /E /I /Y "${path.join(nextDir, 'static')}" "${rootStaticDir}"`);

console.log('Static files copied successfully!');
