module.exports = {
  apps: [
    {
      name: "aggarha-web",
      cwd: "/var/www/Aggarha-review-preview",
      script: "npm",
      args: "start -- -p 3100",
      interpreter: "/usr/bin/node",
      env: { NODE_ENV: "production" }
    }
  ]
};
