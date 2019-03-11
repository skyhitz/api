import * as Express from 'express';
import * as BodyParser from 'body-parser';
import Database from '../database';
import { Schema } from './schema';
import { onRequest } from './cloud-functions';
import { Config } from '../config';
import * as jwt from 'express-jwt';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
const compression = require('compression');
// import { webhooks } from '../webhooks/webhooks';
import { corsOptions } from './cors';
let cors = require('cors');

const buildOptions: any = async (req: any) => {
  let context = {
    user: req.user
      ? Database.models.user.findOne({
          where: { id: req.user.id, version: req.user.version },
        })
      : Promise.resolve(null),
  };
  return {
    schema: Schema,
    context: context,
  };
};

const setupGraphQLServer = () => {
  const graphQLServer = Express();

  graphQLServer.use(compression());
  graphQLServer.use(cors(corsOptions));

  graphQLServer.use(
    '/graphql',
    BodyParser.json(),
    jwt({
      secret: Config.JWT_SECRET,
      credentialsRequired: false,
    }),
    graphqlExpress(buildOptions)
  );

  if (Config.ENV !== 'development') {
    /**
     * We prepend /function-name the http trigger created is:
     * https://us-central1-skyhitz-161021.cloudfunctions.net/function-name/graphql
     * We take it out on development mode since we don't need it when running the server locally.
     */
    graphQLServer.use(
      '/graphiql',
      graphiqlExpress({ endpointURL: `${Config.API_ENDPOINT}/graphql` })
    );

    return graphQLServer;
  }
  graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: `/graphql` }));
  return graphQLServer;
};

const graphQLServer = setupGraphQLServer();

// webhooks(graphQLServer);

if (Config.ENV === 'development') {
  graphQLServer.listen(3000);
}

export const graphql = onRequest(graphQLServer);
