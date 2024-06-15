module.exports = {
  apps: [
    {
      name: "deetcode",
      script: "./node_modules/next/dist/bin/next",
      args: "start",
      env_production: {
        PORT: 8005,
      },
    },
  ],

  deploy: {
    production: {
      user: "deetcode",
      host: "deetcode.com",
      ref: "origin/main",
      repo: "git@github.com:travisluong/deetcode.git",
      path: "/home/deetcode/deetcode.com",
      "pre-deploy-local": "",
      "post-deploy":
        "source ~/.nvm/nvm.sh && nvm use 20 && npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      ssh_options: "ForwardAgent=yes",
    },
  },
};
