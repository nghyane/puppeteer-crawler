# add permission & run: chmod +x install.sh && ./install.sh

sudo apt update
sudo apt install -y chromium-browser
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libcups2 libdbus-1-3 libgconf-2-4 libnspr4 libnss3 libxcomposite1 libxrandr2 xdg-utils libgbm-dev

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

source ~/.bashrc

nvm install 22.04
nvm use 22.04

npm install -g yarn
npm install -g pm2

yarn install

pm2 start app.js --name "app" --watch --ignore-watch="node_modules" --no-daemon 
pm2 save