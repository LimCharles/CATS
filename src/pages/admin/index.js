import { useRouter } from "next/router";

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
  return { props: {} };
}

const Home = ({}) => {
  const router = useRouter();

  //example cats
  const cats = await axios.get("/api/cats/get")
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex flex-row px-12 bg-blue-200">
        <div className="px-3 py-4 hover:bg-yellow-50 trasition-all duration-300">
          <p>HOME</p>
        </div>
      </div>
      <div className="flex flex-col">
        {cats.map((cat, index) => {
          return (
            <div className="flex flex-col px-3 py-5 bg-red-200">
              <p>{cat.name}</p>
              <p>{cat.breed}</p>
              <p>penis</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
