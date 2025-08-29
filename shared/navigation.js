
class PortfolioNavigation {
  constructor() {
    this.initNavigation();
    this.bindEvents();
  }

  initNavigation() {
    const nav = document.querySelector('.nav nav') || document.querySelector('.nav-menu');
    if (!nav) return;

    const existing = document.querySelector('.hamburger');
    if (!existing) {
      this.createHamburgerMenu();
    }

    const mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) {
      this.createMobileMenu();
    }
  }

  createHamburgerMenu() {
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    
    const nav = document.querySelector('.nav');
    nav.appendChild(hamburger);
  }

  createMobileMenu() {
    const currentPath = window.location.pathname;
    const isSubpage = currentPath.includes('/goonies') || currentPath.includes('/volley') || 
                     currentPath.includes('/rock') || currentPath.includes('/vpcabs');

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    const menuContent = `
      <div class="mobile-menu-section">
        <h3>Navigation</h3>
        ${isSubpage ? '<a href="../">← Back to Portfolio</a>' : '<a href="#top">Portfolio Home</a>'}
        <a href="https://github.com/jsm174" target="_blank">GitHub Profile</a>
      </div>
      
      ${!isSubpage ? `
      <div class="mobile-menu-section">
        <h3>Projects</h3>
        <a href="goonies/">The Goonies VPX</a>
        <a href="volley/">Volley Restoration</a>
        <a href="rock/">Rock Shop Job</a>
        <a href="vpcab/">VPCabs Repair</a>
      </div>
      
      <div class="mobile-menu-section">
        <h3>External</h3>
        <a href="https://gist.github.com/jsm174" target="_blank">GitHub Gists</a>
        <a href="https://github.com/jsm174/vpcabs-zeb-encoder" target="_blank">Encoder Projects</a>
      </div>
      ` : `
      <div class="mobile-menu-section">
        <h3>Other Projects</h3>
        <a href="${isSubpage ? '../goonies/' : 'goonies/'}">The Goonies VPX</a>
        <a href="${isSubpage ? '../volley/' : 'volley/'}">Volley Restoration</a>
        <a href="${isSubpage ? '../rock/' : 'rock/'}">Rock Shop Job</a>
        <a href="${isSubpage ? '../vpcabs/' : 'vpcabs/'}">VPCabs Repair</a>
        <a href="${isSubpage ? '../81-c10-stepside/' : '81-c10-stepside/'}">1981 C10 Stepside</a>
      </div>
      `}
    `;
    
    mobileMenu.innerHTML = menuContent;
    
    const nav = document.querySelector('.nav');
    nav.appendChild(mobileMenu);
  }

  bindEvents() {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
      });

        document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
        }
      });

        const menuLinks = mobileMenu.querySelectorAll('a');
      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
        });
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (hamburger) hamburger.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PortfolioNavigation();
});