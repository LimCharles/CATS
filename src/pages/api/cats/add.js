import { MongoClient, ObjectId } from "mongodb";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  if (req?.body?.catForm == null) return res.status(400).send("Bad request");
  const catForm = req.body.catForm;

  // What isn't logical to be added.
  if (catForm?.sex == "Male" && catForm?.isPregnant) {
    return res.status(400).send("Cat cannot be male and pregnant");
  }

  if (req.method === "POST") {
    const dbUrl = process.env.DATABASE_URL;
    const client = new MongoClient(dbUrl);

    try {
      await client.connect();
      const dbName = "databASE";
      const db = client.db(dbName);
      await client.connect();
      const collection = db.collection("cats");
      const result = await collection.insertOne(catForm);
      await client.close();
      return res.status(200).json(result);
    } catch (err) {
      if (err.code == 121) {
        return res.status(400).send("Cat did not pass validation");
      }
      return res.status(500).send("Internal server error");
    }
  } else {
    return res.status(405).send("Method not allowed");
  }
};

export default handler;
