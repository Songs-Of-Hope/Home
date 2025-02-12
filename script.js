function openDetails(name, text, audioSrc, imageSrc) {
    text = text.replace(/__OPEN__/g, '[').replace(/__CLOSE__/g, ']');
    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalText').innerHTML = text.replace(/\n/g, '<br>');

    document.getElementById('modalAudio').src = audioSrc;
    document.getElementById('modalImage').src = imageSrc;
    var downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', function () {

        if (audioSrc) {
            var link = document.createElement('a');
            link.href = audioSrc;  
            link.download = name + '.mp3';
            document.body.appendChild(link);  
            link.click();  
            document.body.removeChild(link); 
        } else {
            alert("אין קובץ להורדה.");
        }
    });
    document.getElementById('detailsModal').style.display = 'block';
}
function closeModal() {
    document.getElementById('detailsModal').style.display = 'none';
    document.getElementById('modalAudio').pause();  
    document.getElementById('modalAudio').currentTime = 0; 
}