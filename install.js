// Installation script for Sales Meeting AI Enhanced Features
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Function to output colored messages
const output = {
  info: (msg) => console.log('\x1b[36m%s\x1b[0m', msg),
  success: (msg) => console.log('\x1b[32m%s\x1b[0m', msg),
  error: (msg) => console.log('\x1b[31m%s\x1b[0m', msg),
  warning: (msg) => console.log('\x1b[33m%s\x1b[0m', msg)
};

// Files to be installed
const files = [
  'buyer-signals-module.js',
  'account-intelligence-module.js',
  'battlecard-generator.js',
  'meeting-prep-toolkit.js',
  'sales-potential-score.js',
  'action-recommendations.js',
  'sales-modules-integration.js',
  'update-html.js',
  'index.js',
  'import-modules.html',
  'index-integration.js',
  'module-package.json',
  'README-NEW-FEATURES.md'
];

// Function to check if all required files are present
function checkFiles() {
  output.info('Checking for required files...');
  
  const missingFiles = [];
  
  for (const file of files) {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    output.error('Missing required files:');
    missingFiles.forEach(file => console.log(`  - ${file}`));
    return false;
  }
  
  output.success('All required files found!');
  return true;
}

// Function to inject the module import into the main HTML file
function injectModuleImport() {
  output.info('Looking for HTML files to update...');
  
  const htmlFiles = ['index.html', 'index-standalone.html'].filter(file => fs.existsSync(file));
  
  if (htmlFiles.length === 0) {
    output.warning('No HTML files found to update');
    return;
  }
  
  htmlFiles.forEach(htmlFile => {
    output.info(`Checking ${htmlFile}...`);
    
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    
    // Check if the file already has the module import
    if (htmlContent.includes('Sales Meeting AI Enhanced Features')) {
      output.info(`${htmlFile} already has the enhanced features imported`);
      return;
    }
    
    // Add script tag before the closing head tag
    const updatedContent = htmlContent.replace('</head>', 
      `  <script src="./index-integration.js"></script>\n</head>`);
    
    // Write the updated content back to the file
    fs.writeFileSync(htmlFile, updatedContent);
    
    output.success(`Updated ${htmlFile} with enhanced features import`);
  });
}

// Main installation function
async function install() {
  output.info('Starting Sales Meeting AI Enhanced Features installation...');
  
  // Check for required files
  if (!checkFiles()) {
    output.error('Installation failed: Missing required files');
    return;
  }
  
  // Install dependencies if module-package.json exists
  if (fs.existsSync('module-package.json')) {
    output.info('Installing dependencies...');
    
    // Only install remixicon if not already installed
    try {
      exec('npm list remixicon', (error) => {
        if (error) {
          exec('npm install remixicon@3.5.0', (err, stdout, stderr) => {
            if (err) {
              output.error('Failed to install dependencies');
              console.error(stderr);
            } else {
              output.success('Dependencies installed successfully');
            }
          });
        } else {
          output.info('Dependencies already installed');
        }
      });
    } catch (error) {
      output.error('Error checking dependencies');
      console.error(error);
    }
  }
  
  // Inject module import into HTML files
  injectModuleImport();
  
  output.success('Installation completed successfully!');
  output.info('To use the new features, restart your application and reload the page.');
  output.info('Check README-NEW-FEATURES.md for more information on how to use the new modules.');
}

// Run the installation
install(); 