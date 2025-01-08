const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    res.status(401);
    throw new Error("Not authorized, admin only");
  }
  next();
};

module.exports = adminMiddleware;