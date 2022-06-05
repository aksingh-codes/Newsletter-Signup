const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); // public folder will become public and all are static files will reside in it so now all static files should have their path relative to this folder as they are inside this folder

const port = process.env.PORT || 3000; //now our app can work on both ports at heroku and locally also.

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      status: "subscribed",
      email_address: email,
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "***REMOVED***";

  const options = {
    method: 'POST',
    auth: '***REMOVED***'
  };

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {

      if (response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }else {
        res.sendFile(__dirname + "/failure.html");
      }

      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure" ,function (req ,res) {
  res.redirect("/");
})

app.listen(port, function() {
  console.log("Server is running at port " + port);
})
