document.addEventListener('DOMContentLoaded', function() {
    // This is to create the lightbox elements
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close">&times;</span>
            <img src="" alt="Lightbox Image">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    // Added click events to gallery images
    const galleryImages = document.querySelectorAll('main img');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.close');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            lightbox.style.display = 'flex';
            lightboxImg.src = this.src;
            lightboxCaption.textContent = this.alt;
        });
    });
    
    // Closing the lightbox
    closeBtn.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
    
    lightbox.addEventListener('click', function(e) {
        if (e.target !== lightboxImg && e.target !== lightboxCaption) {
            lightbox.style.display = 'none';
        }
    });
});