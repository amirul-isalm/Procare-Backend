const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.jgifu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Pro-Care");
    const doctorCollection = database.collection("doctorCollection");
    const serviceCollection = database.collection("ServiceCollection");
    const userCollection = database.collection("UserCollection");
    const appoinmentCollection = database.collection("appoinmentCollection");
    const feedbackCollection = database.collection("feedbackCollection");

    // start create api
    //
    //
    //
    //
    //

    app.get("/doctors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await doctorCollection.findOne(query);
      res.json(result);
    });
    // appoinment collection
    app.post("/appoinment", async (req, res) => {
      const appoinment = req.body;
      const result = await appoinmentCollection.insertOne(appoinment);
      res.json(result);
    });
    // get your appoinment
    app.get("/booking-appoinment", async (req, res) => {
      const email = req.query.email;
      const coursor = { PataintEmail: email };

      const result = await appoinmentCollection.find(coursor).toArray();
      res.json(result);
    });
    // get all appoinment
    app.get("/all-appoinment", async (req, res) => {
      const result = await appoinmentCollection.find({}).toArray();
      res.json(result);
    });

    ///post feedback
    app.post("/addReview", async (req, res) => {
      const feedback = req.body;
      const result = await feedbackCollection.insertOne(feedback);
      res.json(result);
    });
    // post add doctor
    app.post("/add-doctor", async (req, res) => {
      const doctor = req.body.newDoctor;
      const result = await doctorCollection.insertOne(doctor);
      res.json(result);
    });

    //    get all data from doctorCollection database
    app.get("/all-doctor", async (req, res) => {
      const result = await doctorCollection.find({}).toArray();
      res.json(result);
    });
    app.post("/add-service", async (req, res) => {
      const service = req.body.newService;
      const result = await serviceCollection.insertOne(service);
      res.json(result);
    });
// update Appoinment Status
      app.put("/appoinment", async (req, res) => {
        const appoinment = req.body;
        const id = appoinment._id;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        delete appoinment._id;
        const updateDoc = {
          $set: appoinment,
        };
        const result = await appoinmentCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      });
    // delete feedback using id 
    app.delete("/feedback/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await feedbackCollection.deleteOne(query);
      res.json(result);
    });
    // delete feedback using id 
    app.delete("/appoinment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await appoinmentCollection.deleteOne(query);
      res.json(result);
    });
// update feedback Status
      app.put("/feedback", async (req, res) => {
        const feedback = req.body;
        const id = feedback._id;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        delete feedback._id;
        const updateDoc = {
          $set: feedback,
        };
        const result = await feedbackCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      });
    
    
    //    get all data from serviceCollection database
    app.get("/all-service", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.json(result);
    });
    // save user in database  email and passsword
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);

      res.json(result);
    });
    // save user in database  google login
    app.put("/users", async (req, res) => {
      const user = req.body;

      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    }); // check admin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      if (email) {
        const coursor = { email: email };
        const user = await userCollection.findOne(coursor);
        let isAdmin = false;
        if (user?.role === "admin") {
          isAdmin = true;
        }
        res.json({ admin: isAdmin });
      }
    });
    // get all review
    app.get("/feedback", async (req, res) => {
      const result = await feedbackCollection.find({}).toArray();
      res.json(result);
    });

    //
    //
    //
    //
    //
    //
  } finally {
    //    await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello !");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
