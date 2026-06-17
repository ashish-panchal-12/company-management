// GLOBAL notification and helper
function showNotification(message, type = "success") {
  let note = document.querySelector(".notification");
  if (!note) {
    note = document.createElement("div");
    note.className = "notification";
    document.body.appendChild(note);
  }
  note.className = `notification ${type}`;
  note.textContent = message;
  note.style.display = "block";
  note.style.opacity = "1";
  note.style.transform = "translateY(0)";
  setTimeout(() => {
    note.style.opacity = "0";
    note.style.transform = "translateY(-20px)";
    setTimeout(() => (note.style.display = "none"), 400);
  }, 2500);
}

async function sendRequest(url, method='GET', formData=null) {
  try {
    const opts = { method };
    if (formData) opts.body = formData;
    const res = await fetch(url, opts);
    const json = await res.json();
    if (json.success === true) showNotification(json.message || 'Success', 'success');
    else if (json.success === false && json.message) showNotification(json.message, 'error');
    return json;
  } catch (err) {
    showNotification('Server error: ' + err.message, 'error');
    return { success:false, message: err.message };
  }
}

// nav highlight (works if nav links present)
document.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
});
