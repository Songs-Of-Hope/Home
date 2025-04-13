let hostages=[]
// const basicUrl = "http://localhost:3000";
const basicUrl = "https://hostagesserver.onrender.com";

currentHos=null
// let likesCount = getLikesCount()
window.onload = () => {
   getHostages()
}
async function getHostages(){
    try {
        const response = await fetch(`${basicUrl}/api/documents/all`);
        hostages = await response.json();

        displayDocuments(hostages);
    } catch (error) {
        if (!hostages) {
            console.log('error on get documents');

        }
    }
}
function displayDocuments(){
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
    localStorage.setItem('hos',JSON.stringify(hostage))
    window.location.href="./details.html";
}