# Puppeteer Crawler

This project is a web crawler built using Puppeteer.

## Installation

To install and run this project, follow these steps:

1. Clone the repository and navigate to the project directory:
 ```  
   git clone git@github.com:nghyane/puppeteer-crawler.git && cd puppeteer-crawler
 ```  

2. Make the installation script executable and run it:
 ```  
   chmod +x install.sh && ./install.sh
 ```  

The `install.sh` script will:
- Update the system and install necessary dependencies
- Install Chromium browser
- Install NVM (Node Version Manager)
- Install Node.js version 20
- Install pnpm and pm2 globally
- Install project dependencies
- Start the application using pm2

## Requirements

- Ubuntu or Debian-based system
- Sufficient permissions to run sudo commands

## What the install script does

1. Updates the system packages
2. Installs Chromium browser and its dependencies
3. Installs NVM (Node Version Manager)
4. Sets up NVM in the current shell
5. Installs Node.js version 20
6. Installs pnpm and pm2 globally
7. Installs project dependencies using pnpm
8. Starts the application using pm2

## Running the Application

After installation, the application will be started automatically using pm2. You can manage the application using pm2 commands.

To check the status of the application:
```
pm2 status
```

To stop the application:
```
pm2 stop app
```

To restart the application:
```
pm2 restart app
```

For more pm2 commands, refer to the [pm2 documentation](https://pm2.keymetrics.io/docs/usage/quick-start/).

## Note

Make sure you have the necessary permissions to clone the repository and run the installation script. If you encounter any issues, please check your system permissions and ensure all prerequisites are met.
