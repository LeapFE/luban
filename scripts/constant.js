const organizationName = "luban-cli";
process.env.ORGANIZATION_NAME = organizationName;

// cli-shared-types weight: 12
// cli-shared-utils weight: 11
// cli weight: 10
// cli-plugin-service weight: 9
// ...other packages weight: < 9
const PACKAGE_WEIGHT_LIST = {
  "cli-shared-types": 12,
  "cli-shared-utils": 11,
  cli: 10,
  "cli-plugin-service": 9,
};

module.exports = {
  organizationName,
  PACKAGE_WEIGHT_LIST,
};
