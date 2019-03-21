const faker = require("faker");

module.exports = {
  createFakeTeamMembers,
  createFakeUsers
};

const numberOfUsers = 10;

function createFakeTeamMembers() {
  const fakeTeamMembers = [];

  const fakeTeamMember = () => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    jobDescription: faker.commerce.department(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber(),
    TeamMemberCol: 1
  });

  for (let i = 0; i < numberOfUsers; i++) {
    fakeTeamMembers.push(fakeTeamMember());
  }

  return fakeTeamMembers;
}

// Creates 10 fake users
function createFakeUsers() {
  const fakeUsers = [];

  const fakeUser = () => ({
    accountTypeID: faker.random.number(2) + 1,
    authToken: faker.random.uuid()
  });

  for (let i = 0; i < numberOfUsers; i++) {
    fakeUsers.push(fakeUser());
  }

  return fakeUsers;
}
