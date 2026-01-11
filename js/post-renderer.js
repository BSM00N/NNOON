/**
 * Post Page - Markdown Renderer
 * Loads individual post from content/posts/{id}.md
 */

const PostRenderer = {
    getBasePath() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p);
        if (parts.length >= 1 && parts[parts.length - 1].endsWith('.html')) {
            parts.pop();
        }
        return parts.length > 0 ? '/' + parts.join('/') + '/' : '/';
    },

    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        if (!postId) {
            this.showError('Post ID not specified');
            return;
        }

        await this.loadAndRender(postId);
    },

    async loadAndRender(postId) {
        try {
            const basePath = this.getBasePath();

            // Load post index to get metadata
            const indexResponse = await fetch(basePath + 'content/posts/index.json');
            const posts = await indexResponse.json();
            const postMeta = posts.find(p => p.id === postId);

            if (!postMeta) {
                this.showError('Post not found');
                return;
            }

            // Load post content
            const contentResponse = await fetch(basePath + `content/posts/${postId}.md`);
            if (!contentResponse.ok) {
                this.showError('Post content not found');
                return;
            }
            const markdown = await contentResponse.text();

            // Render
            this.renderMeta(postMeta);
            this.renderContent(markdown);
            this.generateTOC();
            this.setupNavigation(posts, postId);

        } catch (error) {
            console.error('Error loading post:', error);
            this.showError('Failed to load post');
        }
    },

    renderMeta(meta) {
        document.getElementById('postTitle').textContent = meta.title;
        document.getElementById('postCategory').textContent = meta.tag;
        document.getElementById('postDate').textContent = this.formatDate(meta.date);
        document.getElementById('postReadTime').textContent = this.estimateReadTime(meta.excerpt);
        document.title = `NNOON | ${meta.title}`;

        // Tags
        const tagsContainer = document.getElementById('postTags');
        if (tagsContainer) {
            tagsContainer.innerHTML = `<span class="tag">${meta.tag}</span>`;
        }
    },

    renderContent(markdown) {
        const contentEl = document.getElementById('postContent');

        // Protect math expressions before marked processes them
        const mathBlocks = [];
        const mathInline = [];

        // Protect display math ($$...$$)
        let processed = markdown.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
            mathBlocks.push(math);
            return `%%MATH_BLOCK_${mathBlocks.length - 1}%%`;
        });

        // Protect inline math ($...$)
        processed = processed.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
            mathInline.push(math);
            return `%%MATH_INLINE_${mathInline.length - 1}%%`;
        });

        // Use marked.js if available
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true
            });
            contentEl.innerHTML = marked.parse(processed);
        } else {
            contentEl.innerHTML = processed
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\n\n/g, '</p><p>');
        }

        // Restore math expressions
        let html = contentEl.innerHTML;

        // Restore display math
        mathBlocks.forEach((math, i) => {
            html = html.replace(`%%MATH_BLOCK_${i}%%`, `<div class="math-display">$$${math}$$</div>`);
        });

        // Restore inline math
        mathInline.forEach((math, i) => {
            html = html.replace(`%%MATH_INLINE_${i}%%`, `$${math}$`);
        });

        contentEl.innerHTML = html;

        // Highlight code blocks
        if (typeof hljs !== 'undefined') {
            contentEl.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }

        // Render math with KaTeX
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(contentEl, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false }
                ],
                throwOnError: false
            });
        }

        // Remove first H1 to avoid duplicate title (title is already in header)
        const firstH1 = contentEl.querySelector('h1');
        if (firstH1) {
            firstH1.remove();
        }
    },

    generateTOC() {
        const contentEl = document.getElementById('postContent');
        const tocList = document.getElementById('tocList');
        const tocContainer = document.getElementById('postToc');

        if (!tocList || !contentEl) return;

        const headings = contentEl.querySelectorAll('h2, h3');

        if (headings.length === 0) {
            if (tocContainer) tocContainer.style.display = 'none';
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
    },

    setupNavigation(posts, currentId) {
        // Navigation removed - no longer used
    },

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    estimateReadTime(text) {
        const wordsPerMinute = 200;
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${Math.max(5, minutes)} min read`;
    },

    showError(message) {
        document.getElementById('postTitle').textContent = 'Error';
        document.getElementById('postContent').innerHTML = `<p>${message}</p>`;
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('postContent')) {
        PostRenderer.init();
    }
});
