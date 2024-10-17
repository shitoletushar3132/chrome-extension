self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Default title";
  const options = {
    body: data.body || "Default body content",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
