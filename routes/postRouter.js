// Dependencies
const router = require("express").Router();
const moment = require("moment");

// Models
const Posts = require("../database/Helpers/post-model");
const Notifications = require("../database/Helpers/notifications-model");
const TeamMember = require("../database/Helpers/teamMember-model");

// Routes
// POST a new post
router.post("/", async (req, res) => {
  try {
    const { postName, postDetails, daysFromStart, trainingSeriesID } = req.body;

    if (!postName || !postDetails || !daysFromStart || !trainingSeriesID) {
      res.status(400).json({ error: "Client must provide all fields." });
    } else {
      // add new post to database
      const newPost = await Posts.add(req.body);

      // get team member data based on training series id's they are assigned to
      const rows = await Notifications.getTrainingSeriesOfNewPost(
        trainingSeriesID
      );

      // if team member has training series assignments, for each assignment, assemble a new object to be inserted to the notifications table with the new post information
      if (rows.length > 0) {
        const entriesToInsert = rows.map(row => {
          if (member.textOn === 1) {
            return {
              // generate only text notifications
              postID: post.postID,
              postName: post.postName,
              postDetails: post.postDetails,
              link: post.link,
              daysFromStart: post.daysFromStart,
              sendDate: moment(startDate)
                .add(post.daysFromStart, "days")
                .format(),
              teamMemberID: member.teamMemberID,
              phoneNumber: member.phoneNumber,
              firstName: member.firstName,
              lastName: member.lastName,
              jobDescription: member.jobDescription,
              trainingSeriesID: trainingSeriesID,
              userID: member.userID
            };
          } else if (member.emailOn === 1) {
            return {
              // generate only email notifications
              postID: post.postID,
              postName: post.postName,
              postDetails: post.postDetails,
              link: post.link,
              daysFromStart: post.daysFromStart,
              sendDate: moment(startDate)
                .add(post.daysFromStart, "days")
                .format(),
              teamMemberID: member.teamMemberID,
              email: member.email,
              firstName: member.firstName,
              lastName: member.lastName,
              jobDescription: member.jobDescription,
              trainingSeriesID: trainingSeriesID,
              userID: member.userID
            };
          } else {
            // generate both text and email notifications
            return {
              postID: post.postID,
              postName: post.postName,
              postDetails: post.postDetails,
              link: post.link,
              daysFromStart: post.daysFromStart,
              sendDate: moment(startDate)
                .add(post.daysFromStart, "days")
                .format(),
              teamMemberID: member.teamMemberID,
              phoneNumber: member.phoneNumber,
              email: member.email,
              firstName: member.firstName,
              lastName: member.lastName,
              jobDescription: member.jobDescription,
              trainingSeriesID: trainingSeriesID,
              userID: member.userID
            };
          }
        });

        // for each new object, insert it into the notifications table
        entriesToInsert.forEach(
          async entry => await TeamMember.addToNotificationsTable(entry)
        );
      }

      res.status(201).json({ newPost });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT post information
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const incomingPostUpdate = req.body;
    const updatedPost = await Posts.update(id, incomingPostUpdate);

    // get notification to update by post id
    const notificationToUpdate = await Notifications.getNotificationByPostId(
      id
    );

    // calculate new send date for notification
    const newSendDate = moment(notificationToUpdate.startDate)
      .add(incomingPostUpdate.daysFromStart, "days")
      .format();

    // create updated notification, including new send date if daysFromStart changed
    const updatedNotification = {
      ...incomingPostUpdate,
      sendDate: newSendDate
    };

    // update notifications
    await Notifications.updateNotificationContent(id, updatedNotification);

    res.status(200).json({ updatedPost });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET post by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findById(id);
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// DELETE post by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Posts.remove(id);
    if (deleted > 0) {
      res.status(200).json({ message: "The resource has been deleted." });
    } else {
      res.status(404).json({ error: "The resource could not be found." });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// GET all posts for notification system - for server use only
router.get("/notification-system", async (req, res) => {
  try {
    const posts = await Posts.find();
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

module.exports = router;
