const faker = require("faker");

module.exports = {
  createFakeUsers
};

function createFakeUsers() {
  const fakeUsers = [];

  const fakeUser = () => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    jobDescription: faker.commerce.department(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber(),
    TeamMemberCol: 1
  });

  const numberOfUsers = 10;
  for (let i = 0; i < numberOfUsers; i++) {
    fakeUsers.push(fakeUser());
  }

  return fakeUsers;
}
