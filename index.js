import { error } from "console";
import express from "express";
import os from "os";
import { JSONFilePreset } from "lowdb/node";
const app = express();
const port = 8081;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dataBase = {
  dogs: [],
  cats: [],
  others: [],
};
const db = await JSONFilePreset("db.json", dataBase);
// app.get("/get-my-cpu", (req, res) => {
//   const cpuCount = os.cpus();
//   res.json({ cpuCount });
// });

app.post("/add-animals", async (req, res) => {
  const data = req.body;
  if (data.name && data.description && data.type) {
    if (data.type === "dogs") {
      await db.update(({ dogs }) => dogs.push(data));
    } else if (data.type === "cats") {
      dataBase.cats.push(data);
    } else {
      dataBase.others.push(data);
    }
  } else {
    res
      .status(500)
      .json({ done: false, error: "name description and type are required!" });
  }
  res.json({ done: true, error: null });
});

app.get("/return-dogs-v1", (req, res) => {
  res.json({ dogs: db.data.dogs, count: db.data.dogs.length });
});

app.get("/return-cats-v1", (req, res) => {
  res.json({ cat: dataBase.cats, count: dataBase.cats.length });
});
app.get("/return-others-v1", (req, res) => {
  res.json({ others: dataBase.others, count: dataBase.others.length });
});

app.get(["/animals/:type", "/animals"], (req, res) => {
  //   throw new Error("fuck!");
  //   console.log(req.params);
  if (req.params.type === "cats") {
    res.json({ cats: dataBase.cats, count: dataBase.cats.length });
    return;
  } else if (req.params.type === "dogs") {
    res.json({ dogs: dataBase.dogs, count: dataBase.dogs.length });
    return;
  } else if (req.params.type === "others") {
    res.json({ others: dataBase.others, count: dataBase.others.length });
    return;
  }
  res.status(500).json("Wrong type!");
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send("Something went wrong! " + err.message);
});

app.listen(port, () => {
  console.log(`Open port TEST ${port}`);
});
