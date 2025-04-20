let hostages = [];
hostages = JSON.parse(localStorage.getItem('hostagesNow'))
// const apiBase = "http://localhost:3000/api/deeds";
const apiBase = "https://hostagesserver.onrender.com/api/deeds";
async function fetchDeeds() {
  try {
    const res = await fetch(`${apiBase}/all`);
    const deeds = await res.json();
    displayDeeds(deeds);
    updateTotal(deeds);
  } catch (err) {
    console.error("שגיאה בקבלת המעשים:", err);
  }
}

function displayDeeds(deeds) {
  const container = document.getElementById("deedsContainer");
  container.innerHTML = "";
  deeds.forEach(deed => {
    const card = document.createElement("div");
    card.className = "deed-card";
    card.innerHTML = `
        <img src="${deed.imageLink}" alt="תמונה של ${deed.description}" />
        <h3>${deed.description}</h3>
        <p>נבחר על ידי <strong>${deed.addedCount}</strong> אנשים</p>
        <button onclick="addDeed(${deed._id})">לקחתי על עצמי</button>
      `;
    container.appendChild(card);
  });
}

async function addDeed(id) {
  try {
    const res = await fetch(`${apiBase}/edit/${id}`, {
      method: 'PUT',
    });
    if (res.ok) {
      fetchDeeds();
      showSuccessAnimation(); // <<< הוספנו קריאה לפונקציית אנימציה
    } else {
      alert("לא הצלחנו לעדכן את המעשה. נסו שוב.");
    }
  } catch (err) {
    console.error("שגיאה בעדכון המעשה:", err);
  }
}

function showSuccessAnimation() {
  const msg = document.getElementById("successMessage");
  const img = document.getElementById('img')
  let randomHostage = hostages[Math.floor(Math.random() * hostages.length)];
  while( randomHostage.died==true||randomHostage.returned==true){
    randomHostage = hostages[Math.floor(Math.random() * hostages.length)];
  }
  img.src = randomHostage.imageLink
  msg.classList.remove("hidden");
  msg.classList.add("show");

  setTimeout(() => {
    msg.classList.remove("show");
    setTimeout(() => {
      msg.classList.add("hidden");
    }, 300);
  }, 2000);
}

function updateTotal(deeds) {
  const total = deeds.reduce((sum, d) => sum + (d.addedCount || 0), 0);
  // document.getElementById("totalCount").innerText = `סה"כ קבלות: ${total}`;
  document.getElementById("totalCount").innerHTML = ` אין גבול לטוב – קבלות שהצטברו <span>בזכותכם</span>: ${total}🫶`;

  
}

fetchDeeds();
let currentIndex = 0;

function showNextHostage() {
  const hostage = hostages[currentIndex];
  document.getElementById("hostageImage").src = hostage.imageLink;
  document.getElementById("hostageImage").alt = `תמונה של ${hostage.hostageName}`;
  document.getElementById("hostageName").textContent = hostage.hostageName;

  currentIndex = (currentIndex + 1) % hostages.length;
}
function dailyTask() {
  window.location.href = "daily.html#daily-title";
}
function checkdailyTask() {
  let daily = localStorage.getItem('taskCompleted');
  const today = new Date().toISOString().split('T')[0];
  if (daily == null || daily !== today) {
      document.getElementById("bell").style.opacity = "1"
      bell.classList.add("glow-animation");

      // document.getElementById("dailyTask").style.animation="glow 1s infinite;"
  }
  else if (daily == today&&today!=null) {
      bell.classList.remove("glow-animation");

      // document.getElementById("bell").style.opacity = "0"
      document.getElementById("dailyTask").innerHTML='השלמת את המשימה היומית'
  }



}
checkdailyTask()
// תחלף כל 5 שניות
// showNextHostage();
// setInterval(showNextHostage, 5000);