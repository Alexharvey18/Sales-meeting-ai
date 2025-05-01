// Script to update the HTML page with the new module imports

document.addEventListener('DOMContentLoaded', () => {
    // Function to add script to head
    function addScript(src, type = 'text/javascript') {
        const script = document.createElement('script');
        script.src = src;
        script.type = type;
        document.head.appendChild(script);
    }
    
    // Function to add module script
    function addModuleScript(src) {
        const script = document.createElement('script');
        script.src = src;
        script.type = 'module';
        document.head.appendChild(script);
    }
    
    // Add the main index.js file that loads all modules
    addModuleScript('./index.js');
    
    console.log('Added Sales Meeting AI enhanced features scripts to the page');
    
    // Check if we need to add CSS for Remix Icons (used in the modules)
    if (!document.querySelector('link[href*="remixicon"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
        document.head.appendChild(link);
        
        console.log('Added Remix Icons CSS for enhanced features');
    }
    
    // Add a notification to the user
    setTimeout(() => {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4f46e5;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-size: 14px;
            max-width: 300px;
            display: flex;
            align-items: center;
        `;
        
        notification.innerHTML = `
            <i class="ri-rocket-line" style="margin-right: 8px; font-size: 18px;"></i>
            <div>
                <div style="font-weight: 600; margin-bottom: 3px;">New Features Available!</div>
                <div>Sales Meeting AI has been enhanced with 6 new modules to help you prepare for meetings.</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 8 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 8000);
    }, 2000);
}); 