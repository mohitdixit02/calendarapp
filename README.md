<h1>Calendar App</h1>
<h2>Project Overview</h2>
<p>
    Calendar App is a personal project that helps users manage their day-to-day events with ease, ensuring they never miss something important. The application offers the following features:
    <ul>
        <li>Personalised Event Management through authentication</li>
        <li>Month and Year Calendar View with events</li>
        <li>Manage, Add, Delete and Update as much events as you want</li>
        <li>View Events in different timelines using in-built filter</li>
        <li>Checkout the upcoming events easily.</li>
    </ul>
</p>

<h2>Technologies Stack</h2>
<ul>
    <li>
        <h3>Frontend: React, Ant Design</h3>
        <p>
            The frontend of the application is made using React and components of Ant Design. It includes components like user authentication pannel, calendar view, events view page, upcoming events page and event edit page.
        </p>
    </li>
    <li>
        <h3>Backend: Django, Django Rest Framework</h3>
        <p>
           The Backend of the application is made using Django. The backend includes models for user and tasks, and connected to the frontend using Django Rest Framework. The backend provide
           <ol>
                <li> APIs for user registration, events CRUD operations and fetching events data for different componenets.</li>
                <li> platform to directly serve the frontend </li>
           </ol>
        </p>
    </li>
    <li>
        <h3>Database: SQLite</h3>
        <p>
           All the important data for the application is stored in SQLite. Inbuilt Django Database is used to store the users metadata and list of tasks associated with them.
        </p>
    </li>
</ul>

<h2>Installation</h2>

<h3>Pre-requisites</h3>
    <ul>
        <li>Node.js and Python3.1</li>
        <li>Please use the requirements.txt to install python dependencies.</li>
        <li>Node depenedencies will be installed through package.json.</li>
    </ul>

<h3>Steps to start project</h3>

1. Clone the repository

```bash
git clone https://github.com/mohitdixit02/calendarapp.git
```

2. Open the project in terminal and install the backend dependencies

```bash
cd calendarapp
pip install -r requirements.txt
```

3. Start the backend server

```bash
python manage.py runserver
```
Django will serve the frontend as well, so no need to start it separately. But in case you want to check it out, go through the below steps.

<h3>Dev Server</h3>

In case you want to start the dev server of frontend, open another terminal and run the following commands:

```bash
cd calendarapp/frontend
npm install
npm start
```

!! Also please modify the .env in frontend code to match the backend server (only for dev server).

<h2>Suggestions</h2>
I am happy for any suggestions or improvements. Feel free to open an issue or pull request.
or you can email me on: mohit.vsht@gmail.com

Thanks !!
<h3>Mohit Sharma</h3>
