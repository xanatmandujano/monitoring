export const getPermissions = () => {
  const localInfo = localStorage.getItem("persist:root");
  const parse = JSON.parse(localInfo);
  const authState = JSON.parse(parse && parse.authState);
  const permissions = authState && authState.authInfo.permissions;

  return permissions;
};
