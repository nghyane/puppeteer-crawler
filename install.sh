# add permission & run: chmod +x install.sh && ./install.sh

sudo apt update
sudo apt install -y chromium-browser
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libcups2 libdbus-1-3 libgconf-2-4 libnspr4 libnss3 libxcomposite1 libxrandr2 xdg-utils libgbm-dev

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install 20
nvm use 20

npm install -g pnpm
npm install -g pm2

pnpm install

pm2 start app.js --name "app"
pm2 save