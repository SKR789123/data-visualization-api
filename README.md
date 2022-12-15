# octopustask

Step 1.
Update the .env file properties with respective to target PC. HOST, USER, PASSWORD. 
DATABASE and TOKEN_SECRET can be kept as it is or changed if needed.

Step 2.
Run npm install to install the dependencies.

Step 3.
Start the application by running "node server.js" in the project root directory. Can also use "nodemon server.js" since a seperate process manager like PM2 is not used here.

Step 4. 
Follow the below API calls sequentially.

    i. http://localhost:8080/api/functional/createdatabase
    ii. http://localhost:8080/api/functional/createtables 
        This api had a typo in the document. Previously it was identical to the createdatabase api.
    iii. http://localhost:8080/api/functional/populatemarks 
        This will take a considerable time to finish
        
Step 5.
Now assuming the data is populated in the tables. Use Register API to create a user and login with the created user. Please follow the previously uploaded document snapshots to fill the body data for the following POST requests.

    Register : http://localhost:8080/api/auth/register
    Login : http://localhost:8080/api/auth/login
    
Step 6
Follow the the given APIs to obtain data from the database according to the document description and snapshots.
