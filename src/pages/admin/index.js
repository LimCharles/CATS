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

  return { props: {} };
}

const Home = ({}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-screen h-screen">
      <Navbar />
      <div className="flex flex-col"></div>
    </div>
  );
};

export default Home;
