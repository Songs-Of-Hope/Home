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
function openDetails(hostage) {
    localStorage.setItem('hos',JSON.stringify(hostage))
    window.location.href="./details.html";
//     hostage=JSON.parse(localStorage.getItem("hos"))
//     text = hostage.lyrics.replace(/__OPEN__/g, '[').replace(/__CLOSE__/g, ']');
//     document.getElementById("modalImage").src = hostage.imageLink
//     document.getElementById('modalTitle').innerText = hostage.hostageName;
//     document.getElementById('modalTitle').innerHTML += `<div id="liked" onclick="likeOrDis(${hostage._id})">❤️</div><div id="count">${hostage.likesCount} אנשים אהבו</div>`;

//     document.getElementById('description').innerText = hostage.description;
//     if (hostage.returned == true && hostage.returned2 == false) {
//         var parts = hostage.hostageName.split(" ");
//         if (parts.length > 1) {
//             // var lastName = parts[1];
//             var lastName = parts[1].substring(1);
//             // return firstName + " " + newLastName;
//             // console.log(lastName);
//             if (hostage.returned2 != true && hostage.died)
//                 document.getElementById('description').innerText += `\n 💔${lastName}   הוחזר בתאריך ${hostage.returnDate}💔`
//             else if (hostage.died)
//                 document.getElementById('description').innerText += `\n 💔${lastName}   הוחזרו בתאריך ${hostage.returnDate}💔`
//             else
//                 document.getElementById('description').innerText += `\n 💛${lastName}   חזר בתאריך ${hostage.returnDate}💛`
//             document.getElementById("modalImage").className += 'returnImg'
//             document.getElementById('modalTitle').innerText = hostage.hostageName + " , " + lastName + " חזר הביתה";

//         }

//     }
//     else if (hostage.returned == true) {
//         document.getElementById("modalImage").className += 'returnImg'
//         if (hostage.died) {
//             const messages = [
//                 hostage.hostageName + ", הלב שבור 💔",
//                 hostage.hostageName + ", חסרים לנו כל כך 😢",
//                 hostage.hostageName + ", תמיד בכאב 🖤",
//                 hostage.hostageName + ", כל כך כואב לנו 😔",
//                 hostage.hostageName + ", נשמות טהורות, לא נשכח 🕊️",
//                 hostage.hostageName + ", געגועים אינסופיים 😞",
//                 hostage.hostageName + ", לא מצליחים להפסיק לבכות 😭",
//                 hostage.hostageName + ", כל כך קשה להאמין 💔"
//             ];
//             document.getElementById('modalTitle').innerText = messages[Math.floor(Math.random() * messages.length)];
//             if (!hostage.returned2)
//                 document.getElementById('description').innerText += `\n 💔${hostage.hostageName}   הוחזר בתאריך ${hostage.returnDate}💔`
//             else
//                 document.getElementById('description').innerText += `\n 💔${hostage.hostageName}   הוחזרו בתאריך ${hostage.returnDate}💔`

//         }
//         else {
//             document.getElementById('description').innerText += `\n💛 חזר בתאריך ${hostage.returnDate}💛`
//             document.getElementById('modalTitle').innerText = hostage.hostageName + ", חזר הביתה";

//         }

//     }
//     document.getElementById('btn').onclick = () => {
//         copySong(text)
//     };
//     document.getElementById('modalText').innerHTML = text.replace(/\n/g, '<br>');
//     if (hostage.audioLink === '***') {
//         document.getElementById('modalAudio').style.opacity = '0';
//         document.getElementById('notExist').innerHTML = 'השיר לא נוצר עדיין בmp3. אולי את/ה תתנדב/י ליצור אותו?'

//     }
//     else
//         document.getElementById('modalAudio').src = hostage.audioLink;

//     // if (hostage.returned)
//     //     document.getElementById('modalTitle').innerText = hostage.hostageName + ", חזר הביתה";

//     var downloadBtn = document.getElementById('downloadBtn');
//     downloadBtn.addEventListener('click', function () {

//         if (hostage.audioLink) {
//             var link = document.createElement('a');
//             link.href = hostage.audioLink;
//             link.download = hostage.name + '.mp3';
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } else {
//             alert("אין קובץ להורדה.");
//         }
//     });
//     document.getElementById('detailsModal').style.display = 'block';
}