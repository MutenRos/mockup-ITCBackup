(function () {
  const header = document.querySelector('.shared-header');
  if (!header) return;

  const title = header.getAttribute('data-title') || 'Panel';
  const actionLabel = header.getAttribute('data-action-label');
  const actionHref = header.getAttribute('data-action-href') || '#';
  const showProfile = header.getAttribute('data-profile') === 'true';

  let rightSide = '';

  if (showProfile) {
    rightSide = `
      <div class="user-profile">
        <span>Admin</span>
        <div class="avatar">DA</div>
      </div>
    `;
  } else if (actionLabel) {
    rightSide = `
      <div class="actions">
        <a href="${actionHref}" class="btn-primary">${actionLabel}</a>
      </div>
    `;
  }

  header.innerHTML = `
    <h1 class="page-title">${title}</h1>
    ${rightSide}
  `;
})();
