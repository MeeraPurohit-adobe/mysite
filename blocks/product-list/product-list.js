export default async function decorate(block) {
  // Get the JSON URL from the block content
  const link = block.querySelector('a');
  const jsonUrl = link ? link.href : null;

  if (!jsonUrl) return;

  // Clear the block content
  block.innerHTML = '';

  try {
    // Fetch the JSON data
    const response = await fetch(jsonUrl);
    const json = await response.json();
    const items = json.data;

    // Create a list
    const ul = document.createElement('ul');

    items.forEach((item) => {
      const li = document.createElement('li');

      // Loop through all columns dynamically
      const details = Object.entries(item)
        .map(([key, value]) => `<span><strong>${key}:</strong> ${value}</span>`)
        .join(' | ');

      li.innerHTML = details;
      ul.appendChild(li);
    });

    block.appendChild(ul);
  } catch (error) {
    block.innerHTML = '<p>Failed to load data.</p>';
  }
}
