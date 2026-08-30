export default async function decorate(block) {
  // Get the JSON URL from the block content
  const link = block.querySelector('a');
  const jsonUrl = link ? link.href : null;

  if (!jsonUrl) return;

  // Clear the block content
  block.innerHTML = '';

  // Pagination settings
  const ITEMS_PER_PAGE = 20;
  let currentPage = 1;

  try {
    // Fetch the JSON data
    const response = await fetch(jsonUrl);
    const json = await response.json();
    const items = json.data;
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    // --- render list ---
    function renderList(page) {
      // Clear previous list
      const existing = block.querySelector('ul');
      if (existing) existing.remove();

      // Calculate slice
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const pageItems = items.slice(start, end);

      // Create list
      const ul = document.createElement('ul');

      pageItems.forEach((item) => {
        const li = document.createElement('li');
        const details = Object.entries(item)
          .map(([key, value]) => `<span><strong>${key}:</strong> ${value}</span>`)
          .join(' | ');
        li.innerHTML = details;
        ul.appendChild(li);
      });

      block.prepend(ul);
    }

    // --- render pagination ---
    function renderPagination() {
      // Remove existing pagination
      const existing = block.querySelector('.pagination');
      if (existing) existing.remove();

      const nav = document.createElement('div');
      nav.className = 'pagination';

      // Previous button
      const prev = document.createElement('button');
      prev.textContent = '← Prev';
      prev.disabled = currentPage === 1;
      prev.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage -= 1;
          renderList(currentPage);
          renderPagination();
        }
      });

      // Page info
      const info = document.createElement('span');
      info.textContent = `Page ${currentPage} of ${totalPages}`;

      // Next button
      const next = document.createElement('button');
      next.textContent = 'Next →';
      next.disabled = currentPage === totalPages;
      next.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage += 1;
          renderList(currentPage);
          renderPagination();
        }
      });

      nav.appendChild(prev);
      nav.appendChild(info);
      nav.appendChild(next);
      block.appendChild(nav);
    }

    // Initial render
    renderList(currentPage);
    renderPagination();

  } catch (error) {
    block.innerHTML = '<p>Failed to load data.</p>';
  }
}
