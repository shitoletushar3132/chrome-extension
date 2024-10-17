import React, { useEffect } from "react";

function PushNotification() {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(function (registration) {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch(function (error) {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const askNotificationPermission = () => {
    Notification.requestPermission().then(function (permission) {
      console.log("Notification permission:", permission); // Check permission
      if (permission === "granted") {
        sendNotification();
      } else {
        console.log("Permission was not granted for notifications");
      }
    });
  };

  const sendNotification = () => {
    navigator.serviceWorker.ready.then(function (registration) {
      const title = "Hello!";
      const options = {
        body: "This is a test notification!",
      };

      registration
        .showNotification(title, options)
        .then(() => {
          console.log("Notification sent successfully!");
        })
        .catch((error) => {
          console.error("Notification failed to send:", error);
        });
    });
  };

  return (
    <div>
      <h1>Push Notification Test</h1>
      <button onClick={askNotificationPermission}>Send Notification</button>
    </div>
  );
}

export default PushNotification;
