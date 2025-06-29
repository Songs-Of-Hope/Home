
let hostages = []
let hostagesNow = []
let died = []
let returned = []

const basicLocalUrl = "http://localhost:3000";
const basicUrl = "https://hostagesserver.onrender.com";

currentHos = null
// let likesCount = getLikesCount()
window.onload = () => {
    getHostages()
     if (!sessionStorage.getItem('viewCounted')) {
      addView(); 
    //   sessionStorage.setItem('viewCounted', 'true');
    }
    console.log('loaded');
}
async function addView() {
    try {
        const response = await fetch(`${basicLocalUrl}/api/views/addView`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('View added:', data);
    } catch (error) {
        console.error('Error adding view:', error);
    }
}

async function getHostages() {
    try {
        let container = document.getElementById("hostages-container");
        container.innerHTML = `<h1 dir="rtl">טוען את הרשימה...</h1>`
        const response = await fetch(`${basicUrl}/api/documents/all`);
        container.innerHTML = ''
        hostages = await response.json();
        localStorage.setItem('hostages', JSON.stringify(hostages))
        returned = hostages.filter(doc => doc.died != true && doc.returned == true)
        localStorage.setItem('returned', JSON.stringify(returned))
        died = hostages.filter(doc => doc.died == true)
        localStorage.setItem('died', JSON.stringify(died))
        hostagesNow = hostages.filter(item => !returned.includes(item) && !died.includes(item));
        localStorage.setItem('hostagesNow', JSON.stringify(hostagesNow))
        displayDocuments(hostagesNow);
        displayDocuments(returned);
        displayDocuments(died);
    } catch (error) {
        if (!hostages) {
            console.log('error on get documents');

        }
    }
}

// async function getExistHostages() {
//     try {
//         const response = await fetch(`${basicUrl}/api/documents/exist`);
//         existHostages = await response.json();
//         localStorage.setItem('existHostages',JSON.stringify(existHostages))
//         displayDocuments(existHostages);
//     } catch (error) {
//         if (!existHostages) {
//             console.log('error on get documents');

//         }
//     }
// }
function displayDocuments(hostages) {
    let container = document.getElementById("hostages-container");
    // let hostages = getHostages();
    hostages.forEach(hostage => {
        let mainDiv = document.createElement("div");
        mainDiv.className = "hostage-card";
        if (hostage.died)
            mainDiv.className += " died";

        if (hostage.returned) {
            mainDiv.classList.add("returned-hostage"); // עיצוב ייחודי
        }

        mainDiv.onclick = () => { openDetails(hostage) };

        let div2 = document.createElement("div");
        div2.className = "icon";
        div2.innerHTML = hostage.returned ? "❤️" : "🎗️"; // החלפת אייקון
        if (hostage.died == true) {
            div2.innerHTML = "💔"
            div2.style.color = "red";
        }
        else if (hostage.returned && hostage.returned2 === false)
            div2.innerHTML = "🎗️❤️";

        let img = document.createElement("img");
        img.src = hostage.imageLink;
        img.className = "hostage-image";
        img.alt = hostage.hostageName;

        let h3 = document.createElement("h3");
        h3.textContent = hostage.hostageName;
        h3.dir = "rtl";

        let span = document.createElement("span");
        span.className = "hear";
        span.textContent = "לשמיעת השיר";

        let i = document.createElement("i")
        i.className = "fas fa-play-circle hear";
        i.dir = "rtl";

        mainDiv.appendChild(div2);
        mainDiv.appendChild(img);
        mainDiv.appendChild(h3);

        if (hostage.died) {
            let diedText = document.createElement("p");
            diedText.className = "died-text";
            if (hostage.returned2)
                diedText.textContent = "השם יקום דמם 🕯️";
            else
                diedText.textContent = "השם יקום דמו 🕯️";

            diedText.dir = "rtl";
            mainDiv.appendChild(diedText);
        }
        else if (hostage.returned) {
            let returnedText = document.createElement("p");
            returnedText.className = "returned-text";
            returnedText.textContent = " חזר אלינו הביתה!";
            if (hostage.returned && hostage.returned2 === false)
                returnedText.textContent = "יאיר חזר אלינו הביתה!";
            returnedText.dir = "rtl";
            mainDiv.appendChild(returnedText);
        }

        mainDiv.appendChild(span);
        mainDiv.appendChild(i);
        container.appendChild(mainDiv);
    });
}

function closeModal() {
    window.location.href = "./index.html";
}
function openDetails(hostage) {
    localStorage.setItem('hos', JSON.stringify(hostage))
    window.location.href = "./details.html";
}
function dailyTask() {
    window.location.href = "daily.html#daily-title";
}
function checkdailyTask() {
    let daily = localStorage.getItem('taskCompleted');
    const today = new Date().toISOString().split('T')[0];



    let bell = document.getElementById('bell')

    if (daily == null || daily !== today) {
        bell.classList.add("glow-animation");
    }
    else if (daily == today && today != null) {
        bell.classList.remove("glow-animation");
        // bell.innerText='✔'
        document.getElementById("dailyTask").innerHTML = 'השלמת את המשימה היומית'
    }
    daily.setAttribute('data-tooltip', tooltipText);



}
checkdailyTask()