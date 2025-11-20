document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const input = document.getElementById('new-task');
  const dateInput = document.getElementById('new-date');
  const categorySelect = document.getElementById('category');
  const list = document.getElementById('task-list');
  const filters = document.querySelector('.filters');
  const countEl = document.getElementById('task-count');
  const KEY = 'revou_tasks';

  let tasks = JSON.parse(localStorage.getItem(KEY) || '[]');
  let filter = 'all';
  render();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.push({
      id: Date.now(),
      text,
      due: dateInput.value || null,
      category: categorySelect.value || 'umum',
      done: false
    });
    input.value = ''; dateInput.value = ''; categorySelect.value = 'umum';
    save(); render();
  });

  list.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = Number(li.dataset.id);
    if (e.target.matches('.delete')) {
      tasks = tasks.filter(t => t.id !== id);
    } else if (e.target.matches('input[type="checkbox"]')) {
      const t = tasks.find(x => x.id === id);
      if (t) t.done = e.target.checked;
    }
    save(); render();
  });

  filters.addEventListener('click', e => {
    if (!e.target.matches('.filter-btn')) return;
    filter = e.target.dataset.filter;
    Array.from(filters.children).forEach(b => b.classList.toggle('active', b === e.target));
    render();
  });

  document.getElementById('clear-done').addEventListener('click', () => {
    tasks = tasks.filter(t => !t.done);
    save(); render();
  });

  function save(){ localStorage.setItem(KEY, JSON.stringify(tasks)); }

  function render(){
    const visible = tasks.filter(t => {
      if (filter === 'sekolah') return t.category === 'sekolah';
      if (filter === 'done') return t.done;
      return true;
    });
    list.innerHTML = visible.map(t => `
      <li data-id="${t.id}" class="task ${t.done ? 'done' : ''}">
        <input type="checkbox" ${t.done ? 'checked' : ''}/>
        <div class="meta">
          <span class="text">${escapeHtml(t.text)}</span>
          ${t.due ? `<small class="due">${formatDate(t.due)}</small>` : ''}
        </div>
        <span class="badge">${t.category === 'sekolah' ? 'Tugas Sekolah' : 'Umum'}</span>
        <button class="delete" title="Delete">✕</button>
      </li>
    `).join('');
    countEl.textContent = `${tasks.length} tasks`;
  }

  function formatDate(d){ return new Date(d + 'T00:00:00').toLocaleDateString(); }
  function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
});