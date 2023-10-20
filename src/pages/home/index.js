import { useState, useEffect, useRef } from "react";
import Modal from "#components/Modal";
import Image from "next/image";
import Select from "react-select";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export async function getServerSideProps(context) {
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

  return { props: {} };
}

const Home = ({}) => {
  const router = useRouter();

  return <div className="flex flex-row w-screen h-screen"></div>;
};

export default Home;
