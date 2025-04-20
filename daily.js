// const basicUrl = "http://localhost:3000";
const basicUrl = "https://hostagesserver.onrender.com";

const taskBtn = document.getElementById('markDoneBtn');
const celebrationMsg = document.getElementById('celebrationMessage');

function loadTaskData() {
  fetch(`${basicUrl}/api/daily/today`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('taskText').textContent = "המשימה היומית: "+data.taskText;
      updateProgressBar(data.completions, data.goal);

      if (localStorage.getItem("taskCompleted") === data.date) {
        markAsCompletedUI();
      }

      if (data.completions >= data.goal) {
        showCelebrationMessage();
      }
    });

  fetch(`${basicUrl}/api/daily/get-global`)
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      let count=0
      data.allTasks.forEach(element => {
        if(element.completions>=element.goal)
          count++
      });
      document.getElementById('successStats').textContent = `ימים שהגענו ליעד: ${count}`;
      displayCalender(data.allTasks)
    });
}

function displayCalender(allTasksArray) {
  console.log(allTasksArray);
  
  const calendarContainer = document.querySelector('.calender');
  calendarContainer.innerHTML = ''; // מנקה תוכן קודם

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const todayStr = now.toDateString();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // Sunday = 0

  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  // יצירת מפת תאריכים: { '2025-04-15': { taskText: 'משימה', completedGoalDates: [] }, ... }
  const taskMap = {};
  allTasksArray.forEach(task => {
    taskMap[task.date] = task;
  });

  // יצירת כותרות הימים
  dayNames.forEach(name => {
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.textContent = name;
    calendarContainer.appendChild(header);
  });

  // רווחים ריקים לפני היום הראשון
  for (let i = 0; i < startDayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day';
    calendarContainer.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const currentDate = new Date(year, month, day);
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const formattedDisplayDate = currentDate.toDateString();

    const taskForDay = taskMap[dateKey];
    const isToday = formattedDisplayDate === todayStr;
    const isShabbat = currentDate.getDay() === 6;

    let isCompleted = false;
    let tooltipText = 'אין משימה ליום זה';

    if (taskForDay) {
      tooltipText = taskForDay.taskText;
      if (taskForDay.completedGoalDates.includes(dateKey)) {
        isCompleted = true;
      } else {
        isCompleted = false;
      }
    }

    if (isShabbat) {
      tooltipText = 'שבת שלום!';
    }

    const dayElement = document.createElement('div');
    dayElement.className = `calendar-day ${isShabbat ? 'shabbat' : isCompleted ? 'completed' : 'missed'} ${isToday ? 'today' : ''}`;
    dayElement.setAttribute('data-tooltip', tooltipText);

    dayElement.innerHTML = `
      <div class="date">${day}</div>
      <div class="icon">${isShabbat ? '' : isCompleted ? '💛' : '❌'}</div>
    `;

    calendarContainer.appendChild(dayElement);
  }
}

function updateProgressBar(completed, goal) {
  const percent = (completed / goal) * 100;
  document.getElementById('progressBar').style.width = `${percent}%`;
  document.getElementById('progressText').textContent = `${completed} מתוך ${goal} כבר השלימו היום 🙌`;
}

function markTaskDone() {
  if (taskBtn.classList.contains('completed')) return;

  fetch(`${basicUrl}/api/daily/done`, { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      updateProgressBar(data.completions, data.goal);
      localStorage.setItem("taskCompleted", data.date);
      checkdailyTask()
      
      markAsCompletedUI();
      fireConfetti();

      if (data.completions >= data.goal) {
        showCelebrationMessage();
      }
    });
}

function markAsCompletedUI() {
  taskBtn.textContent = 'כבר השלמת 🙏';
  taskBtn.classList.add('completed');
  taskBtn.disabled = true;
}

function showCelebrationMessage() {
  celebrationMsg.classList.remove('hidden');
}

function fireConfetti() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#FFDF0E', '#ffffff', '#ff0000']
  });
}

window.onload = loadTaskData;
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