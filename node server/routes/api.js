const axios = require('axios');
const express = require('express');
const app = express.Router();
const https = require('https');
const fs = require('fs');
const DeepFake = require('../models/deepfake');
require('dotenv').config();

app.post('/test', async (req, res) => {
    const url = req.body.url;
    console.log(url);
    const videoDetails = await DeepFake.findOne({url});

    if (videoDetails) {
        return res.status(400).json({msg: 'Video already exists in db'});
    } 

    const newVideo = new DeepFake({
        url,
        accuracy: 63
    });

    await newVideo.save();

    return res.json({
        msg: 'Video created successfully'
    });
})

function GetFacebookOptions(video_url) {
    const options = {
        method: 'GET',
        url: 'https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php',
        params: {
          url: video_url
        },
        headers: {
          'X-RapidAPI-Key': '62550b9439mshdc37aaa7fa5474bp147976jsn9d9b26ae8fd8',
          'X-RapidAPI-Host': 'facebook-reel-and-video-downloader.p.rapidapi.com'
        }
    };

    return options;
}

function GetInstagramOptions(video_url) {
    const options = {
        method: 'GET',
        url: 'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index',
        params: {
          url: video_url
        },
        headers: {
          'X-RapidAPI-Key': '62550b9439mshdc37aaa7fa5474bp147976jsn9d9b26ae8fd8',
          'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
        }
    };

    return options;
}

function GetTwitterOptions(video_url) {
    const encodedParams = new URLSearchParams();
    encodedParams.set('url', video_url);

    const options = {
        method: 'POST',
        url: 'https://twitter-downloader-download-twitter-videos-gifs-and-images.p.rapidapi.com/twiform',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '62550b9439mshdc37aaa7fa5474bp147976jsn9d9b26ae8fd8',
            'X-RapidAPI-Host': 'twitter-downloader-download-twitter-videos-gifs-and-images.p.rapidapi.com'
        },
        data: encodedParams,
    };

    return options;
}

app.post('/', async (req,res) => {
    console.log('Request Arrived');
    const encodedParams = new URLSearchParams();
    encodedParams.append("url", req.body.video_url);
    const alreadyProcessed = await DeepFake.findOne({url:req.body.video_url});

    if(alreadyProcessed) {
        return res.json({
            message: 'Deep Fake',
            accuracy: alreadyProcessed.accuracy
        });
    } else {
        const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\//;
        const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\//;
        const twitterRegex = /^(https?:\/\/)?(www\.)?twitter\.com\//;

        let options = '';
        let data = '';

        let flag = 1;

        if (facebookRegex.test(req.body.video_url)) {
            options = GetFacebookOptions(req.body.video_url);
        } else if (instagramRegex.test(req.body.video_url)) {
            options = GetInstagramOptions(req.body.video_url);
            flag = 2;
        } else if (twitterRegex.test(req.body.video_url)) {
            options = GetTwitterOptions(req.body.video_url);
            flag = 3;
        } else {
            return res.json({ message: "Invalid URL"});
        }

        await axios.request(options).then( 
            (response) => {
            const filename = `${Date.now()}-video.mp4`;
            const file = fs.createWriteStream(`./downloads/${filename}`);

            let data = '';

            if (flag === 1)
                data = response.data.links['Download Low Quality'];
            else if (flag === 2)
                data = response.data.media;
            else
                data = response.data.media.video.videoVariants[0].url;

            https.get(data, (responses) => {
                responses.pipe(file);

                file.on('finish', async () => {
                    console.log(` Video Downloaded from the CDN`);
                    file.close();
                    const result = await axios.get(`http://localhost:8080/process_video/${filename}`);
                    const accuracy = result.data.result.toFixed(2) * 100;

                    if(accuracy > 0.75) {
                        const newVideo = new DeepFake({ accuracy, url: req.body.video_url });
                        await newVideo.save();
    
                        return res.json({
                            message: 'DeepFake',
                            accuracy
                        });
                    } else {
                        return res.json({
                            message: 'Real',
                            accuracy: 100 - accuracy
                        });
                    }
                });
            }).on('error', (error) => {
                console.log(`Error downloading video from the CDN: ${error}`);
                file.close();
                return res.json({ message: 'Server is unable to download video'});
            });
        }).catch((error) => {
            console.log('Unable to download video');
            return res.json({ message: 'Server is unable to download the video'});
        });
    }
});

module.exports = app;