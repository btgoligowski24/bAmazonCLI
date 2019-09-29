# bAmazonCLI

## What Problem Does the App Solve
This app is an intro to mySQL using a command line interface with Node.js. It introduces me to a way to interact with a database (mySQL) using Node.js.

## App Overiew
The app is organized by .js files and within each file, by functions. For each file, one function is run and based on what argument is passed in, will call other functions.

## How to Use the App
1. **You must have Node.js installed for this to work, this is a prequisite**
1. Open up your command line interface (i.e. terminal on Mac or command prompt on Windows)
2. Navigate to the folder where the program is located
3. Verify required files are present
    1. You should already have the `package.json` file; if you don't, run `npm init -y`. 
    2. Now, make sure to run `npm install` which will install the proper dependencies in this folder.
    3. random.txt exists with contents in the following format {command},{thingToLookUp} (the app will only results the first pair like this, extras will not run)
4. Run the node program by entering any of the following three commands:
    * `node bamazonCustomer.js`
    * `node bamazonManager.js`
    * `node bamazonSupervisor.js`
5. Voila, you've used the app. It should print the response to the console (command prompt).

* [Video Demonstration of the App](https://youtu.be/wB8GXKPtNvQ)

## Technology Used
* Node.js
  * Specific Node Pacakages
    * inquirer
    * mysql
    * dotenv
    * console.table

## Contributors
I am the sole contributor to this project at this time. This likely will not be updated and maintained going forward.