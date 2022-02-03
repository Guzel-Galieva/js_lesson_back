const { Router } = require("express");
const ErrorResponse = require("../classes/error-response");
const User = require("../dataBase/models/User.model");
const { asyncHandler, requireToken } = require("../middlewares/middlewares");

const router = Router();

function initRoutes() {
  router.get("/me", asyncHandler(requireToken), asyncHandler(getUser));
  router.patch("/me", asyncHandler(requireToken), asyncHandler(patchUser));
  router.post("/logout", asyncHandler(requireToken), asyncHandler(userLogout));
}

async function getUser(req, res, next) {
  const user = await User.findByPk(req.userId);

  res.status(200).json(user);
}

async function patchUser(req, res, next) {
  const user = await User.findByPk(req.userId);

  await user.update(req.body);

  res.status(200).json(user);
}

async function userLogout(req, res, next) {
  await req.token.destroy();

  res.status(200).json({ 
    message: "User logout" 
  });
}

initRoutes();

module.exports = router;
