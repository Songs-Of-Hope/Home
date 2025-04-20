// const basicUrl = "http://localhost:3000";
const basicUrl = "https://hostagesserver.onrender.com";
var hostage

window.onload = () => {
    openDetails()
}

function acceptDisclaimer() {
  localStorage.setItem("disclaimerAccepted", "true");
  popup.style.display = "none";
}
function closeDisclaimer() {
    localStorage.setItem("disclaimerAccepted", "true");
    document.getElementById("legal-disclaimer-popup").style.display = "none";
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
                hostage.hostageName + ", הלב שלנו שבור",
                hostage.hostageName + ", אנחנו חושבים עליך",
                hostage.hostageName + ", לעד נזכור"
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
        if (hostage.audioLink === '***') {
        document.getElementById('modalAudio').style.opacity = '0';
        document.getElementById('notExist').innerHTML = 'השיר לא נוצר עדיין בmp3. אולי את/ה תתנדב/י ליצור אותו?'

    }
    else
        document.getElementById('modalAudio').src = hostage.audioLink;

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
    document.getElementById('btn').onclick = () => {
        copySong(text)
    };
    document.getElementById('modalText').innerHTML = text.replace(/\n/g, '<br>');
    // ******************
    renderComments()
    displayComments()
}
function renderComments() {
    const modalTextElement = document.getElementById('modalText');
    const sanitizedSong = DOMPurify.sanitize(text).replace(/\n/g, '<br>');
    const commentsHtml = hostage.comments?.map(comment => {
        console.log(comment.createdAt);
        
        const time = new Date(comment.createdAt).toLocaleString();
        const cleanComment = DOMPurify.sanitize(comment.text);
        return `
        <div class="commenti">
        ${cleanComment}
        <small style="color: gray;" class="date">${time}</small>
        </div>
        `;
    }).join('');

    const commentFormHtml = `
      <div class="comment-form">
<textarea id="commentInput" placeholder="המסר שלכם – לחטוף, למשפחתו או על השיר – חשוב ונוגע. שתפו אותנו"></textarea>
        <button class="response" onclick="submitComment(${hostage._id})">שלח תגובה</button>
      </div>
    `;
    
    const fullHtml = `
      <div class="song-text">${sanitizedSong}</div>
      <div class="comment-section"><h3 style="margin-bottom:-50px">כאן אפשר להשאיר לב❤️:<div style="font-size:15px">שימו לב, כולם רואים את ההודעות של כולם</div></h3>${commentFormHtml}${commentsHtml ||'<p>אין תגובות עדיין, היה הראשון להגיב.</p>'}</div>
    `;

    modalTextElement.innerHTML = fullHtml;
    const textarea = document.getElementById('commentInput');
const popup = document.getElementById('legal-disclaimer-popup');

textarea.addEventListener('focus', () => {

      const popup = document.getElementById("legal-disclaimer-popup");
    const accepted = localStorage.getItem("disclaimerAccepted");
  
    if (!accepted && popup) {
      setTimeout(() => {
        popup.style.display = "flex";
      }, 1000); // 3 שניות
    }
});

}


async function submitComment(objId) {
    const input = document.getElementById('commentInput');
    const rawComment = input.value.trim();

    if (!rawComment) {
        alert("נא להזין תגובה.");
        return;
    }

    // סינון הקלט ב-DOMPurify
    const cleanComment = DOMPurify.sanitize(rawComment);

    try {
        const response = await fetch(`${basicUrl}/api/documents/addComment/${objId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment: cleanComment })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification("התגובה נשלחה בהצלחה💛");
            input.value = "";
            // hostage = JSON.parse(localStorage.getItem("hos"))
            const now = Date.now()
            if (hostage.comments)
                hostage.comments.push({ text: cleanComment, createdAt: new Date() })
            else
                hostage.comments = [{ text: cleanComment, createdAt: new Date() }]
            localStorage.setItem("hos", JSON.stringify(hostage))
            // console.log(response.comments);

            if (data.comments) {
                renderComments(data.comments);
            }
        } else {
            alert("שגיאה: " + data.message);
        }

    } catch (error) {
        console.error("שגיאה בשליחת תגובה:", error);
        alert("אירעה שגיאה.");
    }
    renderComments()
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
            btn.dir = 'trl'
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
        if (hostage.tags)
            hostage.tags.push(tag)
        else
            hostage.tags = [tag]
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
            {
                console.log('התרחשה שגיאה');
                return
            }
        
    }
    const response = await fetch(`${basicUrl}/api/documents/edit/${hostage._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hostage.tags)
    }).catch(err=>{
        console.log('error occured:',err);
    })
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
            commentElement.dir = 'rtl'
            commentElement.className = 'comment'
            commentElement.innerHTML = comment;
            commentsElement.appendChild(commentElement);
        }
    })
    if (comments.length > 5)
        commentsElement.innerHTML += `<span class="loadMore">+ ${comments.length - 5}</span>`
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