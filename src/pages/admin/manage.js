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

  let cats = [];

  await axios
    .get("http://localhost:3000/api/cats/get")
    .then((res) => {
      cats = res.data;
    })
    .catch((e) => {
      console.log(e);
    });

  return { props: { cats } };
}

const Home = ({}) => {
  const router = useRouter();

  const [cats, setCats] = useState([]);

  return (
    <div className="flex flex-col w-screen h-screen">
      <Navbar />
      <div className="flex flex-col">
        {cats.map((cat, index) => {
          return (
            <div className="flex flex-col px-3 py-5 bg-red-200">
              <p>{cat.name}</p>
              <p>{cat.breed}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
