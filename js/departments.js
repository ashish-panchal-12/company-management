// departments.js
let deptEditId = null;
const deptModal = document.getElementById('deptModal');
const deptName = document.getElementById('deptName');
const deptDesc = document.getElementById('deptDesc');
const deptSave = document.getElementById('deptSave');
const deptCancel = document.getElementById('deptCancel');

async function loadDepartments(){
  const res = await fetch('php/departments.php');
  const data = await res.json();
  const tbody = document.querySelector("#departmentTable tbody");
  tbody.innerHTML = '';
  data.forEach(dep => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${dep.id}</td>
        <td>${dep.name}</td>
        <td>${dep.description ?? ''}</td>
        <td>
          <button class="primary" onclick="editDepartment(${dep.id}, '${escapeHtml(dep.name)}', '${escapeHtml(dep.description || '')}')">Edit</button>
          <button class="danger" onclick="deleteDepartment(${dep.id})">Delete</button>
        </td>
      </tr>
    `);
  });
}

function openDeptModal(addMode=true){
  deptEditId = null;
  deptModal.style.display = 'flex';
  deptName.value = '';
  deptDesc.value = '';
  document.getElementById('deptModalTitle').innerText = addMode ? 'Add Department' : 'Edit Department';
}

function closeDeptModal(){ deptModal.style.display = 'none'; }

document.getElementById('openAddDept').addEventListener('click', ()=> openDeptModal(true));
deptCancel.addEventListener('click', closeDeptModal);
deptSave.addEventListener('click', async ()=> {
  const name = deptName.value.trim();
  if (!name) return alert('Name required');
  const desc = deptDesc.value.trim();
  const form = new FormData();
  form.append('name', name);
  form.append('description', desc);
  if (deptEditId) {
    form.append('action', 'update');
    form.append('id', deptEditId);
  } else form.append('action', 'add');

  const res = await sendRequest('php/departments.php', 'POST', form);
  if (res.success) {
    closeDeptModal();
    loadDepartments();
  }
});

async function editDepartment(id, name, desc){
  deptEditId = id;
  deptName.value = unescapeHtml(name);
  deptDesc.value = unescapeHtml(desc);
  document.getElementById('deptModalTitle').innerText = 'Edit Department';
  deptModal.style.display = 'flex';
}

async function deleteDepartment(id){
  if (!confirm('Delete department?')) return;
  const form = new FormData();
  form.append('action','delete');
  form.append('id', id);
  const res = await sendRequest('php/departments.php', 'POST', form);
  if (res.success) loadDepartments();
}

// utils to help escaping single quotes inside inline onclick
function escapeHtml(s) {
  return String(s).replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/\n/g, "\\n");
}
function unescapeHtml(s){
  return String(s).replace(/\\'/g, "'").replace(/\\n/g, "\n").replace(/&quot;/g, '"');
}

window.addEventListener('click', (e)=> { if (e.target === deptModal) closeDeptModal(); });
document.addEventListener('DOMContentLoaded', loadDepartments);
