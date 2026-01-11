/**
 * Blog Markdown Parser
 * Loads posts from content/posts/index.json and individual .md files
 */

const BlogParser = {
    posts: [],
    activeTag: 'All',

    async loadIndex() {
        try {
            const response = await fetch('content/posts/index.json');
            if (!response.ok) throw new Error('Posts index not found');
            this.posts = await response.json();
            return this.posts;
        } catch (error) {
            console.error('Error loading posts index:', error);
            return [];
        }
    },

    async loadPost(id) {
        try {
            const response = await fetch(`content/posts/${id}.md`);
            if (!response.ok) throw new Error('Post not found');
            return await response.text();
        } catch (error) {
            console.error('Error loading post:', error);
            return null;
        }
    },

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },

    getUniqueTags() {
        const tags = [...new Set(this.posts.map(p => p.tag))];
        return ['All', ...tags];
    },

    getFilteredPosts() {
        if (this.activeTag === 'All') return this.posts;
        return this.posts.filter(p => p.tag === this.activeTag);
    },

    renderTags(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const tags = this.getUniqueTags();
        container.innerHTML = tags.map((tag, i) => `
      <button class="blog__tag ${this.activeTag === tag ? 'blog__tag--active' : ''}" 
              onclick="BlogParser.filterByTag('${tag}')">${tag}</button>
      ${i < tags.length - 1 ? '<span class="blog__tag-separator">/</span>' : ''}
    `).join('');
    },

    filterByTag(tag) {
        this.activeTag = tag;
        this.renderTags('tagFilter');
        this.renderPosts('blogList');
    },

    renderPosts(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const posts = this.getFilteredPosts();

        if (posts.length === 0) {
            container.innerHTML = '<p class="blog__empty">No posts found.</p>';
            return;
        }

        container.innerHTML = posts.map(post => `
      <a class="blog__item" href="post.html?id=${post.id}">
        <div class="blog__row">
          <span class="blog__date">${this.formatDate(post.date)}</span>
          <span class="blog__title">${post.title}</span>
        </div>
        <p class="blog__excerpt">${post.excerpt}</p>
      </a>
    `).join('');
    },

    async init() {
        await this.loadIndex();
        this.renderTags('tagFilter');
        this.renderPosts('blogList');
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blogList')) {
        BlogParser.init();
    }
});
