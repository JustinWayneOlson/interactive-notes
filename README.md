# Interactive Notes

## Table Of Contents
- [Purpose](#purpose)
- [Design](#design)
- [Inspiration and References](#inspiration-and-references)
- [Development Status](#development-status)
- [File Structure](#file-structure)
- [Dependencies](#dependencies)
- [Installation and Usage](#installation-and-usage)

## Purpose

This was originally a final project for Front End Web Development at the University of Colorado. The goal is to improve the readability of web development related notes by offering an interactive workspace that pulls information uploaded from a PDF realtime.  As a student is learning web development it can be immediately overwhelming. While reading course notes it his helpful to look up the documentation of the information referenced, as well as try out code samples provided. Instead of flipping between 3 tabs of javascript html and css code, a display webpage, the pdf, api documentation and w3 schools tutorials what if all of this could be shown in the same page and interact with each other. In the same interface there could be a pdf viewer which you upload notes, an environment similar to [CodePen](http://codepen.io/) and [JSFiddle](https://jsfiddle.net/). A user could highlight an html tag out of a pdf, and in a display window would be a scraped w3 schools snippet with information, and a rendered html version in another window. Another feature would be to highlight a snippet javascript and look up the standard library definition of the term or function, or attempt to find API documentation.

## Design

This project was designed for the purpose of learning with unfamiliar technology. 

##### Stack

I have done full stack applications with various tech stacks, however I wanted to experiment with the [MEAN stack](http://mean.io/) minus angular. In learning MEAN angular was always the most confusing part, and always seemed robust for my applications. Instead I am using [ejs](http://www.embeddedjs.com/), to combine the HTML view with application data to create view templates rendered by express. ejs makes formatting templates very streamlined by embedding javascript in the HTML to control the data. For example when a user is logged in, ejs manages the user data, and fills the page with the appropriate information. 

##### Authentication

A user will be authenticated by creating a local account or with facebook, twitter, or google accounts. I will handle all of this using a node package called [passport](http://passportjs.org/). A user can connect any/all of the additional oauth methods for convenience, and this will allow easier use of the social networks API's to integrate collaboration into the application.

##### User Data

User accounts are set-up so that a user's data can persist across multiple sessions. This is important so notes can be saved and re-visited. A user contains as much or as little of the oauth information provided from passport, any personalization settings, the collection of files that they have uploaded, and the collection of notes that they have created.

##### File Storage

As an alternative to writing the file to a directory on the server's filesystem, I want to store the file 's raw content in the database along with the user. This allows for easier association, a cleaner filesystem, and will come in handy when parsing subsections of a pdf. By default mongo has a maximum collection size, so as a workaround I will be using [gridFS](https://docs.mongodb.com/manual/core/gridfs/). This divides a file into chunks and stores them so we can store PDF files of any size (if someone were to upload an entire textbook).

##### Data Scraping

Additional documentation will need to be scraped to provided in-page information. To accomplish this I will use [request](https://github.com/request/request), combined with a truly fantastic library called [Cheerio](https://cheerio.js.org/). Cheerio essentially provides back-end jQuery functionality which is invaluable when parsing through a scraped webpage. This let's allows the scraping to happen on server-side and get stored, instead of trying to request the 3rd party url realtime and parsing the data on the front-end. I will scrape w3schools [reference pages](https://www.w3schools.com/tags/default.asp), as well as mozillas [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference), to generate a set of terms with acsessable data and write to mongo. 

##### PDF Parsing

The first step is getting the PDF into a parsable format using a library called [pdf-to-text](https://www.npmjs.com/package/pdf-to-text). After this  I will parse the new text object using regex in coordination with the scraped data. Code snippets can be extracted and added to the programming interface, and when moused-over or clicked can provide the additional documentation. 

## Inspiration and References

I started by following a [guide](https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular) on creating a TODO list app using the MEAN stack, attempting to replace the angular aspects with the .ejs templates. After running into some difficulty understanding how ejs was working I moved on to a similar [tutorial](https://scotch.io/tutorials/use-ejs-to-template-your-node-application) that implemented ejs. After creating a basic boilerplate for the framework, I started playing around with what it took to get Ajax to handle the file uploading. I discovered this [guide](https://coligo.io/building-ajax-file-uploader-with-node/) that uses a node module called formidable. At this point the application will write the file to the filesystem. User authentication is needed to link the file back to a user. I found a wonderful [tutorial series](https://scotch.io/tutorials/easy-node-authentication-setup-and-local) that walks through using passport for the 4 different authentication methods. I adapted some of the code from this series to create my  [guide](https://ciphertrick.com/2017/02/28/file-upload-with-nodejs-and-gridfs-mongodb/), and ran into issues with the writing, as well as clearing the temporary directory where the file got written. Information from a similar [guide](https://medium.com/@patrickshaughnessy/front-to-back-file-uploads-using-gridfs-9ddc3fc43b5d) led to the solution to that issue. The web scraping I followed [similar code](https://github.com/JustinWayneOlson/hackcu-clickbait/blob/master/app/multi-page.js) for a different project.

## Development Status
##### Boiler Plate
- [x] Mongo Config
- [x] Default Route
- [x] Express with EJS template

##### Authentication
- [x] Local user creation and authentication
- [x] Google authentication
- [x] Facebook authentication
- [x] Twitter authentication
- [x] Save account to DB
- [x] Account Page
- [x] Link existing accounts
- [ ] Unlink existing accounts
- [ ] Account Preferences
- [ ] Authentication Cookies

##### File Upload
- [x] File-uploader interface
- [x] File Write to DB
- [x] File Read from DB
- [x] Delete File From DB
- [x] Limit filetype support to PDF server side

##### Note Creation and Modification

- [x] serve a PDF directly from mongo
- [ ] create a new notebook
- [ ] create a new note
- [ ] add pdf's to note

##### External Data Scraping

- [ ] JavaScript documentation (mozilla)
- [ ] W3 HTML Reference
- [ ] W3 JavaScript Reference
- [ ] W3 CSS Reference
- [ ] Attempt to scrape an arbitrary library

##### Note Editor

- [ ] JSfiddle or Codepen embed
      Jsfiddle, codepen.io, and similar online runtime enviornments can be embedded, but only to a specific link, that saves the code from session to session. I cannot create a new one for each note. The most likely solution is building a platform from scratch.
- [ ] Output to a new tab within the same webpage
- [ ] Adjust Layout of sections PDF, JS, HTML, CSS, Output, Console, and Reference between an in-site tab system.
- [ ] Populate code environments with data from pdf
- [ ] PDF Editor (take notes on the pdf)

## File Structure

```
├── README.md              //application documentation
├── server.js              //NodeJS server file
├── package.json
│
├── app                    //application files
│   │
│   ├── file-handler.js    //backend logic for file uploading, processing, and downloading
│   ├── passport.js        //backend logic for authentication
│   ├── routes.js          //API endpoints to server
│   └── models             //MongoDB schema files
│       └── user.js        //user schema
│
├── config                 //configuration files containing sensitive information to be left out of VC
│   │
│   ├── auth.js            //Oauth Config's
│   └── database.js        //Database Config
│
│
├── public                 //static files (css, js, img, etc.)
│   │
│   ├── css                
│   │   └── style.css      //Global application styles
│   └── js
│       ├── upload.js      //Main javascript file for filebrowser page
│       └── account.js     //main javascript file for account page
│   
└── views                  //EJS Templates (html)
    │
    ├── account.ejs        //template for account settings page
    ├── connect-local.ejs  //template for linking an already existing local account 
    ├── filebrowser.ejs    //template for file uploader and browser
    ├── index.ejs          //template for landing page
    ├── login.ejs          //template for local account login page
    ├── signup.ejs         //template for local account creation page       
    └── viewer.ejs         //template for viewing notes
 ```

## Dependencies

The following dependencies are installed on my system with corresponding version numbers.

- ##### [NodeJS](https://nodejs.org/en/)
    - Server Side Javascript
    - Version: 6.10.2
    - [Installation Information](https://nodejs.org/en/download/package-manager/)
- ##### [NPM](https://www.npmjs.com/)
    - NodeJS Package Manager
    - Version: 3.10.10
    - [Installation Information](http://blog.npmjs.org/post/85484771375/how-to-install-npm)
- ##### [MongoDB](https://www.mongodb.com/)
    - NoSQL Database
    - Version: 3.4.4
    - [Installation Information](https://docs.mongodb.com/manual/installation/)
- ##### Other Javascript Dependencies
    - Everything else is handled by npm, and configured in package.json. 
    
## Installation and Usage

##### Clone the repository

    git clone https://github.com/JustinWayneOlson/interactive-notes
    
##### Install JavaScript Dependencies

    npm install

##### Set up config files

There are two files in the .config folder that don't get pushed to github. Those contain the API information for authentication, as well as the DB url string. In the config folder create the following two files.

The first file contains the API information for google facebook and twitter. Register a developer account with the three domains and create a new application on their respective portals. Copy the keys, and secrets into this config file, and set the redirect page in the portal's settings to http://localhost:8080/profile. For more information about this see this [tutorial series](https://scotch.io/tutorials/easy-node-authentication-setup-and-local).

###### auth.js

    module.exports = {

        'facebookAuth' : {
            'clientID'      : 'APP ID', // your App ID
            'clientSecret'  : 'SECRET', // your App Secret
            'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
        },
    
        'twitterAuth' : {
            'consumerKey'       : 'APP KEY',
            'consumerSecret'    : 'SECRET',
            'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
        },
    
        'googleAuth' : {
            'clientID'      : 'APP ID',
            'clientSecret'  : 'SECRET',
            'callbackURL'   : 'http://localhost:8080/auth/google/callback'
        }

};

The second file is the MongoDB config. This just contains the connection string to the database. For information on what this should look like read these [docs](http://mongoosejs.com/docs/connections.html).

###### database.js

    module.exports = {
        'url' : 'CONNECTION STRING'
    };
    
##### Start the Mongo Service in the background

    sudo mongod &

##### Open Mongoi shell, and create an index for gridfs

    mongo

    <mongoshell> db.fs.chunks.ensureIndex({ files_id : 1, n : 1 })

##### Start the web server

    node server.js
    
##### Point Browser to localhost:8080/

