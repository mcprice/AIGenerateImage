const PROXY_CONFIG = [
  {
    context: [
      "/aigenerateimage"
    ],
    target: "https://localhost:7032",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
