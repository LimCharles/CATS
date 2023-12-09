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

  function convertObjectIds(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = obj[key];

        function checkAndConvert(value) {
          if (typeof value === "string") {
            if (/^[0-9a-fA-F]{24}$/.test(value)) {
              try {
                return new ObjectId(value);
              } catch (error) {
                console.error("Invalid ObjectId:", value, "in key:", key);
              }
            } else if (/^\d+$/.test(value) && key != "catId") {
              return parseInt(value, 10);
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
              try {
                return new Date(value);
              } catch (error) {
                console.error("Invalid Date:", value, "in key:", key);
              }
            }
          }
          return value;
        }

        function shouldDelete(value) {
          if (
            value === "" ||
            (Array.isArray(value) &&
              (value.length === 0 || value.every((item) => item === "")))
          ) {
            return true;
          } else if (typeof value === "object" && value !== null) {
            return Object.values(value).every((val) => shouldDelete(val));
          }
          return false;
        }

        if (shouldDelete(value)) {
          delete obj[key];
        } else if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] === "object" && value[i] !== null) {
              if (shouldDelete(value[i])) {
                delete value[i];
              } else {
                convertObjectIds(value[i]);
              }
            } else {
              value[i] = checkAndConvert(value[i]);
            }
          }
        } else if (typeof value === "object" && value !== null) {
          if (shouldDelete(value)) {
            delete obj[key];
          } else {
            convertObjectIds(value);
          }
        } else {
          obj[key] = checkAndConvert(value);
        }
      }
    }
  }

  convertObjectIds(catForm);

  if (req.method === "POST") {
    const dbUrl = process.env.DATABASE_URL;
    const client = new MongoClient(dbUrl);

    try {
      await client.connect();
      const dbName = "databASE";
      const db = client.db(dbName);
      const collection = db.collection("cats");
      const filter = { _id: catForm._id };
      const update = { $set: catForm };
      const result = await collection.updateOne(filter, update);
      await client.close();
      return res.status(200).json(result);
    } catch (err) {
      console.log(JSON.stringify(err));
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
