export default async function decorate(block) {
  const link = block.querySelector('a');
  const jsonUrl = link ? link.href : null;

  if (!jsonUrl) return;

  block.innerHTML = '';

  const ITEMS_PER_PAGE = 20;
  let currentPage = 1;

  const response = await fetch(jsonUrl);
  const json = await response.json();
  const items = json.data;
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  function renderList(page) {
    const existing = block.querySelector('ul');
    if (existing) existing.remove();

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = items.slice(start, end);

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

  function renderPagination() {
    const existing = block.querySelector('.pagination');
    if (existing) existing.remove();

    const nav = document.createElement('div');
    nav.className = 'pagination';

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

    const info = document.createElement('span');
    info.textContent = `Page ${currentPage} of ${totalPages}`;

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

  renderList(currentPage);
  renderPagination();
}
