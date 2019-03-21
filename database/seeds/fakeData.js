const faker = require("faker");

module.exports = {
  createFakeTeamMembers
};

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

  const numberOfUsers = 10;
  for (let i = 0; i < numberOfUsers; i++) {
    fakeTeamMembers.push(fakeTeamMember());
  }

  return fakeTeamMembers;
}
