const uploadFile = document.getElementById('file-upload');
const previewContainer = document.getElementById('video-preview');
const previewVideo = document.getElementById('video-preview-video');
const previewText = document.getElementById('video-preview-text');

uploadFile.addEventListener('change', function() {
    const file = this.files[0];

    if(file){
        const reader = new FileReader();

        previewText.style.display = "none";
        previewVideo.style.display = "block";

        reader.addEventListener("load", function(){
            previewVideo.setAttribute("src", this.result);
        });

        reader.readAsDataURL(file);
    }
});
