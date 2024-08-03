# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



### Welcome to our Group Project for CS 476

### How to run this Project locally?

### Create a new folder on your desktop.
### Run Visual Studio Code and open the new folder you've created.
### Once folder is opened, run a terminal.
### Enter these commands:
### git init
### git clone https://github.com/Je-et/GP_CS476.git
### To make sure you are in the right folder, type in the terminal:
### cd GP_CS476
### Once in the right folder, enter the following commands one after the other and wait for everything to be downloaded:
### git remote add origin https://github.com/Je-et/GP_CS476.git
### npm install gh-pages --save-dev
### npm install axios
### Once the download is complete, run the webpage by using:
### npm start
### Open a new terminal and enter:
### cd GP_CS476
### cd backend
### To run the server, type:
### python main.py
### Refresh the webpage.
### Welcome to Green Basket!


### This is for testing!

### Create a new account
For a Shopper: 
A typical username and password is required. No special cases.

For an Employee:
Username MUST have a '.emp' in the end (for example: test.emp, trial.emp etc) for it to be valid.
A typical password is required, no special cases.

### Use an existing account for easier access
### For Shopper
username: testShopper
password: 123456
### For an Employee
username: test.emp
password: 123456



### Commands used in our Project

### Install pip
python get-pip.py

### Install pipenv
pip install pipenv
or
py -m pip install pipenv

### Setting up the virtual environment
pipenv shell

### Installing dependencies
pip install python_decouple flask flask_restx flask_sqlalchemy flask_jwt_extended flask_migrate

### Managing dependencies
pip freeze > req.txt

### Setting up Flask_APP
"$env:FLASK_APP = 'main.py'"

### Initialize the migration repository
flask db init

### Initialize the database
flask shell

### Inside the Flask shell, run:
db.create_all()

### Create migration
flask db migrate -m "message"

### Apply migration
flask db upgrade

### Initializing the server
python main.py

### Initializing the webpage
npm start





