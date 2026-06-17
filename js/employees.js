// employees.js
let empEditId = null;
const empModal = document.getElementById('empModal');
const empName = document.getElementById('empName');
const empEmail = document.getElementById('empEmail');
const empPhone = document.getElementById('empPhone');
const empDept = document.getElementById('empDept');
const empPosition = document.getElementById('empPosition');
const empSalary = document.getElementById('empSalary');
const empDate = document.getElementById('empDate');
const empSave = document.getElementById('empSave');
const empCancel = document.getElementById('empCancel');

function openEmpModal(addMode=true){
  empEditId = null;
  empModal.style.display = 'flex';
  empName.value = empEmail.value = empPhone.value = empDept.value = empPosition.value = empSalary.value = empDate.value = '';
  document.getElementById('empModalTitle').innerText = addMode ? 'Add Employee' : 'Edit Employee';
}

function closeEmpModal(){ empModal.style.display = 'none'; }

document.getElementById('openAddEmp').addEventListener('click', ()=> openEmpModal(true));
empCancel.addEventListener('click', closeEmpModal);

async function loadEmployees(){
  const res = await fetch('php/employees.php');
  const data = await res.json();
  const tbody = document.querySelector('#employeeTable tbody');
  tbody.innerHTML = '';
  data.forEach(emp => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${emp.id}</td>
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.phone ?? ''}</td>
        <td>${emp.department ?? 'N/A'}</td>
        <td>${emp.position ?? ''}</td>
        <td>${emp.salary ?? ''}</td>
        <td>${emp.date_joined ?? ''}</td>
        <td>
          <button class="primary" onclick="editEmployee(${emp.id}, '${escapeHtml(emp.name)}', '${escapeHtml(emp.email)}', '${emp.phone ?? ''}', '${emp.department_id ?? ''}', '${escapeHtml(emp.position ?? '')}', '${emp.salary ?? ''}', '${emp.date_joined ?? ''}')">Edit</button>
          <button class="danger" onclick="deleteEmployee(${emp.id})">Delete</button>
        </td>
      </tr>
    `);
  });
}

empSave.addEventListener('click', async ()=>{
  const name = empName.value.trim();
  const email = empEmail.value.trim();
  if (!name || !email) return alert('Name and email required');
  const form = new FormData();
  form.append('name', name);
  form.append('email', email);
  form.append('phone', empPhone.value.trim());
  form.append('department_id', empDept.value.trim());
  form.append('position', empPosition.value.trim());
  form.append('salary', empSalary.value.trim());
  form.append('date_joined', empDate.value.trim());

  if (empEditId) {
    form.append('action','update');
    form.append('id', empEditId);
  } else form.append('action','add');

  const res = await sendRequest('php/employees.php', 'POST', form);
  if (res.success) { closeEmpModal(); loadEmployees(); }
});

function editEmployee(id, name, email, phone, deptId, position, salary, dateJoined){
  empEditId = id;
  empName.value = unescapeHtml(name);
  empEmail.value = unescapeHtml(email);
  empPhone.value = phone;
  empDept.value = deptId;
  empPosition.value = unescapeHtml(position);
  empSalary.value = salary;
  empDate.value = dateJoined;
  document.getElementById('empModalTitle').innerText = 'Edit Employee';
  empModal.style.display = 'flex';
}

async function deleteEmployee(id){
  if (!confirm('Delete this employee?')) return;
  const form = new FormData();
  form.append('action','delete');
  form.append('id', id);
  const res = await sendRequest('php/employees.php', 'POST', form);
  if (res.success) loadEmployees();
}

function escapeHtml(s) { return String(s ?? '').replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/\n/g, "\\n"); }
function unescapeHtml(s) { return String(s ?? '').replace(/\\'/g, "'").replace(/\\n/g, "\n").replace(/&quot;/g, '"'); }

window.addEventListener('click', (e)=> { if (e.target === empModal) closeEmpModal(); });
document.addEventListener('DOMContentLoaded', loadEmployees);
