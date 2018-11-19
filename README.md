# user-management

This project manages user registration, activation and profile maintenance using  NodeJS + Typescript + Express + MongoDB + E-mail (GMail/SMTP)


## Development

Install the dependencies and start the server.

```sh
$ yarn install
$ yarn build
$ yarn start
```
 
By default the api is served on http://localhost:8080/api/v1/

## Running unit tests

Run `yarn test` to execute the unit tests via [Mocha](https://github.com/mochajs/mocha).

  
### Local setup using Docker: 
  
  ##### Prerequisite - Install Docker
     Windows: https://docs.docker.com/docker-for-windows/
     Mac: https://docs.docker.com/docker-for-mac/install/  
     
  Once you have installed docker
  
  Run `docker -v` to confirm docker is running
  
  `docker-compose up` to start all the docker images required for setup 
  
  * mongodb - your local DB instance
    Running on localhost:27017
  
  * mongo-express - Web-based MongoDB admin interface
  
    Running on http://localhost:9005/
    UserId: admin
    password: password
    
  * MailHog - To view and send test email's
    SMTP server starts on port 1025
    HTTP server starts on port 8025, MailBox can be accessed on http://localhost:8025/ (you would be interested in this)
   

