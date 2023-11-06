import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "#components/Navbar";
import axios from "axios";
export async function getServerSideProps(context) {
  /*
  //#region Auth
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
  //#endregion
  */

  let catsData = [];
  let validationRules = "";

  await axios
    .get("http://localhost:3000/api/cats/get")
    .then((res) => {
      catsData = res.data;
    })
    .catch((e) => {
      console.log(e);
    });

  await axios
    .get("http://localhost:3000/api/cats/getValidation")
    .then((res) => {
      validationRules = res.data;
    })
    .catch((e) => {
      console.log(e);
    });

  console.log(validationRules);
  return { props: { catsData, validationRules } };
}

const Home = ({ catsData, validationRules }) => {
  const router = useRouter();

  const [cats, setCats] = useState(catsData);

  return (
    <div className="flex flex-col w-screen h-screen">
      <Navbar />
      <div className="w-full h-full flex flex-row">
        <div className="flex flex-col h-full overflow-y-auto w-1/2">
          {cats.map((cat, index) => {
            return (
              <div className="flex flex-col px-3 py-5 bg-red-200">
                <p>{cat.name}</p>
                <p>{cat.breed}</p>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col h-full overflow-y-auto w-1/2 bg-blue-50 px-8 py-8">
          <p className="text-clue font-medium text-2xl">Validation Rules</p>
          {Object.keys(validationRules["$jsonSchema"].properties).map(
            (rule, index) => {
              return <div>{rule}:</div>;
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
