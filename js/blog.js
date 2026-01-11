/**
 * NNOON Blog - Blog List Functionality
 */

// =====================
// Extended Blog Data
// =====================
const AllPosts = [
    {
        id: 1,
        title: "Attention Is All You Need 논문 리뷰",
        excerpt: "Transformer 아키텍처의 핵심 개념과 Self-Attention 메커니즘에 대한 상세 분석. 기존 RNN/CNN 기반 모델의 한계를 극복하고 어떻게 병렬 처리가 가능해졌는지 살펴봅니다.",
        category: "논문 리뷰",
        date: "2024-01-15",
        readTime: "10 min",
        tags: ["AI", "NLP", "Transformer", "Deep Learning"]
    },
    {
        id: 2,
        title: "스마트 컨트랙트 보안 취약점 분석",
        excerpt: "Reentrancy Attack, Integer Overflow, Front-Running 등 주요 취약점 패턴과 실제 해킹 사례를 통한 방어 기법 학습.",
        category: "기술 블로그",
        date: "2024-01-10",
        readTime: "15 min",
        tags: ["Security", "Blockchain", "Solidity", "Smart Contract"]
    },
    {
        id: 3,
        title: "GPT-4 아키텍처 추측과 분석",
        excerpt: "공개된 정보를 바탕으로 GPT-4의 가능한 아키텍처 구조를 분석해봅니다. MoE(Mixture of Experts) 구조와 멀티모달 처리 방식에 대한 고찰.",
        category: "논문 리뷰",
        date: "2024-01-05",
        readTime: "12 min",
        tags: ["AI", "LLM", "OpenAI", "Architecture"]
    },
    {
        id: 4,
        title: "Diffusion Model 수학적 이해",
        excerpt: "DDPM(Denoising Diffusion Probabilistic Models)의 수학적 배경과 Forward/Reverse Process의 원리를 깊이 있게 살펴봅니다.",
        category: "논문 리뷰",
        date: "2023-12-28",
        readTime: "20 min",
        tags: ["AI", "Generative Model", "Diffusion", "Mathematics"]
    },
    {
        id: 5,
        title: "Foundry로 스마트 컨트랙트 테스트하기",
        excerpt: "Foundry 프레임워크를 활용한 Solidity 스마트 컨트랙트 테스트 환경 구축과 실전 테스트 작성법을 다룹니다.",
        category: "기술 블로그",
        date: "2023-12-20",
        readTime: "8 min",
        tags: ["Blockchain", "Foundry", "Testing", "Solidity"]
    },
    {
        id: 6,
        title: "CTF Writeup: Web Security Challenge",
        excerpt: "최근 참가한 CTF 대회의 웹 보안 문제 풀이 과정을 공유합니다. SQL Injection부터 SSRF까지 다양한 공격 기법 활용.",
        category: "프로젝트",
        date: "2023-12-15",
        readTime: "18 min",
        tags: ["CTF", "Web Security", "Writeup"]
    }
];

// =====================
// Blog Filter & Search
// =====================
const BlogManager = {
    currentCategory: 'all',
    searchQuery: '',

    init() {
        this.bindFilters();
        this.bindSearch();
        this.renderPosts();
    },

    bindFilters() {
        const filterBtns = document.querySelectorAll('.blog-filter');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('blog-filter--active'));
                btn.classList.add('blog-filter--active');
                this.currentCategory = btn.dataset.category;
                this.renderPosts();
            });
        });
    },

    bindSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.searchQuery = e.target.value.toLowerCase().trim();
                    this.renderPosts();
                }, 300);
            });
        }
    },

    getFilteredPosts() {
        return AllPosts.filter(post => {
            // Category filter
            const categoryMatch = this.currentCategory === 'all' ||
                post.category === this.currentCategory;

            // Search filter
            const searchMatch = !this.searchQuery ||
                post.title.toLowerCase().includes(this.searchQuery) ||
                post.excerpt.toLowerCase().includes(this.searchQuery) ||
                post.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));

            return categoryMatch && searchMatch;
        });
    },

    renderPosts() {
        const grid = document.getElementById('blogGrid');
        const emptyState = document.getElementById('emptyState');
        if (!grid) return;

        const posts = this.getFilteredPosts();

        if (posts.length === 0) {
            grid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';

        grid.innerHTML = posts.map(post => this.renderPostCard(post)).join('');
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
            ${post.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
            ${post.tags.length > 3 ? `<span class="tag">+${post.tags.length - 3}</span>` : ''}
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    BlogManager.init();
});
