export const FieldErrors = (obj) => {
  for (const key in obj) {
    if (obj[key] === true) {
      return key;
    }
  }
  return null;
};

export const hasSubmodulePermission = (userPermissions, moduleKey, submoduleKey) => {
  if (!userPermissions) return false;

  const module = userPermissions.find((module) => module.moduleKey === moduleKey);

  if (module && module.submodules) {
    return module.submodules.some((submodule) => {
      return submodule.submoduleKey === submoduleKey && submodule.hasPermission;
    });
  }

  return false;
};
