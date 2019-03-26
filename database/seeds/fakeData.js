const faker = require("faker");

module.exports = {
  createFakeTeamMembers,
  createFakeUsers,
  createFakeTrainingSeries,
  createFakePosts
};

const numberOfUsers = 10;
const numberOfPosts = 50;

function createFakeTeamMembers() {
  const fakeTeamMember = () => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    jobDescription: faker.commerce.department(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber(),
    TeamMemberCol: 1,
    user_ID: 56
  });

  const newTeamMember = fakeTeamMember();

  return newTeamMember;
}

// Creates 10 fake users
function createFakeUsers() {
  const fakeUsers = [];

  const fakeUser = () => ({
    accountTypeID: faker.random.number(2) + 1,
    email: faker.internet.email()
  });

  for (let i = 0; i < numberOfUsers; i++) {
    fakeUsers.push(fakeUser());
  }

  return fakeUsers;
}

function createFakeTrainingSeries() {
  const fakeSeries = () => ({
    title: faker.lorem.words(5),
    userID: faker.random.number({
      min: 1,
      max: 10
    })
  });

  const newSeries = fakeSeries();

  return newSeries;
}

// Creates 50 fake posts and adds them to users and training series randomly
function createFakePosts() {
  const fakePost = () => ({
    postName: faker.lorem.words(5),
    postDetails: faker.lorem.sentences(3),
    link: faker.internet.url(),
    daysFromStart: faker.random.number({
      min: 1,
      max: 21
    }),
    postImage: faker.image.imageUrl(),
    trainingSeriesID: faker.random.number({
      min: 28,
      max: 33
    })
  });

  const newPost = fakePost();

  return newPost;
}
