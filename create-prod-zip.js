#!/usr/bin/env node

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// List of files to include in the production ZIP
const filesToInclude = [
  'real-data-server.js',
  'start-real-server.js',
  'check-env.js',
  'env.example',
  'README-PRODUCTION.md',
  'DEPLOYMENT_CHECKLIST.md',
  'environment-setup.js',
  'package-prod.json',
  'src',
  'index-standalone.html',
  'account-tiering-module.js',
  'account-tiering-styles.css',
  'module-styles.css',
  'sales-modules-integration.js',
  'index.js',
  'import-modules.html'
];

// Create a tmp directory for ZIP preparation
const tmpDir = path.join(__dirname, 'tmp_prod_zip');
const zipName = 'salesmeetingai-production.zip';

// Create tmp directory if it doesn't exist
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Copy files to tmp directory
console.log('Copying files for production ZIP...');
filesToInclude.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(tmpDir, file);
  
  if (fs.existsSync(sourcePath)) {
    if (fs.lstatSync(sourcePath).isDirectory()) {
      console.log(`Copying directory: ${file}`);
      exec(`cp -r "${sourcePath}" "${destPath}"`, (error) => {
        if (error) {
          console.error(`Error copying directory ${file}: ${error.message}`);
        }
      });
    } else {
      console.log(`Copying file: ${file}`);
      fs.copyFileSync(sourcePath, destPath);
    }
  } else {
    console.warn(`Warning: ${file} does not exist. Skipping.`);
  }
});

// Rename package-prod.json to package.json in the tmp directory
const packageProdPath = path.join(tmpDir, 'package-prod.json');
const packagePath = path.join(tmpDir, 'package.json');
if (fs.existsSync(packageProdPath)) {
  fs.copyFileSync(packageProdPath, packagePath);
  fs.unlinkSync(packageProdPath);
}

// Rename README-PRODUCTION.md to README.md in the tmp directory
const readmeProdPath = path.join(tmpDir, 'README-PRODUCTION.md');
const readmePath = path.join(tmpDir, 'README.md');
if (fs.existsSync(readmeProdPath)) {
  fs.copyFileSync(readmeProdPath, readmePath);
  fs.unlinkSync(readmeProdPath);
}

// Create the ZIP file
console.log(`Creating ${zipName}...`);
exec(`cd "${tmpDir}" && zip -r "../${zipName}" .`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error creating ZIP: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`ZIP stderr: ${stderr}`);
  }
  
  console.log(`Successfully created ${zipName}`);
  
  // Clean up tmp directory
  console.log('Cleaning up temporary files...');
  exec(`rm -rf "${tmpDir}"`, (cleanError) => {
    if (cleanError) {
      console.error(`Error cleaning up: ${cleanError.message}`);
      return;
    }
    
    console.log('Production ZIP creation completed successfully!');
    console.log(`ZIP file location: ${path.join(__dirname, zipName)}`);
  });
}); 