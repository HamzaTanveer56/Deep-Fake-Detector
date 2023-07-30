const uploading = document.getElementById("uploading");
const processing = document.getElementById("processing");
const errorMsg = document.getElementById("errorMsg");
const result = document.getElementById("result");

function uploadVideo() {
  const file = document.getElementById("file-upload").files[0];

  if (!file) {
    errorMsg.innerHTML = "Please select a video first!";
    return;
  }

  const fileSizeInBytes = file.size;
  const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

  if (fileSizeInMB > 25) {
    errorMsg.innerHTML = "Sorry! we cannot process video above 25Mbs at the moment";
    return;
  }

  uploading.style.display = "block";

  const formData = new FormData();
  formData.append('video', file);

  setTimeout(()=> {
    uploading.style.display = "none";
    processing.style.display = "block";
  
    fetch('/upload_video', {
      method: 'POST',
      body: formData
    }).then(
      res => {
        processing.style.display = "none";
        if (res.ok) {
          return res.json();
        } else {
          errorMsg.innerHTML = "Error! uploading video";
        }
      }
    ).then(
      res => {
        result.innerHTML = `${res.message}`;
      }
    ).catch(
      error => {
        console.error('Error uploading video:', error);
      }
    );
  },1000);

}
  
document.getElementById("file-upload-form").addEventListener("submit", e => {
  e.preventDefault();
  
  uploadVideo();
});