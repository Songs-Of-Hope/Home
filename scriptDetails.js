// const basicUrl = "http://localhost:3000";
const basicUrl = "https://hostagesserver.onrender.com";
var hostage
window.onload = () => {
    openDetails()
}
function openDetails() {
    // localStorage.setItem('hos',JSON.stringify(hostage))
    // window.location.href="./all.html";
    hostage = JSON.parse(localStorage.getItem("hos"))
    text = hostage.lyrics.replace(/__OPEN__/g, '[').replace(/__CLOSE__/g, ']');
    document.getElementById("modalImage").src = hostage.imageLink
    document.getElementById('modalTitle').innerText = hostage.hostageName;
    document.getElementById('likedArea').innerHTML += `<div><i class="fas fa-thumbs-up"  id="liked" onclick="likeOrDis(${hostage._id})"></i></div><div id="count">${hostage.likesCount} אנשים אהבו</div>`;

    document.getElementById('description').innerText = hostage.description;
    document.getElementById("mailto").href = `mailto:?subject=הי, רציתי לשתף אותך באתר שגיליתי- הקדשת שיר לכל חטוף?body=${encodeURIComponent('אתר להעלאת המודעות לחטופים ע"י כתיבת שירים וביצועם \n https://songs-of-hope.github.io/Home/ \n האתר כולו נבנה ע"י קהילת prog.co.il , כולל כתיבת השירים וביצועם ')}`
    if (hostage.returned == true && hostage.returned2 == false) {
        var parts = hostage.hostageName.split(" ");
        if (parts.length > 1) {
            // var lastName = parts[1];
            var lastName = parts[1].substring(1);
            // return firstName + " " + newLastName;
            // console.log(lastName);
            if (hostage.returned2 != true && hostage.died)
                document.getElementById('description').innerText += `\n 💔${lastName}   הוחזר בתאריך ${hostage.returnDate}💔`
            else if (hostage.died)
                document.getElementById('description').innerText += `\n 💔${lastName}   הוחזרו בתאריך ${hostage.returnDate}💔`
            else
                document.getElementById('description').innerText += `\n 💛${lastName}   חזר בתאריך ${hostage.returnDate}💛`
            document.getElementById("modalImage").className += 'returnImg'
            document.getElementById('modalTitle').innerText = hostage.hostageName + " , " + lastName + " חזר הביתה";

        }

    }
    else if (hostage.returned == true) {
        document.getElementById("modalImage").className += 'returnImg'
        if (hostage.died) {
            const messages = [
                hostage.hostageName + ", הלב שבור 💔",
                hostage.hostageName + ", חסרים לנו כל כך 😢",
                hostage.hostageName + ", תמיד בכאב 🖤",
                hostage.hostageName + ", כל כך כואב לנו 😔",
                hostage.hostageName + ", נשמות טהורות, לא נשכח 🕊️",
                hostage.hostageName + ", געגועים אינסופיים 😞",
                hostage.hostageName + ", לא מצליחים להפסיק לבכות 😭",
                hostage.hostageName + ", כל כך קשה להאמין 💔"
            ];
            document.getElementById('modalTitle').innerText = messages[Math.floor(Math.random() * messages.length)];
            if (!hostage.returned2)
                document.getElementById('description').innerText += `\n 💔${hostage.hostageName}   הוחזר בתאריך ${hostage.returnDate}💔`
            else
                document.getElementById('description').innerText += `\n 💔${hostage.hostageName}   הוחזרו בתאריך ${hostage.returnDate}💔`

        }
        else {
            document.getElementById('description').innerText += `\n💛 חזר בתאריך ${hostage.returnDate}💛`
            document.getElementById('modalTitle').innerText = hostage.hostageName + ", חזר הביתה";

        }

    }
    document.getElementById('btn').onclick = () => {
        copySong(text)
    };
    document.getElementById('modalText').innerHTML = text.replace(/\n/g, '<br>');
    if (hostage.audioLink === '***') {
        document.getElementById('modalAudio').style.opacity = '0';
        document.getElementById('notExist').innerHTML = 'השיר לא נוצר עדיין בmp3. אולי את/ה תתנדב/י ליצור אותו?'

    }
    else
        document.getElementById('modalAudio').src = hostage.audioLink;

    // if (hostage.returned)
    //     document.getElementById('modalTitle').innerText = hostage.hostageName + ", חזר הביתה";

    var downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', function () {
        if (hostage.audioLink) {
            var link = document.createElement('a');
            link.href = hostage.audioLink;
            link.download = hostage.name + '.mp3';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("אין קובץ להורדה.");
        }
    });
    document.getElementById('detailsModal').style.display = 'block';
    displayComments()

}
function closeModal() {
    window.location.href = "./index.html";
}


