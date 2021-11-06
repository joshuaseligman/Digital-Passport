const multer = require('multer');

// Function for getting the current user that is logged in
module.exports.getCurrentUser = function(req) {
      // Create the user object
      const curUser = {
        id: (req.session.user) ? 1 : 0,
    };
    // If there is an error, get the error information and reset the session 
    if (req.session.error) {
        curUser.id = -1;
        curUser.error = req.session.error;
        req.session.destroy();
    } else {
        // Get the logged in user's username
        curUser.username = req.session.user;
    }
    // Return the user data
    return curUser;
};

// Set up the system for storing the files when uploaded
const storage = multer.diskStorage({
    // Set the upload destination to the uploads 
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    // Fix the file name to remove spaces
    filename: function(req, file, cb) {
        cb(null, file.originalname.replace(/\s/g, '-'));
    }
});
const upload = multer({storage: storage});
module.exports.upload = upload;