const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const Todo = require("./models/Todos");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to database successfull"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server listen on port ${PORT}`);
});

app.get("/todos", async (req, res) => {
  const todo = await Todo.find();

  res.json(todo);
});

app.post("/todos/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  todo.save();

  res.json(todo);
});

app.delete("/todos/delete/:id", async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);

  res.json(todo);
});

app.get("/todos/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.complete = !todo.complete;

  todo.save();

  res.json(todo);
});

app.post("/todo/:id/subtodo/new", async (req, res) => {
  try {
    let todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          subTodos: {
            text: req.body.text,
          },
        },
      },
      {
        new: true,
      }
    );

    res.json(todo);
  } catch (error) {
    console.log(`error --- subtodo new`, error);
  }
});

app.get("/todo/:id/subtodo/:subId", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    subTodoArr = todo.subTodos;

    let objIndex = subTodoArr.findIndex((obj) => obj.id === req.params.subId);

    subTodoArr[objIndex].complete = !subTodoArr[objIndex].complete;

    todo.save();

    res.json(todo);
  } catch (error) {
    console.log(`error ---- complete subtodo`, error);
  }
});
