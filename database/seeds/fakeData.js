const faker = require("faker");

const userSeeds = 1;
const seriesSeeds = 5;
const memberSeeds = 500;
const postSeeds = 20;

module.exports = {
  createFakeUsers,
  createFakeTrainingSeries,
  createFakeTeamMembers,
  createFakePosts
};

function createFakeUsers() {
  const fakeUsers = [];
  const fakeUser = () => ({
    accountTypeID: faker.random.number({ min: 1, max: 3 }),
    email: faker.internet.email()
  });
  for (let i = 0; i < userSeeds; i++) {
    fakeUsers.push(fakeUser());
  }
  return fakeUsers;
}

function createFakeTrainingSeries() {
  const newSeries = [];
  const fakeSeries = () => ({
    title: faker.lorem.words(5),
    userID: faker.random.number({
      min: 1,
      max: userSeeds
    })
  });

  for (let i = 0; i < seriesSeeds; i++) {
    newSeries.push(fakeSeries());
  }

  return newSeries;
}

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
