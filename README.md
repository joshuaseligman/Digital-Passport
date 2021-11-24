# Digital-Passport

Digital Passport is a social media web application where users can post pictures from their vacations to inspire others to travel the world. Users may also comment on posts and save other users' posts to their collection for future reference.

The website was built entirely with JavaScript with Express.js, MongoDB (Mongoose), and Node.js in the back-end and EJS and SCSS in the front-end.

To view posts from a particular location, go to the `Map` page. Next, zoom in on the place you want to travel to and click on the location on the map. Once the website returns the exact location that you clicked on, an `Explore` button will appear, which will redirect you to a page with the posts from the selected location. Once on this page, you may view more details of a post by clicking on the picture for the respective post.

The post details page contains a lot of key information about the post such as the user, location, date posted, picture, caption, and comments. To go to the user's profile page, click on their username. Additionally, clicking on the image will toggle its view between collapsed and fully expanded. Comments are public and can be viewed by all users, but only users who are logged in may add a comment on a post. Also, logged-in users may add and remove posts from their collection if they are not the owner of the post. Lastly, a user may also delete their post from the post details page.

The profile page shows all the posts made by a given user. Details for each post may be obtained by clicking on any of the posts. If one is logged in and on their profile page, they will have the option to add a post, which requires them to upload an image, add a caption, and select the location the image is from.

Lastly, a user's collection consists of their saved posts that they want to keep for future use. The collection is private and can only be viewed by the logged-in user.

To use Digital Passport using Docker and the public database, complete the following instructions:

1. Download Docker. If you do not already have Docker, you can download it <a href="https://www.docker.com" target="_blank">here</a>.
2. Pull the image using the following command: `docker pull joshuaseligman/digital-passport`.
3. Run the image using the following command: `docker run -d -p 3000:3000 joshuaseligman/digital-passport`.
5. Once the server is running, open a web browser and go to <em>localhost:3000</em> to view the webpage.

To use Digital Passport using Docker and a private database, complete the following instructions:

1. Download Docker. If you do not already have Docker, you can download it <a href="https://www.docker.com" target="_blank">here</a>.
2. Download or clone the repository.
3. Add a .env file in the project directory with the following line: `DB_URI=yourMongoDBUri`.
4. Add a folder called `uploads` to the project directory.
5. Build the image using the following command: `docker build . -t digital-passport`.
6. Run the image using the following command: `docker run -d -p 3000:3000 digital-passport`.
7. Once the server is running, open a web browser and go to <em>localhost:3000</em> to view the webpage.

To use Digital Passport using Node.js and a private database, complete the following instructions:

1. Download Node.js. If you do not already have Node, you can download it <a href="https://nodejs.org/en/" target="_blank">here</a>.
2. Download or clone the repository.
3. Navigate to the directory of the project and run the following command: `npm install`. This will download all of the project dependencies.
4. Add a .env file in the project directory with the following line: `DB_URI=yourMongoDBUri`.
5. Add a folder called `uploads` to the project directory.
6. Run the following command to start the server: `npm run start`.
7. Once the server is running, open a web browser and go to <em>localhost:3000</em> to view the webpage.