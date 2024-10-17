import React, { useEffect } from "react";

const PUBLIC_VAPID_KEY =
  "BE8rndahbYFn7ikY_FQl2m-vZHNAUwoFMnwbmif1osr6tIR_Dm68wkDBCaQ9rfieq7n2HGJiOWOFKAj0mZjEdsQ"; // Replace with your public VAPID key

function PushNotification() {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
          checkExistingSubscription(registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    } else {
      console.warn("Service workers are not supported in this browser.");
    }
  }, []);

  // Check if there's already an existing subscription
  const checkExistingSubscription = async (registration) => {
    const existingSubscription =
      await registration.pushManager.getSubscription();

    if (existingSubscription) {
      // Log existing subscription info
      console.log("Existing subscription found:", existingSubscription);
      return; // No need to resubscribe
    }

    // Now subscribe with the new key
    subscribeUser(registration);
  };

  // Subscribe user to push notifications
  const subscribeUser = async (registration) => {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      // Send subscription to the backend
      await fetch("http://localhost:4000/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Subscribed to push notifications:", subscription);
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
    }
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  };

  return (
    <div>
      <h1>Push Notification Test</h1>
    </div>
  );
}

export default PushNotification;
