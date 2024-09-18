# protoAuth 

## What is protoAuth?
It is a JWT-based containerized API for user authentication and authorization.

## Why Should I Care?
Implementing login functionality typically requires configuring a database to store user credentials, creating a database schema, setting up a server to handle requests, writing logic to handle credentials, and validating inputs, etc., in the backend.

With protoAuth, if you have Docker installed, two simple commands will spin up a container pre-configured with a MySQL database and Node.js Express server. It securely stores user credentials and provides an API endpoint for managing users.

## How Can I Use It?
Clone git repo
```bash
git clone https://github.com/just4kick/protoAuth.git
cd protoAuth
```
Install Node.js packages:
```bash
npm i
``` 
Next, build the Docker image:

```bash
sudo docker build -t auth0.1 .
```

Finally, run the container:

``` 
sudo docker compose up
 ```

Enjoy!

***NOTE*** ```: environment variable can be changed in docker-compose.yml ``` 
##

## API Endpoint

All examples assume the default environment variables. The ***SERVER_KEY*** is set to "superman" and is required for all API endpoints.
```
Authorization: Bearer superman
Accept: application/json
```

POST ``` baseurl/api/signup``` 

Register a new user.

POST ``` baseurl/api/login``` 

Log in an existing user.

Request body (for both signup and login):

```json
["username","password"]
```

##

PUT ``` baseurl/api/updateuser``` 

Update existing user credentials.

Request body
```json
{
  "id":"2",
  "username":"batman",
  "passwd":"1234",
  "new_username":"saitama",
  "new_passwd":"1234"
}
```
***Note***: The id cannot be changed.

##

DELETE ``` baseurl/api/deleteuser``` 

Delete an existing user.

Request body
```json
{
  "id":"2",
  "username":"saitama",
  "passwd":"1234"
}
```

##

## JWT Token Payload:
```json
{
  "session": "c9c3191e76bd0c89bd41b7d8b8a57f26544935a5b4db52705a8e2f10eab13fb1",
  "id": 3,
  "username": "super",
  "iat": 1726667128,
  "exp": 1726668128
}
```
The ```session``` acts as an ID for the JWT token, which helps validate the JWT in case credentials change before it expires. If credentials are updated, the session in protoAuth's database is also updated, preventing the reuse of old JWT tokens.

GET ``` baseurl/api/sessionverification```

Check whether the same session exists in protoAuth's database.

Request body requires the user's session.
```json
["c9c3191e76bd0c89bd41b7d8b8a57f26544935a5b4db52705a8e2f10eab13fb1"]
```

##

PATCH ``` baseurl/api/updatesession```

Manually update the session.

Request body requires the user's ID.
```json
["3"]
```

***This prototype project*** 


