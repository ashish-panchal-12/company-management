// attendance.js
let attEditId = null;
const attModal = document.getElementById('attModal');
const attEmp = document.getElementById('attEmp');
const attDate = document.getElementById('attDate');
const attStatus = document.getElementById('attStatus');
const attSave = document.getElementById('attSave');
const attCancel = document.getElementById('attCancel');

function openAttModal(addMode=true){
  attEditId = null;
  attEmp.value = attDate.value = '';
  attStatus.value = 'Present';
  document.getElementById('attModalTitle').innerText = addMode ? 'Mark Attendance' : 'Edit Attendance';
  attModal.style.display = 'flex';
}
function closeAttModal(){ attModal.style.display = 'none'; }

document.getElementById('openAddAtt').addEventListener('click', ()=> openAttModal(true));
attCancel.addEventListener('click', closeAttModal);

async function loadAttendance(){
  const res = await fetch('php/attendance.php');
  const data = await res.json();
  const tbody = document.querySelector('#attendanceTable tbody');
  tbody.innerHTML = '';
  data.forEach(a => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${a.id}</td>
        <td>${a.employee ?? 'N/A'}</td>
        <td>${a.date}</td>
        <td>${a.status}</td>
        <td>
          <button class="primary" onclick="editAttendance(${a.id}, ${a.employee_id ?? 0}, '${a.date}', '${a.status}')">Edit</button>
          <button class="danger" onclick="deleteAttendance(${a.id})">Delete</button>
        </td>
      </tr>
    `);
  });
}

attSave.addEventListener('click', async ()=>{
  const emp_id = attEmp.value.trim();
  const date = attDate.value.trim();
  if (!emp_id || !date) return alert('Employee ID and date required');
  const form = new FormData();
  form.append('employee_id', emp_id);
  form.append('date', date);
  form.append('status', attStatus.value);
  if (attEditId) { form.append('action','update'); form.append('id', attEditId); }
  else form.append('action','mark');

  const res = await sendRequest('php/attendance.php', 'POST', form);
  if (res.success) { loadAttendance(); closeAttModal(); }
});

function editAttendance(id, employee_id, date, status){
  attEditId = id;
  attEmp.value = employee_id;
  attDate.value = date;
  attStatus.value = status;
  document.getElementById('attModalTitle').innerText = 'Edit Attendance';
  attModal.style.display = 'flex';
}

async function deleteAttendance(id){
  if (!confirm('Delete attendance record?')) return;
  const form = new FormData();
  form.append('action','delete');
  form.append('id', id);
  const res = await sendRequest('php/attendance.php', 'POST', form);
  if (res.success) loadAttendance();
}

window.addEventListener('click', (e)=> { if (e.target === attModal) closeAttModal(); });
document.addEventListener('DOMContentLoaded', loadAttendance);
