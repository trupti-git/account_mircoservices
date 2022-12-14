***Project setup***

- mkdir projectName
- npm init -y, initialize the project (to autogenerate package.json file with default values)
- npm - node package manager (to install all npm packages from node.org (internet))

***git commands***
- git init (Create an empty Git repository or reinitialize an existing one)
- git add . (to stage all files), git add file1 file2 file3 (to stage specific files)
- git status (to see the working tree status)
- git commit -m "comment", to commit files
- git push, to push to remote repo
- git checkout -b "branch-name", to create new branch
- git branch, see branch list 
- git pull, to pull the code from remote repo
- create branch from git commit, git checkout -b branch_name commitId
- git branch -a, list all branches
- git branch, shows current branch you are on
- git checkout . revert changes

before starting changes do git pull

git add
git commit
git push

***package.json***

- add a contraint, users run the project with a specific Node.js version using "engines" (good practice, its optional)

***.npmrc***

- add a local npm configuration file (.npmrc) to your module/project root and explicitly turn on strict Node.js engine handling
  (engine-strict=true)
- It is used to connect to nexus repo in big organization where for security reason they are not downloading npm packages from internet

***.gitignore***

- Specifies intentionally untracked files to ignore

***dotenv***

- DotEnv is a lightweight npm package that automatically loads environment variables from a .env file into the process.env object.

***nodemon***

- add the dependency
- npm i nodemon
- add script to package.json

***API's***
- GET http://localhost:3005/accounts
- POST http://localhost:3005/accounts
- DELETE http://localhost:3005/accounts 

***Status Codes***
- 200, OK, successful response
- 201, Created, usually in case of POST we return it
- 400, bad request (we validate request and if expected params are not in proper format / exist we send it)
- 401, unauthorized request
- 404, resource not found
- 500, internal server error (code exception / DB is down / or third party API is not working)

***Errors*** 
- node_gyp error resolved using below commands
- rm package-lock.json
- npm install --legacy-peer-deps


***Git Actions CI pipeline*** 
- using Heroku