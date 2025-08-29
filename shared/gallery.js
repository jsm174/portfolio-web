
class PortfolioGallery {
  constructor(galleryItems, galleryId = 'gallery') {
    this.galleryItems = galleryItems || [];
    this.galleryId = galleryId;
    this.modalId = `${galleryId}-modal`;
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.minSwipeDistance = 50;
    
    this.init();
  }

  init() {
    this.createGallery();
    this.createModal();
    this.bindEvents();
  }

  createGallery() {
    const gallery = document.getElementById(this.galleryId);
    if (!gallery || this.galleryItems.length === 0) return;

    gallery.innerHTML = '';
    
    this.galleryItems.forEach((item, index) => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      galleryItem.onclick = () => this.openModal(index);
      
      if (item.type === 'image') {
        const altText = this.getAltText(index);
        const dateStr = this.extractDate(item.src);
        const formattedDate = dateStr ? this.formatDate(dateStr) : '';
        
        galleryItem.innerHTML = `
          <img src="images/${item.src}" alt="${altText}" loading="lazy">
          ${formattedDate ? `<div class="gallery-item-date">${formattedDate}</div>` : ''}
        `;
      } else if (item.type === 'video') {
        const videoId = this.extractYouTubeId(item.src);
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const altText = this.getAltText(index);
        
        galleryItem.innerHTML = `
          <div style="position: relative; overflow: hidden; border-radius: var(--radius) var(--radius) 0 0;">
            <img src="${thumbnailUrl}" alt="${altText}" loading="lazy" style="width: 100%; height: 200px; object-fit: cover;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 48px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">▶</div>
          </div>
        `;
      }
      
      gallery.appendChild(galleryItem);
    });
  }

  createModal() {
    const existingModal = document.getElementById(this.modalId);
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = this.modalId;
    modal.className = 'modal';
    
    modal.innerHTML = `
      <span class="close">&times;</span>
      <button class="modal-nav prev" type="button">‹</button>
      <button class="modal-nav next" type="button">›</button>
      <div class="modal-content">
        <div id="${this.modalId}-media"></div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  bindEvents() {
    const modal = document.getElementById(this.modalId);
    const closeBtn = modal.querySelector('.close');
    const prevBtn = modal.querySelector('.prev');
    const nextBtn = modal.querySelector('.next');

    closeBtn.onclick = () => this.closeModal();
    modal.onclick = (e) => {
      if (e.target === modal) this.closeModal();
    };

    prevBtn.onclick = () => this.navigateModal(-1);
    nextBtn.onclick = () => this.navigateModal(1);

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      
      switch(e.key) {
        case 'Escape':
          this.closeModal();
          break;
        case 'ArrowLeft':
          this.navigateModal(-1);
          break;
        case 'ArrowRight':
          this.navigateModal(1);
          break;
      }
    });

    let startX = 0;
    let startY = 0;
    
    modal.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    modal.addEventListener('touchmove', (e) => {
      const deltaX = Math.abs(e.touches[0].clientX - startX);
      const deltaY = Math.abs(e.touches[0].clientY - startY);
      
      if (deltaX > deltaY) {
        e.preventDefault();
      }
    }, { passive: false });

    modal.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
        if (deltaX > 0) {
          this.navigateModal(-1);
        } else {
          this.navigateModal(1);
        }
      }
    }, { passive: true });

    const modalContent = modal.querySelector('.modal-content');
    modalContent.addEventListener('click', (e) => {
      const rect = modalContent.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      
      if (clickX < width * 0.33) {
        this.navigateModal(-1);
      } else if (clickX > width * 0.67) {
        this.navigateModal(1);
      }
    });
  }

  openModal(index) {
    this.currentIndex = index;
    const modal = document.getElementById(this.modalId);
    const modalMedia = modal.querySelector(`#${this.modalId}-media`);
    const item = this.galleryItems[index];
    
    if (item.type === 'image') {
      modalMedia.innerHTML = `<img src="images/${item.src}" alt="${this.getAltText(index)}">`;
    } else if (item.type === 'video') {
      modalMedia.innerHTML = `
        <iframe width="100%" height="315" 
                src="${item.src}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>
      `;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.getElementById(this.modalId);
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  navigateModal(direction) {
    const newIndex = this.currentIndex + direction;
    
    if (newIndex >= 0 && newIndex < this.galleryItems.length) {
      this.openModal(newIndex);
    }
  }

  extractDate(filename) {
    // Extract date from filenames like "project-20210530-1.webp" or "space-invaders-20250904-1.webp"
    const parts = filename.split('-');
    
    // Look for 8-digit date pattern in any part
    for (let i = 1; i < parts.length; i++) {
      if (parts[i].length === 8 && /^\d{8}$/.test(parts[i])) {
        return parts[i];
      }
    }
    
    return null;
  }

  extractYouTubeId(src) {
    // Extract video ID from YouTube embed URL
    if (src.includes('youtube.com/embed/')) {
      return src.split('youtube.com/embed/')[1].split('?')[0];
    }
    return null;
  }

  formatDate(dateStr) {
    if (!dateStr || dateStr.length !== 8) return null;
    
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);  
    const day = dateStr.substring(6, 8);
    
    try {
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return null;
    }
  }

  getAltText(index) {
    const path = window.location.pathname;
    if (path.includes('goonies')) return `Goonies project ${index + 1}`;
    if (path.includes('volley')) return `Volley restoration ${index + 1}`;
    if (path.includes('rock')) return `Rock shop ${index + 1}`;
    if (path.includes('vpcabs')) return `VPCabs repair ${index + 1}`;
    if (path.includes('81-c10-stepside')) return `C10 Stepside restoration ${index + 1}`;
    if (path.includes('space-invaders')) return `Space Invaders restoration ${index + 1}`;
    return `Gallery image ${index + 1}`;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioGallery;
}

document.addEventListener('DOMContentLoaded', () => {
  // Support single gallery (legacy)
  if (typeof galleryItems !== 'undefined' && galleryItems.length > 0) {
    new PortfolioGallery(galleryItems);
  }
  
  // Support multiple galleries
  if (typeof galleryConfigs !== 'undefined') {
    Object.keys(galleryConfigs).forEach(galleryId => {
      const config = galleryConfigs[galleryId];
      if (config.items && config.items.length > 0) {
        new PortfolioGallery(config.items, galleryId);
      }
    });
  }
});