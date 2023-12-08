import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "#components/Navbar";
import axios from "axios";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export async function getServerSideProps(context) {
  //#region Auth
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  //#endregion

  return { props: { session } };
}

const Home = ({ session }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-screen h-screen">
      <Navbar session={session} />
      <div className="flex flex-col">
        <p>This is a placeholder dashboard for users!</p>
      </div>
    </div>
  );
};

export default Home;
