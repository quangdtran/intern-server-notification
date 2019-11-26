var express = require('express');
var router = express.Router();

const webpush = require("web-push");

const testData = {
  title: "Asset Notification",
  options: {
    body: "Welcome to Asset",
    icon: "http://192.168.1.240:9003/favicon.jpg"
  },
}

// console.log(process.env.GOOGLE_API_KEY)
webpush.setGCMAPIKey(process.env.GOOGLE_API_KEY)
webpush.setVapidDetails(
  "mailto:dev.light97@gmail.com",
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY,
);

let subscription;
let pushIntervalID;

router.post("/register", (req, res, next) => {
  subscription = req.body
  console.log(subscription)
  res.sendStatus(201)
  pushIntervalID = setInterval(() => {
    // sendNotification can only take a string as it's second parameter
    webpush.sendNotification(subscription, JSON.stringify(testData))
      .then(() => console.log('send data to browser'))
      .catch(() => clearInterval(pushIntervalID))
    // .catch(() => console.log('error'))
  }, 10000);
});

router.delete("/unregister", (req, res, next) => {
  subscription = null;
  clearInterval(pushIntervalID);
  res.sendStatus(200);
});

module.exports = router;