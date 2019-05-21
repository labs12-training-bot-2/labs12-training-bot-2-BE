//Dependencies
const router = require("express").Router();

//Models
const Users = require("../models/db/users");

router.route("/:id")
  .delete(async (req, res) => {
    /** 
     * Deletes a specific User based on the ID parameter
     * 
     * @function
     * @params {Object} req - the Express request object
     * @params {Object} res - The Express response object
     * @returns {Object} - The Express response object
    */
    const { id } = req.params;
    const deleted = await Users.remove({ id });
    
    // If "deleted" is falsey, the user we're trying to delete does not exist
    if (!deleted) {
      return res.status(404).json({ 
        message: "The specified user does not exist." 
      })
    }
    
    // Return a message to the client to confirm that the user was deleted
    return res.status(200).json({ 
      message: "User account removed successfully." 
    });
  });

module.exports = router;
