/**
 * CV Markdown Parser
 * Loads and parses content/cv.md file
 */

const CVParser = {
  async load() {
    try {
      const response = await fetch('content/cv.md');
      if (!response.ok) throw new Error('CV file not found');
      const markdown = await response.text();
      return this.parse(markdown);
    } catch (error) {
      console.error('Error loading CV:', error);
      return null;
    }
  },

  parse(markdown) {
    // Split frontmatter and content
    const parts = markdown.split('---');
    if (parts.length < 3) {
      return { meta: {}, sections: this.parseSections(markdown) };
    }

    const frontmatter = parts[1].trim();
    const content = parts.slice(2).join('---').trim();

    return {
      meta: this.parseFrontmatter(frontmatter),
      sections: this.parseSections(content)
    };
  },

  parseFrontmatter(frontmatter) {
    const meta = {};
    const lines = frontmatter.split('\n');

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        meta[key] = value;
      }
    }

    return meta;
  },

  parseSections(content) {
    const sections = {};
    const sectionRegex = /^## (.+)$/gm;
    const sectionTitles = [];
    let match;

    // Find all section titles
    while ((match = sectionRegex.exec(content)) !== null) {
      sectionTitles.push({
        title: match[1],
        index: match.index
      });
    }

    // Extract content for each section
    for (let i = 0; i < sectionTitles.length; i++) {
      const start = sectionTitles[i].index;
      const end = sectionTitles[i + 1]?.index || content.length;
      const sectionContent = content.substring(start, end);

      // Remove the ## title line
      const lines = sectionContent.split('\n').slice(1).join('\n').trim();
      sections[sectionTitles[i].title] = this.parseList(lines);
    }

    return sections;
  },

  parseList(content) {
    const items = [];
    const lines = content.split('\n').filter(line => line.trim().startsWith('-'));

    for (const line of lines) {
      const cleaned = line.replace(/^-\s*/, '').trim();

      // Parse format: **date** | title | subtitle
      const boldMatch = cleaned.match(/\*\*(.+?)\*\*/);
      const date = boldMatch ? boldMatch[1] : '';

      const parts = cleaned.replace(/\*\*.+?\*\*\s*\|?\s*/, '').split('|').map(p => p.trim());

      items.push({
        date: date,
        title: parts[0] || '',
        subtitle: parts[1] || ''
      });
    }

    return items;
  },

  renderHeader(meta) {
    const githubUrl = meta.github ? `https://github.com/${meta.github}` : '#';
    const linkedinUrl = meta.linkedin_url || (meta.linkedin ? `https://linkedin.com/in/${meta.linkedin}` : '#');

    return `
      <header class="cv__header">
        <h1 class="cv__name">${meta.name || 'NNOON'}</h1>
        <p class="cv__title">${meta.title || ''}</p>
        <p class="cv__contact">
          <a href="mailto:${meta.email || ''}">${meta.email || ''}</a> · 
          <a href="${githubUrl}" target="_blank">GitHub</a> · 
          <a href="${linkedinUrl}" target="_blank">LinkedIn</a>
        </p>
      </header>
    `;
  },

  renderSection(title, items, isSkills = false) {
    if (isSkills) {
      // Skills is just comma-separated text
      const skillText = items.map(i => i.title).join(', ') || items.toString();
      return `
        <section class="cv__section">
          <h2 class="cv__section-title">${title}</h2>
          <p class="cv__skills">${typeof items === 'string' ? items : skillText}</p>
        </section>
      `;
    }

    const itemsHtml = items.map(item => `
      <div class="cv__item">
        <span class="cv__date">${item.date}</span>
        <div class="cv__content">
          <p class="cv__item-title">${item.title}</p>
          ${item.subtitle ? `<p class="cv__item-sub">${item.subtitle}</p>` : ''}
        </div>
      </div>
    `).join('');

    return `
      <section class="cv__section">
        <h2 class="cv__section-title">${title}</h2>
        ${itemsHtml}
      </section>
    `;
  },

  async render(containerId) {
    const data = await this.load();
    if (!data) {
      document.getElementById(containerId).innerHTML = '<p>Failed to load CV.</p>';
      return;
    }

    const { meta, sections } = data;
    let html = this.renderHeader(meta);

    // Render sections in order
    const sectionOrder = ['Education', 'Experience', 'Skills', 'Publications'];

    for (const title of sectionOrder) {
      if (sections[title]) {
        const isSkills = title === 'Skills';
        html += this.renderSection(title, sections[title], isSkills);
      }
    }

    // Download link
    html += `
      <div class="cv__download">
        <a href="assets/NNOON_CV.pdf" download class="cv__download-link">
          ↓ Download PDF
        </a>
      </div>
    `;

    document.getElementById(containerId).innerHTML = html;
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cvContent')) {
    CVParser.render('cvContent');
  }
});
