# QRP
QR|P App Proof of Concept

## For running the...
### Reader
Go into ./reader/serv and type ```node index.ts```. It should say that server is being hosted on localhost:8080  
In another terminal, go to /reader/ui and type ```yarn add``` and ```yarn dev```. It should give you a localhost link to click
### Generator

Go into ./qr-generator and type ```yarn add```, ```yarn build```, and ```yarn dev```. It should give you a localhost link to click.

### JWT Playground
Go into ./jwt-playground/jwt-backend. 
Create ```./constants.ts```. The contents of this file should look like:
```
export const jwtConstants = {
    secret: '[insert 32 char super secret string]',
};
  
```
Run:
```
yarn
yarn run start:dev
```
In a seperate terminal, go to ./jwt-playground/jwt-frontend. Run:
```
yarn
yarn dev
```
