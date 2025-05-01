// Script to automatically inject the module imports into the main HTML page
(function() {
    // Configure API backend URL
    window.API_BASE_URL = 'http://localhost:3001';

    // Function to inject the module imports
    async function injectModules() {
        try {
            // Fetch the import-modules.html content
            const response = await fetch('./import-modules.html');
            if (!response.ok) {
                console.error(`Error loading import-modules.html: ${response.status}`);
                // Fallback: Add scripts directly
                addDirectImports();
                return;
            }
            
            const importContent = await response.text();
            
            // Check if modules are already imported
            if (document.head.innerHTML.includes('Sales Meeting AI Enhanced Features')) {
                console.log('Modules already imported');
                return;
            }
            
            // Add the import content to the head of the document
            document.head.insertAdjacentHTML('beforeend', importContent);
            
            console.log('Sales Meeting AI Enhanced Features successfully imported');
        } catch (error) {
            console.error('Error importing enhanced features:', error);
            // Fallback: Add scripts directly
            addDirectImports();
        }
    }
    
    // Fallback function to add imports directly if the import-modules.html fails to load
    function addDirectImports() {
        // Add Remix Icons CSS
        if (!document.querySelector('link[href*="remixicon"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
            document.head.appendChild(link);
        }
        
        // Add index.js module script
        const script1 = document.createElement('script');
        script1.type = 'module';
        script1.src = './index.js';
        document.head.appendChild(script1);
        
        // Add update-html.js script
        const script2 = document.createElement('script');
        script2.src = './update-html.js';
        document.head.appendChild(script2);
        
        console.log('Added direct imports as fallback');
    }
    
    // Wait for the document to load before injecting modules
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectModules);
    } else {
        injectModules();
    }
    
    // Monkey patch fetch to redirect API calls to the mock server
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && url.startsWith('/api/')) {
            // Redirect to mock server
            const newUrl = `${window.API_BASE_URL}${url}`;
            console.log(`Redirecting API call from ${url} to ${newUrl}`);
            return originalFetch(newUrl, options);
        }
        
        return originalFetch(url, options);
    };
})(); 