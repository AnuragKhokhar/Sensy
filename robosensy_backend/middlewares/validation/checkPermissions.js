const checkPermissions = (requiredPermissions) => {
    return (req, res, next) => {
      const userPermissions = req.user.permissions;
      const hasPermission = requiredPermissions.every(permission => 
        userPermissions.some(userPermission => 
          userPermission.module === permission.module &&
          permission.submodules.every(submodule => userPermission.submodules.includes(submodule))
        )
      );
  
      if (!hasPermission) {
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      next();
    };
  };
  
  export default checkPermissions;
  