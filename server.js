const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const assert = require("assert");

const app = express();
app.use(express.json());
const dataBase = "contactManager";
const mogou_url = "mongodb://localhost:27017";

MongoClient.connect(mogou_url, (err, client) => {
  assert.equal(err, null, "data base connection failed");
  const db = client.db(dataBase);

  app.post("/newcontact", (req, res) => {
    let newcontact = req.body;
    db.collection("contactlist").insertOne(newcontact, (err, data) => {
      if (err) res.send("can add contact");
      else res.send("contact ajouter");
    });
  });

  app.get("/contacts", (req, res) => {
    db.collection("contactlist")
      .find()
      .toArray((err, data) => {
        if (err) res.send("can fetch contact");
        else res.send(data);
      });
  });

  app.get("/contact/:id", (req, res) => {
    let id = ObjectID(req.params.id);
    db.collection("contactlist").findOne({ _id: id }, (err, data) => {
      if (err) res.send("can fetch contact");
      else res.send(data);
    });
  });

  app.put("/modifyProduct/:id", (req, res) => {
    let id = ObjectID(req.params.id);
    let contactedit = req.body;
    db.collection("contactlist").findOneAndUpdate(
      { _id: id },
      { $set: { ...contactedit } },
      (err, data) => {
        if (err) res.send("can edit contact");
        else res.send(data);
      }
    );
  });

  app.delete("/deletcontact/:id", (req, res) => {
    let id = ObjectID(req.params.id);
    db.collection("contactlist").findOneAndDelete({ _id: id }, (err, data) => {
      if (err) res.send("can delete product");
      else res.send(data);
    });
  });
});

app.listen(4070, (err) => {
  if (err) console.log("server err");
  else console.log("server is runnig on port 4070");
});