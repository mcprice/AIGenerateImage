const PROXY_CONFIG = [
  {
    context: [
      "/api/aiimage/generateimage",
      "/api/aiimage/storeimage",
      "/assets"
    ],
    target: "https://localhost:7032",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