async function likeOrDis(objId) {
    const response = await fetch(`${basicUrl}/api/documents/${objId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objId: objId })
    });
    const data = await response.json();

    // console.log(data);
    document.getElementById('count').innerHTML = `${data.doc.likesCount} אנשים אהבו`
    localStorage.setItem('hos', JSON.stringify(data.doc))
    // let message=
    if (!data.ok)
        showNotification('הסרת את הלייק!')
    else
        showNotification('תודה על התגובה🙏')

    // alert(`Help request status updated to ${helpRequest.status}\n"your Id for next time is:"${helpRequest._id}`);
}

function copySong() {
    const textToCopy = document.getElementById('modalText').innerText;
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            const btn = document.getElementById("btn");
            const originalText = btn.innerHTML;
            btn.innerHTML = "!!הועתק בהצלחה";

            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
            // document.getElementById("btn").innerHTML+=""
            // alert("מילות השיר הועתקו בהצלחה!");
        })
        .catch(err => {
            console.error('שגיאה בהעתקת הטקסט: ', err);
        });
}

async function send(tag) {
    let sended = JSON.parse(localStorage.getItem(`hos${hostage._id}`))
    // console.log(sended);

    if (!sended || sended.id != hostage._id) {
        // console.log('sended._id->'+sended.id,' hostage._id->',hostage._id);

        let objForSave = {
            id: hostage._id,
            tag: tag
        }
        localStorage.setItem(`hos${hostage._id}`, JSON.stringify(objForSave))
        hostage.tags.push(tag)
    }

    else {
        // console.log('sended==', sended.tag);
        let index = hostage.tags.indexOf(sended.tag)
        if (index >= 0) {
            hostage.tags[index] = tag
            // localStorage.setItem('afc', tag)
            let objForSave = {
                id: hostage._id,
                tag: tag
            }
            localStorage.setItem(`hos${hostage._id}`, JSON.stringify(objForSave))
        }
        else
            return
        // console.log(' כבר הגבת');
    }
    const response = await fetch(`${basicUrl}/api/documents/edit/${hostage._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hostage.tags)
    });
    const data = await response.json();
    // console.log(data);
    localStorage.setItem('hos', JSON.stringify(data))


    displayComments()
    // console.log(data);
    // localStorage.setItem('hos',JSON.stringify(data.doc))

}
function displayComments() {
    const commentsElement = document.getElementById('comments');
    commentsElement.innerHTML = ''
    let comments = hostage.tags

    comments.forEach((comment, index) => {
        if (index < 5) {
            const commentElement = document.createElement('span');
            commentElement.dir='rtl'
            commentElement.className = 'comment'
            commentElement.innerHTML = comment;
            commentsElement.appendChild(commentElement);
        }
    })
    if (comments.length > 5)
        commentsElement.innerHTML += `<span class="loadMore">+ ${comments.length-5}</span>`
    // comments.innerHTML = '';
}
function showNotification(message) {

    const container = document.getElementById("alert");
    const notificationContainer = document.createElement("div");
    notificationContainer.textContent = message;
    notificationContainer.className = "notification";

    container.appendChild(notificationContainer);

    setTimeout(() => {
        notificationContainer.classList.add("show");
    }, 100); //Adding a small delay to create an animation

    setTimeout(() => {
        notificationContainer.classList.remove("show");
        setTimeout(() => container.removeChild(notificationContainer), 300);
    }, 1000);
}