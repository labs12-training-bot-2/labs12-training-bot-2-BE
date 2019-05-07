const faker = require("faker");
const uuidv4 = require("uuid/v4");

//alter these values to generate different amounts of faked, seeded data
const userSeeds = 5; //1 for each training_bot team mate to log in and have random data assigned to them
const seriesSeeds = 20;
const memberSeeds = 500;
const messageSeeds = 20;

module.exports = {
  createFakeTrainingSeries,
  createFakeTeamMembers,
  createFakeMessages
};

function createFakeTrainingSeries() {
  const newSeries = [];
  const fakeSeries = () => ({
    title: faker.company.catchPhrase(),
    user_id: faker.random.number({
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
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    job_description: faker.commerce.department(),
    email: faker.internet.email(),
    phone_number: faker.phone.phoneNumber(),
    slack_uuid: uuidv4(),
    user_id: faker.random.number({ min: 1, max: userSeeds }),
    manager_id: faker.random.number({ min: 1, max: memberSeeds }),
    mentor_id: faker.random.number({ min: 1, max: memberSeeds })
  });
  for (let i = 0; i < memberSeeds; i++) {
    newTeamMembers.push(fakeTeamMember());
  }

  return newTeamMembers;
}

function createFakeMessages() {
  const newMessages = [];
  const fakeMessage = () => ({
    subject: faker.company.catchPhrase(),
    body: faker.company.bs(),
    link: faker.internet.url(),
    training_series_id: faker.random.number({
      min: 1,
      max: seriesSeeds
    }),
    for_manager: false,
    for_mentor: false
  });
  for (let i = 0; i < messageSeeds; i++) {
    newMessages.push(fakeMessage());
  }
  return newMessages;
}
