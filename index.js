// Required NPM installs
const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const pdf = require('html-pdf');

// User prompts
inquirer
    .prompt([
        {
            message: "Enter your GitHub username:",
            name: "username"
        },
        {
            message: "What is your favorite color?",
            name: "color"
        },

        // API call to GitHub for user information
    ]).then(function ({ username, color }) {
        const queryUrl = `https://api.github.com/users/${username}`;

        axios.get(queryUrl).then(function (res) {

            // Data stored to variables
            const name = res.data.name;
            const image = res.data.avatar_url;
            const login = res.data.login;
            const gitHub = res.data.html_url;
            const linkedIn = res.data.blog;
            const location = res.data.location;
            const bio = res.data.bio;
            const repos = res.data.public_repos;
            const followers = res.data.followers;
            const following = res.data.following;

            // 2nd API call to GitHub for starred repo information
            const queryUrl2 = `https://api.github.com/users/${username}/starred`;

            axios.get(queryUrl2).then(function (res) {

                const starredRepos = res.data.length

                // const queryUrl3 = 'https://www.googleapis.com/geolocation/v1/geolocate?key=YOUR_API_KEY';

                // axios.get(queryUrl3).then(function (res) {

                // Generate HTML page with API information loaded
                function generateHTML() {
                    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
        integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous" />
                <title>Document</title>
            </head>
            <body>
                <div class="jumbotron jumbotron-fluid" style="background-color:${color};margin:0;height:100%">
                <div class="container">
                <img src="${image}" alt="GitHub Profile Picture" height="250" width="250" style="border-radius:50%;border:5px solid rgb(33, 37, 41);">
                <h1 class="display-4" style="margin-top:20px;">Hi! My name is ${name}</h1>
                <button type="button" class="btn btn-secondary btn-lg">@${login}</button>
                <p class="lead" style="margin-top:40px">${bio}</p>
                <h4><i class="fas fa-map-marker-alt"></i> ${location} <a href=${gitHub} style="margin:10px" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true"><i class="fab fa-github fa-2x"></i></a><a href=https://${linkedIn} class="btn btn-secondary btn-lg active" role="button" aria-pressed="true"><i class="fas fa-blog fa-2x"></i></a></h4>
                <div class="card-group">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Public Repositories</h5>
                                <p class="card-text" style="font-size: 32px"> ${repos}</p>
                                </div>
                </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Followers</h5>
                                <p class="card-text" style="font-size: 32px">${followers}</p>
                                </div>
                </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Following</h5>
                                <p class="card-text" style="font-size: 32px">${following}</p>
                                </div>
                </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">GitHub Stars</h5>
                                <p class="card-text" style="font-size: 32px">${starredRepos}</p>
                                </div>
                            </div>
                        </div>
            </body>
            </html>`;
                }
                const html = generateHTML();

                // Create HTML page named "index.html"
                fs.writeFile("index.html", html, function (err) {
                    if (err) {
                        throw err;
                    }
                });

                // PDF styling options
                const options = { width: "24in", height: "16.65in", orientation: "landscape" };

                // Create PDF document and name it "index.pdf"
                pdf.create(html, options).toFile("index.pdf", function (err, res) {
                    if (err) return console.log(err);
                    console.log(res);
                });
            });
        });
    });