import express from "express";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
const app = express();
const publicPath = path.resolve("public");
app.use(express.static(publicPath));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const dbName = "To-Do-Project";
const collectionName = "Todo";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const connection = async () => {
  const connect = await client.connect();
  return await connect.db(dbName);
};

app.get("/", async (req, resp) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.find().toArray();
    resp.render("list",{result});
  } catch (error) {
    console.error("Database error:", error); 
    resp.status(500).send("Error fetching data");
  }
});

app.get("/add", (req, resp) => {
  resp.render("add");
});

app.get("/delete/:id",async(req,resp)=>{
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({_id:new ObjectId(req.params.id)});
    if(result){
        resp.redirect("/");
    }
    else{
        resp.status(400).send("Some error occured");
    }
})
app.get("/update", (req, resp) => {
  resp.render("update");
});

app.post("/add", async (req, resp) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  if (req.body.title && req.body.description) {
    try {
      const result = await collection.insertOne(req.body);
      resp.redirect("/");
    } catch (error) {
      console.error("Error adding task:", error);
      resp.status(500).send("Error adding task");
    }
  } else {
    resp.status(400).send("Title and description are required");
  }
});
app.post("/update", (req, resp) => {
  resp.redirect("/");
});

app.listen(3000);
