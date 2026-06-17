// projects.js

let projEditId = null;
const projModal = document.getElementById('projModal');
const projName = document.getElementById('projName');
const projDept = document.getElementById('projDept');
const projStart = document.getElementById('projStart');
const projEnd = document.getElementById('projEnd');
const projStatus = document.getElementById('projStatus');
const projSave = document.getElementById('projSave');
const projCancel = document.getElementById('projCancel');

// -------------------- Modal Functions --------------------
function openProjModal(addMode = true) {
  projEditId = null;
  projName.value = '';
  projDept.value = '';
  projStart.value = '';
  projEnd.value = '';
  projStatus.value = 'Ongoing';
  document.getElementById('projModalTitle').innerText = addMode ? 'Add Project' : 'Edit Project';
  projModal.style.display = 'flex';
}

function closeProjModal() {
  projModal.style.display = 'none';
}

document.getElementById('openAddProj').addEventListener('click', () => openProjModal(true));
projCancel.addEventListener('click', closeProjModal);

// -------------------- Load Projects --------------------
async function loadProjects() {
  try {
    const res = await fetch('php/projects.php');
    const data = await res.json();

    const tbody = document.querySelector('#projectTable tbody');
    tbody.innerHTML = '';

    data.forEach(p => {
      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.department_id ?? 'N/A'}</td>
          <td>${p.start_date ?? ''}</td>
          <td>${p.end_date ?? ''}</td>
          <td>${p.status}</td>
          <td>
            <button class="primary" onclick="editProject(${p.id}, '${escapeHtml(p.name)}', '${p.department_id ?? ''}', '${p.start_date ?? ''}', '${p.end_date ?? ''}', '${p.status}')">Edit</button>
            <button class="danger" onclick="deleteProject(${p.id})">Delete</button>
          </td>
        </tr>
      `);
    });
  } catch (err) {
    console.error('Error loading projects:', err);
    alert('Failed to load projects.');
  }
}

// -------------------- Save Project --------------------
projSave.addEventListener('click', async () => {
  const name = projName.value.trim();
  if (!name) return alert('Project name is required.');

  const form = new FormData();
  form.append('name', name);
  form.append('department_id', projDept.value.trim());
  form.append('start_date', projStart.value.trim());
  form.append('end_date', projEnd.value.trim());
  form.append('status', projStatus.value);

  if (projEditId) {
    form.append('action', 'update');
    form.append('id', projEditId);
  } else {
    form.append('action', 'add');
  }

  try {
    const res = await fetch('php/projects.php', {
      method: 'POST',
      body: form
    });

    let result;
try {
  result = await res.json();
} catch (e) {
  const text = await res.text();
  console.error('Invalid JSON from server:', text);
  alert('❌ Server returned invalid response. Check console (Ctrl+Shift+J).');
  return;
}

    if (result.success) {
      alert(result.message);
      closeProjModal();
      loadProjects();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (err) {
    console.error('Save error:', err);
    alert('Server error while saving project.');
  }
});

// -------------------- Edit Project --------------------
function editProject(id, name, deptId, start, end, status) {
  projEditId = id;
  projName.value = unescapeHtml(name);
  projDept.value = deptId;
  projStart.value = start;
  projEnd.value = end;
  projStatus.value = status;
  document.getElementById('projModalTitle').innerText = 'Edit Project';
  projModal.style.display = 'flex';
}

// -------------------- Delete Project --------------------
async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;

  const form = new FormData();
  form.append('action', 'delete');
  form.append('id', id);

  try {
    const res = await fetch('php/projects.php', {
      method: 'POST',
      body: form
    });

    const result = await res.json();
    if (result.success) {
      alert('Project deleted successfully.');
      loadProjects();
    } else {
      alert('Delete failed: ' + result.message);
    }
  } catch (err) {
    console.error('Delete error:', err);
    alert('Server error while deleting project.');
  }
}

// -------------------- Helpers --------------------
function escapeHtml(s) {
  return String(s ?? '')
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "\\n");
}
function unescapeHtml(s) {
  return String(s ?? '')
    .replace(/\\'/g, "'")
    .replace(/\\n/g, "\n")
    .replace(/&quot;/g, '"');
}

// Close modal on background click
window.addEventListener('click', (e) => {
  if (e.target === projModal) closeProjModal();
});

// Load projects on page load
document.addEventListener('DOMContentLoaded', loadProjects);
