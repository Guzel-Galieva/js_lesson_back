const { Router } = require("express");
const ErrorResponse = require("../classes/error-response");
const ToDo = require("../dataBase/models/ToDo.model");
const { requireToken, asyncHandler } = require("../middlewares/middlewares");
const router = Router();

function initRoutes() {
  router.get("/", asyncHandler(requireToken), asyncHandler(getToDos));
  router.get("/:id", asyncHandler(requireToken), asyncHandler(getToDoById));
  router.post("/", asyncHandler(requireToken), asyncHandler(createToDo));
  router.delete("/", asyncHandler(requireToken), asyncHandler(deleteToDos));
  router.delete("/:id", asyncHandler(requireToken), asyncHandler(deleteToDoById));
  router.patch("/:id", asyncHandler(requireToken), asyncHandler(updateToDo));
}

async function getToDos(req, res, next) {
  const todos = await ToDo.findAll({
    where: {
      userId: req.userId,
    },
  });

  res.status(200).json({todos});
}

async function getToDoById(req, res, next) {
  const todo = await ToDo.findOne({
    where: {
      id: req.params.id,
      userId: req.userId,
    },
  });

  if (!todo) {
    throw new ErrorResponse("No todo found", 404);
  }

  res.status(200).json(todo);
}

async function createToDo(req, res, next) {
  const todo = await ToDo.create({
    ...req.body,
    userId: req.userId,
  });
  
  res.status(200).json(todo);
}

async function deleteToDoById(req, res, next) {
  const todo = await ToDo.findOne({
    where: {
      id: req.params.id,
      userId: req.userId,
    },
  });

  if (!todo) {
    throw new ErrorResponse("No todo found", 404);
  }

  await todo.destroy();

  res.status(200).json({
    message: "ToDo is deleted!",
  });
}

async function deleteToDos(req, res, next) {
  await ToDo.destroy({
    where: {
      userId: req.userId,
    },
  });

  res.status(200).json({
    message: "All ToDo is deleted!",
  });
}

async function updateToDo(req, res, next) {
  const todo = await ToDo.findOne({
    where: {
      id: req.params.id,
      userId: req.userId,
    },
  });

  if (!todo) {
    throw new ErrorResponse("No todo found", 404);
  }

  await todo.update(req.body);

  res.status(200).json(todo);
}

initRoutes();

module.exports = router;
