document.getElementById("btnSwitch").addEventListener("click", disableInputAndButton);
document.getElementById("sbt-btn").addEventListener("click", downloadVideo);
const result = document.getElementById('result-value');
const processing = document.getElementById('processing');

function disableInputAndButton() {
    if(!document.getElementById('btnSwitch').checked)
    {
        document.getElementById('text-url').disabled = true;
        document.getElementById('sbt-btn').disabled = true;
        document.getElementById('card').style.opacity = 0.75;
    }
    else
    {
        document.getElementById('text-url').disabled = false;
        document.getElementById('sbt-btn').disabled = false;
        document.getElementById('card').style.opacity = 1;
    }
}

function checkUrl(url) {
    if (url.includes("facebook") || url.includes("fb.watch") || url.includes("instagram") || url.includes("twitter"))
        return true;
    return false;
}

function downloadVideo() {
    const url = document.getElementById("text-url").value;

    if(url == "" || !checkUrl(url)){
        const response = document.getElementById('result-value');
        response.style.color = "#e74c3c";
        response.style.fontWeight = 600;
        response.innerHTML = "Invalid URL";
        return
    }

    const data = {
        "video_url": url
    };

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    
    result.style.display = "none";
    processing.style.display = "block";

    fetch("http://localhost:3000/download", options).then(
        res => {
            if(res.ok) {
                return res.json();
                console.log(1);
            }
        }
    ).then(
        res => {
            result.style.display = "block";
            result.style.textAlign = "center";
            processing.style.display = "none";
            console.log(2);
            if (res.accuracy) {
                if (res.message == 'Deep Fake') {
                    result.style.color = '#e74c3c';
                    result.innerHTML = `This is a ${res.message} video. AI is ${res.accuracy}% sure`;
                } else {
                    result.style.color = '#2ecc71';
                    result.innerHTML = `This is a ${res.message} video. AI is ${res.accuracy}% sure`;
                }
            } else {
                result.style.color = '#e74c3c';
                result.innerHTML = res.message;
            }
        }
    ).catch(
        (err) => {
            console.log(err);
        }
    )
}

document.getElementById("text-url").addEventListener("input",e=>{
    result.style.color = '#000000';
    result.style.textAlign = 'left';
    result.innerHTML = "Result:";
})

