{
  "apps": [
    {
      "name": "bukid-ni-manang",
      "script": "npm",
      "args": "start",
      "cwd": "./client",
      "env_production": {
        "NODE_ENV": "production",
        "PORT": 3000
      },
      "instances": "max",
      "exec_mode": "cluster",
      "watch": false,
      "merge_logs": true,
      "log_date_format": "YYYY-MM-DD HH:mm Z",
      "max_memory_restart": "1G",
      "autorestart": true,
      "exp_backoff_restart_delay": 100
    }
  ],
  "deploy": {
    "production": {
      "user": "bukidadmin",
      "host": ["your_server_ip"],
      "ref": "origin/main",
      "repo": "git@github.com:Elmoordista/bukid-ni-manang.git",
      "path": "/var/www/bukidnimanang",
      "ssh_options": ["StrictHostKeyChecking=no"],
      "post-deploy": [
        "npm install",
        "npm run build",
        "pm2 reload ecosystem.config.js --env production"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}