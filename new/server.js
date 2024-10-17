const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors package

const app = express();

// Enable CORS for all origins or specific origin
app.use(
  cors({
    origin: "*", // Allow requests from your Vite frontend
    methods: ["GET", "POST"], // Allow only specific methods
    allowedHeaders: ["Content-Type"], // Allow specific headers
  })
);

// Middleware
app.use(bodyParser.json());

// VAPID keys generated using web-push
const publicVapidKey =
  "BE8rndahbYFn7ikY_FQl2m-vZHNAUwoFMnwbmif1osr6tIR_Dm68wkDBCaQ9rfieq7n2HGJiOWOFKAj0mZjEdsQ";
const privateVapidKey = "ccITBkc3DkMysStqXatJEyHhmTrNel0qj23_fdXFkR8";

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  "mailto:tusharshitole67672gmail.com",
  publicVapidKey,
  privateVapidKey
);

// In-memory storage for subscriptions
let subscriptions = [];

// Route to save a new subscription
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscription received" });
});

// Send notification when data changes
app.post("/trigger-notification", (req, res) => {
  const notificationPayload = JSON.stringify({
    title: "Data Updated!",
    body: "hello from tushar",
  });

  const promises = subscriptions.map((subscription) =>
    webpush.sendNotification(subscription, notificationPayload)
  );

  Promise.all(promises)
    .then(() =>
      res.status(200).json({ message: "Notification sent successfully!" })
    )
    .catch((err) => {
      console.error("Error sending notification", err);
      res.sendStatus(500);
    });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
