export const isUserAdmin = (req, res, next) => {
  try {
    if (!req.user.userType.includes("admin")) {
      return res
        .status(403)
        .json({ error: "Only admin can access this route" });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: "failed",
      message: "Server Error",
      error: err.message,
    });
  }
};

export const isUserManager = (req, res, next) => {
  if (!req.user.userType.includes("branchManager")) {
    return res
      .status(403)
      .json({ error: "Only manager can access this route" });
  }
  next();
};
