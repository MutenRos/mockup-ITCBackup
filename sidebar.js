(function () {
  const sidebar = document.querySelector('.sidebar[data-page]');
  if (!sidebar) return;

  const currentPage = sidebar.getAttribute('data-page');

  const items = [
    { key: 'dashboard', href: 'erp/index.html', icon: '📊', label: 'Dashboard' },
    { key: 'agenda', href: 'agenda.html', icon: '📅', label: 'Agenda' },
    { key: 'clientes', href: 'clients.html', icon: '👥', label: 'Clientes' },
    { key: 'proyectos', href: 'proyectos.html', icon: '🚀', label: 'Proyectos' },
    { key: 'finanzas', href: 'finanzas.html', icon: '💰', label: 'Finanzas' },
    { key: 'configuracion', href: 'configuracion.html', icon: '⚙️', label: 'Configuración' },
    { key: 'suite', href: 'suite.html', icon: '🏢', label: 'Suite ERP' }
  ];

  const navHtml = items
    .map((item) => {
      const active = item.key === currentPage ? ' active' : '';
      return `<a href="${item.href}" class="nav-item${active}"><span>${item.icon}</span> ${item.label}</a>`;
    })
    .join('');

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <div class="logo-text">Integra Tech</div>
    </div>
    <nav>${navHtml}</nav>
    <div style="margin-top: auto;">
      <a href="index.html" class="nav-item"><span>⬅️</span> Volver a Web</a>
    </div>
  `;
})();
