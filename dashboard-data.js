const formatCurrency = (value) => `€${Number(value || 0).toLocaleString('es-ES')}`;

const setText = (id, value) => {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
};

const fetchJson = async (url) => {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Error ${response.status} en ${url}`);
  return response.json();
};

const getStatusClass = (status) => {
  if (status === 'Revisión') return 'status-pending';
  return 'status-active';
};

const loadDashboard = async () => {
  const [summary, projects] = await Promise.all([
    fetchJson('/api/dashboard/summary'),
    fetchJson('/api/projects'),
  ]);

  setText('kpiRevenue', formatCurrency(summary.monthlyRevenue));
  setText('kpiProjects', summary.activeProjects);
  setText('kpiTickets', summary.pendingTickets);
  setText('kpiConversion', `${summary.conversionRate}%`);

  const tbody = document.getElementById('projectsRows');
  if (!tbody) return;

  tbody.innerHTML = projects.items
    .slice(0, 5)
    .map(
      (item) => `
        <tr>
          <td>${item.client}</td>
          <td>${item.project}</td>
          <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>
          <td>${item.delivery || '-'}</td>
          <td>${formatCurrency(item.value)}</td>
        </tr>
      `
    )
    .join('');
};

const loadClients = async () => {
  const data = await fetchJson('/api/clients');
  const tbody = document.getElementById('clientsRows');
  if (!tbody) return;

  tbody.innerHTML = data.items
    .map(
      (item) => `
        <tr class="clickable" onclick="window.location.href='client-details.html'">
          <td><strong>${item.name}</strong></td>
          <td>${item.contact}</td>
          <td>${item.email}</td>
          <td>${item.activeProjects}</td>
          <td><span class="status-badge ${item.status === 'Pendiente Pago' ? 'status-pending' : 'status-active'}">${item.status}</span></td>
          <td>→</td>
        </tr>
      `
    )
    .join('');
};

const loadEvents = async () => {
  const data = await fetchJson('/api/events/upcoming');
  const container = document.getElementById('upcomingEvents');
  if (!container) return;

  const items = data.items
    .slice(0, 5)
    .map((event) => {
      const date = new Date(event.eventTime);
      const label = Number.isNaN(date.getTime())
        ? event.eventTime
        : `${date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

      return `
        <div class="event-item">
          <div class="event-time">${label}</div>
          <div class="event-title">${event.title}</div>
          <div class="event-desc">${event.description}</div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = `
    <h3 class="section-title">Próximos Eventos</h3>
    ${items}
  `;
};

const loadFinance = async () => {
  const data = await fetchJson('/api/finance/summary');
  setText('finMrr', formatCurrency(data.mrr));
  setText('finMargin', `${data.margin}%`);
  setText('finCashWeeks', `${data.cashWeeks} sem`);
};

const safeRun = async (fn) => {
  try {
    await fn();
  } catch (error) {
    console.error('Error cargando datos reales:', error);
  }
};

const path = window.location.pathname;

if (path.endsWith('/dashboard.html')) safeRun(loadDashboard);
if (path.endsWith('/clients.html')) safeRun(loadClients);
if (path.endsWith('/agenda.html')) safeRun(loadEvents);
if (path.endsWith('/finanzas.html')) safeRun(loadFinance);
