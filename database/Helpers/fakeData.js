const faker = require("faker");

//alter these values to generate different amounts of faked, seeded data for all tables minus accountTypes
const userSeeds = 1;
const seriesSeeds = 5;
const memberSeeds = 500;
const postSeeds = 20;

//since any number of many-to-many relationships can exist between series and users, arbitrarily capped it at 20 initially
const relationalSeeds = faker.random.number({ min: 1, max: 20 });

module.exports = {
  createFakeUsers,
  createFakeTrainingSeries,
  createFakeTeamMembers,
  createFakeRelationalEntries,
  createFakePosts
};

function createFakeUsers() {
  const newUsers = [];
  const fakeUser = () => ({
    accountTypeID: faker.random.number({ min: 1, max: 3 }),
    email: faker.internet.email()
  });
  for (let i = 0; i < userSeeds; i++) {
    newUsers.push(fakeUser());
  }
  return newUsers;
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
  const newTeamMembers = [];
  const fakeTeamMember = () => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    jobDescription: faker.commerce.department(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber(),
    slackID: "pending slack ID",
    teamsID: "pending teams ID",
    user_ID: faker.random.number({ min: 1, max: userSeeds })
  });
  for (let i = 0; i < memberSeeds; i++) {
    newTeamMembers.push(fakeTeamMember());
  }

  return newTeamMembers;
}

function createFakeRelationalEntries() {
  const newRelationalEntries = [];
  const fakeEntry = () => ({
    startDate: faker.date.future(1),
    teamMember_ID: faker.random.number({ min: 1, max: memberSeeds }),
    trainingSeries_ID: faker.random.number({ min: 1, max: seriesSeeds })
  });
  for (let i = 0; i < relationalSeeds; i++) {
    newRelationalEntries.push(fakeEntry());
  }
  return newRelationalEntries;
}

function createFakePosts() {
  const newPosts = [];
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
      min: 1,
      max: seriesSeeds
    })
  });
  for (let i = 0; i < postSeeds; i++) {
    newPosts.push(fakePost());
  }
  return newPosts;
}
