/**
 * NNOON Homepage - Main JavaScript
 */

// =====================
// Theme Toggle
// =====================
const ThemeManager = {
  STORAGE_KEY: 'nnoon-theme',
  
  init() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'dark'); // default to dark
    
    this.setTheme(theme);
    this.bindToggle();
  },
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateIcon(theme);
  },
  
  updateIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  },
  
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  },
  
  bindToggle() {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
    }
  }
};

// =====================
// Mobile Navigation
// =====================
const MobileNav = {
  init() {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('nav__links--open');
        menuBtn.classList.toggle('nav__menu-btn--active');
      });
      
      // Close menu on link click
      navLinks.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('nav__links--open');
          menuBtn.classList.remove('nav__menu-btn--active');
        });
      });
    }
  }
};

// =====================
// Reading Progress Bar
// =====================
const ReadingProgress = {
  init() {
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
  }
};

// =====================
// Smooth Scroll
// =====================
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }
};

// =====================
// Animation on Scroll
// =====================
const ScrollAnimation = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.card, .timeline__item, .about__stat').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }
};

// =====================
// Blog Data (Sample)
// =====================
const BlogData = {
  posts: [
    {
      id: 1,
      title: "Attention Is All You Need 논문 리뷰",
      excerpt: "Transformer 아키텍처의 핵심 개념과 Self-Attention 메커니즘에 대한 상세 분석...",
      category: "논문 리뷰",
      date: "2024-01-15",
      readTime: "10 min",
      tags: ["AI", "NLP", "Transformer"]
    },
    {
      id: 2,
      title: "스마트 컨트랙트 보안 취약점 분석",
      excerpt: "Reentrancy Attack, Integer Overflow 등 주요 취약점 패턴과 방어 기법...",
      category: "기술 블로그",
      date: "2024-01-10",
      readTime: "15 min",
      tags: ["Security", "Blockchain", "Solidity"]
    },
    {
      id: 3,
      title: "GPT-4 아키텍처 추측과 분석",
      excerpt: "공개된 정보를 바탕으로 GPT-4의 가능한 아키텍처 구조를 분석해봅니다...",
      category: "논문 리뷰",
      date: "2024-01-05",
      readTime: "12 min",
      tags: ["AI", "LLM", "OpenAI"]
    }
  ],
  
  getRecentPosts(limit = 3) {
    return this.posts.slice(0, limit);
  },
  
  renderPostCard(post) {
    return `
      <article class="card post-card" onclick="window.location='post.html?id=${post.id}'">
        <div class="card__header">
          <div class="post-card__meta">
            <span class="post-card__category">${post.category}</span>
            <span class="post-card__date">${this.formatDate(post.date)}</span>
          </div>
          <h3 class="post-card__title">${post.title}</h3>
        </div>
        <div class="card__content">
          <p class="post-card__excerpt">${post.excerpt}</p>
        </div>
        <div class="card__footer">
          <div class="tags">
            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <span class="post-card__read-time">
            <i class="fas fa-clock"></i> ${post.readTime}
          </span>
        </div>
      </article>
    `;
  },
  
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

// =====================
// Stats Counter Animation
// =====================
const StatsCounter = {
  init() {
    const options = { threshold: 0.5 };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    const statsSection = document.querySelector('.about__stats');
    if (statsSection) {
      observer.observe(statsSection);
    }
  },
  
  animateCounters() {
    const counters = [
      { el: document.getElementById('postCount'), target: BlogData.posts.length },
      { el: document.getElementById('paperCount'), target: BlogData.posts.filter(p => p.category === '논문 리뷰').length },
      { el: document.getElementById('projectCount'), target: 5 }
    ];
    
    counters.forEach(({ el, target }) => {
      if (!el) return;
      
      let current = 0;
      const increment = target / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 30);
    });
  }
};

// =====================
// Initialize Recent Posts
// =====================
function initRecentPosts() {
  const grid = document.getElementById('recentPostsGrid');
  if (!grid) return;
  
  const posts = BlogData.getRecentPosts(3);
  grid.innerHTML = posts.map(post => BlogData.renderPostCard(post)).join('');
}

// =====================
// Active Navigation Link
// =====================
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('nav__link--active', href === currentPage);
  });
}

// =====================
// Initialize App
// =====================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  MobileNav.init();
  ReadingProgress.init();
  SmoothScroll.init();
  ScrollAnimation.init();
  StatsCounter.init();
  initRecentPosts();
  setActiveNavLink();
});
