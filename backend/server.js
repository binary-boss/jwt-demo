import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 5002;

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

app.post("/api/posts", verifyToken, (req, res) => {
  res.send({
    message: "Post Created",
  });
});

app.post("/api/login", (req, res) => {
  const user = {
    id: "007",
    username: "james",
    email: "james@mi5.com",
  };
  jwt.sign(
    { user },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "2m",
    },
    (err, token) => {
      res.json({ token });
    }
  );
});

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    res.sendStatus(401);
  } else {
    const token = req.headers.authorization.split(" ");
    if (token.length !== 2) {
      res.sendStatus(403);
    }
    jwt.verify(token[1], process.env.JWT_SECRET_KEY, (err, authData) => {
      if (!err) {
        next();
      }
      res.sendStatus(403);
    });
  }
}

app.listen(PORT, () =>
  console.log(`Server started on:http://localhost:${PORT}`)
);
