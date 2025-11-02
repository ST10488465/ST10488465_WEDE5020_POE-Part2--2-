// Interactive Maps for Contact Page
document.addEventListener('DOMContentLoaded', function() {
    initializeMaps();
    setupContactForm();
    setupLiveChat();
});

function initializeMaps() {
    // Cape Town Map
    const capeTownMap = L.map('capeTownMap').setView([-33.9249, 18.4241], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(capeTownMap);
    
    L.marker([-33.9249, 18.4241])
        .addTo(capeTownMap)
        .bindPopup(`
            <div class="map-popup">
                <h4>Nations2Nations Cape Town</h4>
                <p>123 Main Street, Cape Town City Center</p>
                <p><strong>Hours:</strong> Mon-Fri 9AM-6PM</p>
                <p><strong>Phone:</strong> 062 435 1234</p>
            </div>
        `)
        .openPopup();

    // Johannesburg Map
    const johannesburgMap = L.map('johannesburgMap').setView([-26.1076, 28.0567], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(johannesburgMap);
    
    L.marker([-26.1076, 28.0567])
        .addTo(johannesburgMap)
        .bindPopup(`
            <div class="map-popup">
                <h4>Nations2Nations Johannesburg</h4>
                <p>456 Business Avenue, Sandton</p>
                <p><strong>Hours:</strong> Mon-Fri 9AM-6PM</p>
                <p><strong>Phone:</strong> 062 435 1235</p>
            </div>
        `)
        .openPopup();

    // Add resize event to handle map container resizing
    window.addEventListener('resize', function() {
        setTimeout(() => {
            capeTownMap.invalidateSize();
            johannesburgMap.invalidateSize();
        }, 100);
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
            
            // In a real application, you would send the data to a server here
            console.log('Form submitted:', { name, email, message });
        });
    }
}

function setupLiveChat() {
    const liveChatBtn = document.getElementById('liveChatBtn');
    
    if (liveChatBtn) {
        liveChatBtn.addEventListener('click', function() {
            // Simulate live chat functionality
            const isBusinessHours = checkBusinessHours();
            
            if (isBusinessHours) {
                showNotification('Connecting you with our support team...', 'success');
                // In a real application, this would open a chat widget
                setTimeout(() => {
                    showNotification('Live chat is now active!', 'success');
                }, 2000);
            } else {
                showNotification('Live chat is available during business hours (Mon-Fri 9AM-6PM). Please send us an email instead.', 'info');
            }
        });
    }
}

function checkBusinessHours() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    
    // Check if it's a weekday (Monday to Friday) and between 9 AM and 6 PM
    if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
        return true;
    }
    
    // Check if it's Saturday and between 9 AM and 4 PM
    if (day === 6 && hour >= 9 && hour < 16) {
        return true;
    }
    
    // Check if it's Sunday and between 10 AM and 2 PM
    if (day === 0 && hour >= 10 && hour < 14) {
        return true;
    }
    
    return false;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#007bff',
        warning: '#ffc107'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);