class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const imgSrc = this.getAttribute('image') || '';
        const imgAlt = this.getAttribute('alt') || '';
        const description = this.getAttribute('description') || '';
        const link = this.getAttribute('link') || '#';
        const technologies = this.getAttribute('technologies') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --card-bg: var(--surface-color, #ffffff);
                    --card-text: var(--text-color, #333333);
                    --card-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    --card-radius: 8px;
                    --card-padding: 1.5rem;
                    
                    display: block;
                    background: var(--card-bg);
                    border-radius: var(--card-radius);
                    box-shadow: var(--card-shadow);
                    transition: transform 0.3s ease;
                    margin-bottom: 2rem;
                }

                :host(:hover) {
                    transform: translateY(-5px);
                }

                .card {
                    display: flex;
                    flex-direction: column;
                }

                picture {
                    width: 100%;
                    height: 250px;
                    overflow: hidden;
                    border-radius: var(--card-radius) var(--card-radius) 0 0;
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .content {
                    padding: var(--card-padding);
                }

                h2 {
                    margin: 0 0 1rem 0;
                    color: var(--card-text);
                }

                .description {
                    color: var(--card-text);
                    margin-bottom: 1rem;
                    line-height: 1.6;
                }

                .technologies {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .tech {
                    background: var(--accent-color, #0077cc);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 1rem;
                    font-size: 0.875rem;
                }

                .link {
                    display: inline-block;
                    color: var(--accent-color, #0077cc);
                    text-decoration: none;
                    font-weight: 500;
                }

                .link:hover {
                    text-decoration: underline;
                }
            </style>

            <div class="card">
                <picture>
                    <img src="${imgSrc}" alt="${imgAlt}" loading="lazy">
                </picture>
                <div class="content">
                    <h2>${title}</h2>
                    <p class="description">${description}</p>
                    <div class="technologies">
                        ${technologies.split(',').map(tech => 
                            `<span class="tech">${tech.trim()}</span>`
                        ).join('')}
                    </div>
                    <a href="${link}" class="link" target="_blank" rel="noopener noreferrer">
                        View Project →
                    </a>
                </div>
            </div>
        `;
    }
}

customElements.define('project-card', ProjectCard);