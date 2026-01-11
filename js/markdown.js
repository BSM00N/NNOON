/**
 * NNOON Blog - Markdown Rendering & Post Display
 */

// =====================
// Post Content Data (Sample)
// =====================
const PostContents = {
    1: {
        title: "Attention Is All You Need 논문 리뷰",
        category: "논문 리뷰",
        date: "2024-01-15",
        readTime: "10 min",
        tags: ["AI", "NLP", "Transformer", "Deep Learning"],
        content: `
## 소개

"Attention Is All You Need" 논문은 2017년 Google에서 발표한 획기적인 논문으로, 
현재 NLP 분야를 지배하고 있는 **Transformer** 아키텍처를 소개했습니다.

## 핵심 아이디어

기존의 시퀀스 모델링 방식(RNN, LSTM)의 한계를 극복하고, 
**Self-Attention** 메커니즘만으로 시퀀스 데이터를 처리합니다.

### Self-Attention 수식

Attention 함수는 Query, Key, Value의 dot product로 계산됩니다:

$$
\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V
$$

여기서 $d_k$는 Key 벡터의 차원입니다.

## 코드 예시

Python으로 Self-Attention을 간단히 구현하면:

\`\`\`python
import torch
import torch.nn.functional as F

def self_attention(query, key, value):
    d_k = query.size(-1)
    scores = torch.matmul(query, key.transpose(-2, -1)) / math.sqrt(d_k)
    attention_weights = F.softmax(scores, dim=-1)
    return torch.matmul(attention_weights, value)
\`\`\`

## 주요 장점

1. **병렬 처리** - RNN과 달리 시퀀스를 한 번에 처리
2. **장거리 의존성** - 긴 시퀀스에서도 정보 손실 최소화
3. **해석 가능성** - Attention 가중치로 모델 해석 가능

## 결론

Transformer는 NLP를 넘어 Vision, Audio 등 다양한 분야로 확장되었습니다.
BERT, GPT, ViT 등 현대 AI의 근간이 되는 중요한 논문입니다.

> "The Transformer is the first transduction model relying entirely on self-attention."
    `
    },
    2: {
        title: "스마트 컨트랙트 보안 취약점 분석",
        category: "기술 블로그",
        date: "2024-01-10",
        readTime: "15 min",
        tags: ["Security", "Blockchain", "Solidity", "Smart Contract"],
        content: `
## 개요

스마트 컨트랙트는 한 번 배포되면 수정이 불가능하기 때문에, 
배포 전 철저한 보안 검토가 필수적입니다.

## 주요 취약점 패턴

### 1. Reentrancy Attack

가장 유명한 취약점으로, The DAO 해킹에서 사용되었습니다.

\`\`\`solidity
// 취약한 코드
function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] -= amount;  // 상태 변경이 외부 호출 이후!
}
\`\`\`

### 2. Integer Overflow/Underflow

Solidity 0.8.0 이전 버전에서 발생할 수 있는 취약점입니다.

\`\`\`solidity
// uint8 max is 255
uint8 balance = 255;
balance += 1;  // 0이 됨!
\`\`\`

## 방어 기법

1. **Checks-Effects-Interactions 패턴** 적용
2. **ReentrancyGuard** 사용
3. **SafeMath** 라이브러리 활용 (0.8.0 이전)
4. 정기적인 **Security Audit** 수행

## 결론

스마트 컨트랙트 보안은 블록체인 생태계의 신뢰를 위해 필수적입니다.
항상 최신 보안 패턴을 학습하고 적용해야 합니다.
    `
    }
};

// =====================
// Markdown Renderer
// =====================
const MarkdownRenderer = {
    init() {
        // Configure marked options
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                highlight: function (code, lang) {
                    if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                        return hljs.highlight(code, { language: lang }).value;
                    }
                    return code;
                },
                breaks: true,
                gfm: true
            });
        }
    },

    render(markdown) {
        if (typeof marked !== 'undefined') {
            return marked.parse(markdown);
        }
        // Fallback: basic formatting
        return markdown
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    },

    renderMath() {
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false }
                ],
                throwOnError: false
            });
        }
    }
};

// =====================
// Table of Contents Generator
// =====================
const TOCGenerator = {
    generate(contentEl) {
        const tocList = document.getElementById('tocList');
        if (!tocList || !contentEl) return;

        const headings = contentEl.querySelectorAll('h2, h3');
        if (headings.length === 0) {
            document.getElementById('postToc').style.display = 'none';
            return;
        }

        let tocHTML = '';
        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;

            const level = heading.tagName.toLowerCase();
            const className = level === 'h3' ? 'post-toc__link post-toc__link--h3' : 'post-toc__link';

            tocHTML += `<a href="#${id}" class="${className}">${heading.textContent}</a>`;
        });

        tocList.innerHTML = tocHTML;
        this.bindScrollSpy(headings);
    },

    bindScrollSpy(headings) {
        const tocLinks = document.querySelectorAll('.post-toc__link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tocLinks.forEach(link => link.classList.remove('post-toc__link--active'));
                    const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                    if (activeLink) activeLink.classList.add('post-toc__link--active');
                }
            });
        }, { rootMargin: '-80px 0px -80% 0px' });

        headings.forEach(heading => observer.observe(heading));
    }
};

// =====================
// Post Page Controller
// =====================
const PostPage = {
    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = parseInt(urlParams.get('id')) || 1;

        this.loadPost(postId);
    },

    loadPost(postId) {
        const post = PostContents[postId];
        if (!post) {
            document.getElementById('postContent').innerHTML = '<p>Post not found.</p>';
            return;
        }

        // Update meta
        document.getElementById('postTitle').textContent = post.title;
        document.getElementById('postCategory').textContent = post.category;
        document.getElementById('postDate').textContent = this.formatDate(post.date);
        document.getElementById('postReadTime').textContent = post.readTime;
        document.title = `NNOON | ${post.title}`;

        // Render tags
        const tagsContainer = document.getElementById('postTags');
        if (tagsContainer) {
            tagsContainer.innerHTML = post.tags
                .map(tag => `<span class="tag">${tag}</span>`)
                .join('');
        }

        // Render content
        MarkdownRenderer.init();
        const contentEl = document.getElementById('postContent');
        contentEl.innerHTML = MarkdownRenderer.render(post.content);

        // Highlight code
        if (typeof hljs !== 'undefined') {
            contentEl.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }

        // Render math
        MarkdownRenderer.renderMath();

        // Generate TOC
        TOCGenerator.generate(contentEl);

        // Setup navigation
        this.setupNavigation(postId);
    },

    setupNavigation(currentId) {
        const postIds = Object.keys(PostContents).map(Number).sort((a, b) => a - b);
        const currentIndex = postIds.indexOf(currentId);

        // Previous post
        if (currentIndex > 0) {
            const prevId = postIds[currentIndex - 1];
            const prevPost = PostContents[prevId];
            const prevEl = document.getElementById('prevPost');
            prevEl.style.display = 'block';
            prevEl.href = `post.html?id=${prevId}`;
            document.getElementById('prevPostTitle').textContent = prevPost.title;
        }

        // Next post
        if (currentIndex < postIds.length - 1) {
            const nextId = postIds[currentIndex + 1];
            const nextPost = PostContents[nextId];
            const nextEl = document.getElementById('nextPost');
            nextEl.style.display = 'block';
            nextEl.href = `post.html?id=${nextId}`;
            document.getElementById('nextPostTitle').textContent = nextPost.title;
        }
    },

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('post.html')) {
        PostPage.init();
    }
});
