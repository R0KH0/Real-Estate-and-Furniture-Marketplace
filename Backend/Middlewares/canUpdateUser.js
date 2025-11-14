export const canUpdateUser = (req, res, next) => {
  const requestedId = req.params.id;
  const loggedUserId = req.user._id.toString();
  const role = req.user.role;

  // Admin can update anyone
  if (role === "Admin") return next();

  // User can update only their own account
  if (requestedId === loggedUserId) return next();

  return res.status(403).json({
    message: "You are not allowed to update this account",
  });
};