const faker = require("faker");

//alter these values to generate different amounts of faked, seeded data for all tables minus accountTypes
const userSeeds = 1;
const seriesSeeds = 5;
const memberSeeds = 500;
const messageSeeds = 20;
const notificationSeeds = 20;

//since any number of many-to-many relationships can exist between series and users, arbitrarily chooses less than total amount of team members
const relationalSeeds = faker.random.number({ min: 1, max: memberSeeds });

module.exports = {
  createFakeUsers,
  createFakeTrainingSeries,
  createFakeTeamMembers,
  createFakeRelationalEntries,
  createFakeMessages,
  createFakeNotifications
};

function createFakeUsers() {
  const newUsers = [];
  const fakeUser = () => ({
    account_type_id: faker.random.number({ min: 1, max: 3 }),
    email: faker.internet.email(),
    name: faker.name.findName()
  });
  for (let i = 0; i < userSeeds; i++) {
    newUsers.push(fakeUser());
  }
  return newUsers;
}

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
    slack_id: "pending slack ID",
    teams_id: "pending teams ID",
    user_id: faker.random.number({ min: 1, max: userSeeds })
  });
  for (let i = 0; i < memberSeeds; i++) {
    newTeamMembers.push(fakeTeamMember());
  }

  return newTeamMembers;
}

function createFakeRelationalEntries() {
  const newRelationalEntries = [];
  const fakeEntry = () => ({
    start_date: faker.date.future(1),
    team_member_id: faker.random.number({ min: 1, max: memberSeeds }),
    training_series_id: faker.random.number({ min: 1, max: seriesSeeds })
  });
  for (let i = 0; i < relationalSeeds; i++) {
    newRelationalEntries.push(fakeEntry());
  }
  return newRelationalEntries;
}

function createFakeMessages() {
  const newMessages = [];
  const fakeMessage = () => ({
    message_name: faker.lorem.words(5),
    message_details: faker.lorem.sentences(3),
    link: faker.internet.url(),
    days_from_start: faker.random.number({
      min: 1,
      max: 21
    }),
    training_series_id: faker.random.number({
      min: 1,
      max: seriesSeeds
    })
  });
  for (let i = 0; i < messageSeeds; i++) {
    newMessages.push(fakeMessage());
  }
  return newMessages;
}

function createFakeNotifications() {
  const newNotifications = [];
  const fakeNotification = () => ({
    send_date: faker.date.recent(10),
    message_name: faker.company.bs(),
    message_details: faker.company.catchPhrase(),
    link: faker.internet.url(),
    phone_number: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    message_id: faker.random.number({ min: 1, max: messageSeeds }),
    team_member_id: faker.random.number({ min: 1, max: memberSeeds }),
    days_from_start: faker.random.number({ min: 1, max: 21 }),
    job_description: faker.commerce.department(),
    training_series_id: faker.random.number({ min: 1, max: seriesSeeds }),
    user_id: faker.random.number({ min: 1, max: userSeeds }),
    text_sent: faker.random.boolean(),
    email_sent: faker.random.boolean(),
    text_on: faker.random.boolean(),
    email_on: faker.random.boolean()
  });

  for (let i = 0; i < notificationSeeds; i++) {
    newNotifications.push(fakeNotification());
  }
  return newNotifications;
}
