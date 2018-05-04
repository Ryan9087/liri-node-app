var env = require("dotenv").config();
var keys = require("./keys.js")
var twitter = require("twitter");
var request = require ("request");
var spotify = require("node-spotify-api");
//console.log(keys);
//console.log(twitter);

var fs = require("fs");

var twitterClient = new twitter(keys.twitter);
var spotifyClient = new spotify(keys.spotify);

var nodeArgv = process.argv;
var command = process.argv[2];

var x = process.argv[3];
//attaches multiple word arguments

//console.log(nodeArgv);

// switch(command) {
//     case "my-tweets": 
//         showTweets();
//         break;
//     case "spotify-this-song":
//         spotifySong(x);
//         break;
//     case "movie-this":
//         showMovies(x);
//         break;  
//     case "do-what-it-says":
//         doThing();
//         break; 
//     default:
//         break; 
// }
processCommand(command, x);

function processCommand(command, arg) {
switch(command) {
    case "my-tweets": 
        showTweets();
        break;
    case "spotify-this-song":
        if(x) { 
          spotifySong(x);
        } else {
          spotifySong("The Sign");
        }
        break;
    case "movie-this":
        if(x) {
           showMovies(x);
        } else {
           showMovies("Mr. Nobody");
        }
        break;  
    case "do-what-it-says":
        doThing();
        break; 
    default:
        break; 
}
}

function showTweets() {
    var screenName = {screen_name: 'Ryan89897'};
    twitterClient.get('statuses/user_timeline', screenName, function(error, tweets, response){
        var displayNum = 0;
        if(tweets.length >= 20) {
            displayNum = 20;
        } else {
            displayNum = tweets.length; 
        }
        for(var i = 0; i < displayNum; i++) {
            //console.log(tweets);
            var date = tweets[i].created_at;
            var contain = tweets[i].text;
            console.log(date);
            console.log(contain);
            
        }
    });
}
// 27766c96
function showMovies(movie) {

    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true&apikey=27766c96';

    request(omdbURL, function (error, response, body){
        if(!error && response.statusCode == 200){
            var body = JSON.parse(body);

            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("Rotten Tomatoes URL: " + body.tomatoURL);

            //adds text to log.txt
            fs.appendFileSync('log.txt', "Title: " + body.Title);
            fs.appendFileSync('log.txt', "Release Year: " + body.Year);
            fs.appendFileSync('log.txt', "IMdB Rating: " + body.imdbRating);
            fs.appendFileSync('log.txt', "Country: " + body.Country);
            fs.appendFileSync('log.txt', "Language: " + body.Language);
            fs.appendFileSync('log.txt', "Plot: " + body.Plot);
            fs.appendFileSync('log.txt', "Actors: " + body.Actors);
            fs.appendFileSync('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
            fs.appendFileSync('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL);

        } else{
            console.log('Error occurred.')
        }
        if(movie === "Mr. Nobody"){
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");

            //adds text to log.txt
            fs.appendFileSync('log.txt', "-----------------------");
            fs.appendFileSync('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            fs.appendFileSync('log.txt', "It's on Netflix!");
        }
    });
}

function spotifySong(song){
    spotifyClient.search({ type: 'track', query: song}, function(error, data){
      if(!error){
        for(var i = 0; i < data.tracks.items.length; i++){
          var songData = data.tracks.items[i];
          //artist
          console.log("Artist: " + songData.artists[0].name);
          //song name
          console.log("Song: " + songData.name);
          //spotify preview link
          console.log("Preview URL: " + songData.preview_url);
          //album name
          console.log("Album: " + songData.album.name);
          console.log("-----------------------");
          
          //adds text to log.txt
          fs.appendFileSync('log.txt', songData.artists[0].name);
          fs.appendFileSync('log.txt', songData.name);
          fs.appendFileSync('log.txt', songData.preview_url);
          fs.appendFileSync('log.txt', songData.album.name);
          fs.appendFileSync('log.txt', "-----------------------");
        }
      } else{
        console.log('Error occurred.');
      }
    });
  }

  function doThing(){
    fs.readFile('random.txt', "utf8", function(error, data){
    
    var lines = data.split('\n');

    lines.forEach(function(line) {
       var commandArray = line.split(',');
       var command = commandArray[0];
       var arg = commandArray[1];
       processCommand(command, arg);

    });
    });
  }





