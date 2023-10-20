import { MongoClient } from "mongodb";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

const handler = async (req, res) => {
  /*
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send("Unauthorized");
  }
  */

  const dbName = "databASE";
  if (req.method === "GET") {
    const dbUrl = process.env.DATABASE_URL;
    const client = new MongoClient(dbUrl);

    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection("cats");
      const cats = await collection.find().toArray();
      await client.close();
      return res.status(200).json(cats);
    } catch (err) {
      return res.status(500).send("Internal server error");
    }
  } else {
    return res.status(405).send("Method not allowed");
  }
};

export default handler;
