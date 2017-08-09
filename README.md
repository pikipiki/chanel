# Flush Gordon

[![build status](https://gitlab.com/Epitech-42/flush-gordon/badges/master/build.svg)](https://gitlab.com/Epitech-42/flush-gordon/commits/master)
[![coverage report](https://gitlab.com/Epitech-42/flush-gordon/badges/master/coverage.svg)](https://gitlab.com/Epitech-42/flush-gordon/commits/master)

## Informations

The project is developed with NojdeJS / Express

All JS is coded under [ES6](http://es6-features.org/) and webpack / babel are used to compile everythings

## Stack 
- NodeJS 7.4.0
- ES6

## Environment

- `PORT` variable set the port of the application, if not the port bind on 3000
- `ENV` variable set the env of the app. It's **dev** or **prod**

## GIT
All development has to be made on the `dev` branch or you have to checkout a new one from the master.
Merging with the master must be done by `pull request`

## Install

The first step is to install all dependencies:

    > cd /path/to/root/folder
    > npm install

## Dev mode

To build in dev mode the project:

    > npm run dev

After that, you can reach the project at [localhost:3000](http://localhost:3000) 

## Build in production and start
To build in production mode the project:

    > npm run build
    > npm start
    
The whole app will be transpiled to es5 in the folder `dist/`

#### Deploy
To deploy, run the following command to move the transpiled files to the virtual env of the web server

    > cp dist/* path/to/target/server
    
## Clean the build

To clean the build create with the command above:

    > npm run clean

## Test

#### Check if the server is properly launched
- If you run the project in dev mode using `npm start`, check if you have the following output:
       
     > Express server listening on port 3000 in development mode

     


