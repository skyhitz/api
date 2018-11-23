export async function getAuthenticatedUser(ctx: any) {
  let user = await ctx.user;
  if (!user) {
    throw 'Unauthorized User';
  }
  return user;
}