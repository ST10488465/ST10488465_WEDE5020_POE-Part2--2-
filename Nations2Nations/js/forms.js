document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            
            // Clear previous errors
            form.querySelectorAll('.error-message').forEach(msg => msg.remove());
            form.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Create error message
                    const errorMsg = document.createElement('span');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'This field is required';
                    input.parentNode.insertBefore(errorMsg, input.nextSibling);
                }
            });
            
            if (isValid) {
                // Form is valid - show success message
                alert('Form submitted successfully!');
                form.reset();
            }
        });
    });
});
