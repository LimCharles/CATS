import { MongoClient } from "mongodb";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  const dbName = "databASE";
  if (req.method === "GET") {
    const dbUrl = process.env.DATABASE_URL;
    const client = new MongoClient(dbUrl);

    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = await db.command({
        listCollections: 1,
        filter: { name: "cats" },
      });

      const validationRules =
        collection?.cursor?.firstBatch[0]?.options?.validator["$jsonSchema"];
      let rules = {};

      const unwrapObject = (objKey, objValue) => {
        let unwrapRules = {};
        for (const [key, value] of Object.entries(objValue.properties)) {
          if (value.bsonType != "object") {
            if (value.bsonType == "array") {
              if (value?.items?.bsonType == "object") {
                unwrapObject(key + " object array", value.items);
              } else {
                unwrapRules[key + " array"] =
                  value.bsonType + " " + value.items.bsonType;
              }
            } else {
              unwrapRules[key] = value.bsonType;
            }
          } else {
            unwrapObject(key, value);
          }
        }

        rules[objKey] = unwrapRules;
      };

      for (const [key, value] of Object.entries(validationRules.properties)) {
        if (value.bsonType != "object") {
          if (value.bsonType == "array") {
            rules[key + " array"] = value.bsonType + " " + value.items.bsonType;
            continue;
          }
          rules[key] = value.bsonType;
        } else {
          unwrapObject(key, value);
        }
      }

      rules["required"] = validationRules.required;
      await client.close();
      return res.status(200).json(rules);
    } catch (err) {
      return res.status(500).send("Internal server error");
    }
  } else {
    return res.status(405).send("Method not allowed");
  }
};

export default handler;
