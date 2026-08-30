export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const children = [...row.children];
  const media = children[0];
  const content = children[1];

  if (media) media.classList.add('banner-media');

  if (content) {
    content.classList.add('banner-content');

    const title = content.querySelector('h1, h2, h3, h4, h5, h6');
    if (title) title.classList.add('banner-title');

    const paragraphs = [...content.querySelectorAll('p')];
    paragraphs.forEach((paragraph, index) => {
      if (index === 0) paragraph.classList.add('banner-description');
      if (paragraph.querySelector('a')) {
        paragraph.classList.add('banner-cta-wrapper');
      }
    });

    const ctaLink = content.querySelector('a');
    if (ctaLink) {
      ctaLink.classList.add('button', 'primary');
    }
  }

  const img = block.querySelector('picture img');
  if (img) {
    img.loading = 'eager';
  }
}
