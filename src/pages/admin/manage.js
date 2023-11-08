import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "#components/Navbar";
import axios from "axios";
import RecursiveComponent from "#components/RecursiveComponent";
import Modal from "#components/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

  return { props: { catsData, validationRules } };
}

const Home = ({ catsData, validationRules }) => {
  const router = useRouter();
  const [cats, setCats] = useState(catsData);

  //#region Contact Form
  const [catForm, setCatForm] = useState({
    name: "",
    company: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const catSchema = z;

  const {
    clearErrors: clearCatFormErrors,
    register: registerCatForm,
    handleSubmit: handleCatFormSubmit,
    control: catFormControl,
    reset: resetCatForm,
    formState: { errors: catFormErrors },
    setValue: setCatFormValue,
  } = useForm({
    resolver: zodResolver(catSchema),
    mode: "onBlur",
  });

  const [catFormOpen, setCatFormOpen] = useState(false);
  //#endregion

  return (
    <div className="flex flex-col w-screen h-screen overflow-x-hidden">
      <Navbar />
      <Modal hidden={!catFormOpen}>
        <p>HEY</p>
      </Modal>
      <div className="w-full grow overflow-auto flex flex-row">
        <div className="flex flex-col overflow-y-auto w-1/2 p-8">
          <button
            className="rounded-[50%] bg-cellow h-[30px] w-[30px] absolute"
            onClick={() => {
              setCatFormOpen(true);
            }}
          >
            <p className="text-white text-xl">+</p>
          </button>
          {cats.map((cat, index) => {
            return (
              <div className="flex flex-col px-3 py-5 bg-red-200">
                <p>{cat.name}</p>
                <p>{cat.breed}</p>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col overflow-y-auto grow bg-blue-50 p-8">
          <p className="text-clue font-medium text-2xl">Validation Rules</p>
          <div className="grid grid-cols-3 gap-x-4 auto-rows-auto my-3">
            <p className="text-lg text-clue">Attribute Name</p>
            <p className="text-lg text-clue">Value</p>
            <p className="text-lg text-clue">Array Type</p>
          </div>

          {Object.entries(validationRules).map((rule, index) => {
            return <RecursiveComponent key={index} rule={rule} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
