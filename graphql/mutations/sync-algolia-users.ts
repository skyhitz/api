import { GraphQLBoolean } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import { usersIndex } from '../../algolia/algolia';
import { usersToAlgoliaUsers } from '../../parser/parser';
import Database from '../../database';

const syncAlgoliaUsers = {
  type: GraphQLBoolean,
  async resolve(_: any, args: any, ctx: any) {
    await getAuthenticatedUser(ctx);
    let users = await Database.models.user.findAll();
    let algoliaObjects = usersToAlgoliaUsers(users);
    usersIndex.partialUpdateObjects(
      algoliaObjects,
      (err: any, content: any) => {
        if (err) throw err;
        console.log(content);
      }
    );
    return true;
  }
};

export default syncAlgoliaUsers;
