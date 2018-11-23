require("ts-node").register(require("./tsconfig.json"));

const server = require("./graphql/server.ts");

exports.graphql = server.graphql;
