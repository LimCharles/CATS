import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "#components/Navbar";
import axios from "axios";
import RecursiveComponent from "#components/RecursiveComponent";
import Modal from "#components/Modal";
import RecursiveInput from "#components/RecursiveInput";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  if (session?.user?.role != "Admin") {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  let catsData = [];
  let validationRules = "";

  await axios
    .get(`${process.env.BASE_URL}/api/cats/get`, {
      withCredentials: true,
      headers: {
        Cookie: context.req.headers.cookie,
      },
    })
    .then((res) => {
      catsData = res.data;
    })
    .catch((e) => {
      console.log(e);
    });

  await axios
    .get(`${process.env.BASE_URL}/api/cats/getValidation`, {
      withCredentials: true,
      headers: {
        Cookie: context.req.headers.cookie,
      },
    })
    .then((res) => {
      validationRules = res.data;
    })
    .catch((e) => {
      console.log(e);
    });

  return { props: { catsData, validationRules, session } };
}

const Home = ({ catsData, validationRules, session }) => {
  const router = useRouter();
  const [cats, setCats] = useState(catsData);
  const [error, setError] = useState("");
  //#region Contact Form
  const [catForm, setCatForm] = useState({});
  const [catFormOpen, setCatFormOpen] = useState(false);
  //#endregion

  const addCat = async () => {
    await axios
      .post(
        `/api/cats/add`,
        {
          catForm,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        setCatFormOpen(false);
        setCats([...cats, catForm]);
        setCatForm({});
      })
      .catch((e) => {
        if (e.response.status == 400) {
          setError("Data did not pass validation");
        }
      });
  };

  const deleteCat = async (cat) => {
    await axios
      .post(
        `/api/cats/delete`,
        {
          cat,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        setCatFormOpen(false);
        let newCats = cats.filter((c) => c._id != cat._id);
        setCats(newCats);
        setCatForm({});
      })
      .catch((e) => {
        if (e.response.status == 400) {
          setError("Data did not pass validation");
        }
      });
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-x-hidden">
      <Navbar session={session} />
      <Modal hidden={!catFormOpen}>
        <div className="flex flex-col items-start w-full overflow-y-scroll gap-3 py-6">
          <div className="flex flex-row justify-end px-4 w-full">
            <svg
              className="cursor-pointer"
              onClick={() => {
                setCatFormOpen(false);
              }}
              width={36}
              height={36}
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="17.6776"
                cy="17.6777"
                r="12"
                transform="rotate(45 17.6776 17.6777)"
                fill="white"
                stroke="#ADADAD"
              />
              <path
                d="M20.8596 14.4955L14.4956 20.8594M20.8596 20.8594L14.4956 14.4955"
                stroke="#959595"
                strokeWidth="1.25"
              />
            </svg>
          </div>
          {Object.entries(validationRules).map((rule, index) => {
            if (rule[0] == "required") return <></>;
            return (
              <RecursiveInput
                key={index}
                rule={rule}
                catForm={catForm}
                setCatForm={setCatForm}
                cats={cats}
              />
            );
          })}
          <button
            onClick={() => {
              addCat();
            }}
            className="flex flex-row items-center justify-center px-4 py-2 bg-cellow text-clue rounded-md mt-6"
          >
            Add Cat
          </button>
          {error && <p className="text-red-500 text-xs text-left">{error}</p>}
        </div>
      </Modal>
      <div className="w-full grow overflow-auto flex flex-row">
        <div className="flex flex-col overflow-y-auto w-1/2 p-8">
          <div className="flex flex-row justify-end">
            <button
              className="rounded-[50%] bg-cellow h-[30px] w-[30px]"
              onClick={() => {
                setCatFormOpen(true);
              }}
            >
              <p className="text-white text-xl">+</p>
            </button>
          </div>

          {cats.map((cat, index) => {
            return (
              <div className="grid grid-cols-12 w-full justify-between items-center">
                <div className="flex flex-col px-3 py-5 col-span-6">
                  <p>Name: {cat.name}</p>
                  <p>Breed: {cat.breed}</p>
                </div>
                <div className="flex flex-col px-3 py-5 col-span-4">
                  <p>Age: {cat.age}</p>
                  <p>Alive: {JSON.stringify(cat.isAlive)}</p>
                </div>
                <svg
                  onClick={() => {
                    deleteCat(cat);
                  }}
                  className="cursor-pointer"
                  height={30}
                  width={30}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g id="trash">
                    <path d="M20,8.7H4A.75.75,0,1,1,4,7.2H20a.75.75,0,0,1,0,1.5Z" />
                    <path d="M16.44,20.75H7.56A2.4,2.4,0,0,1,5,18.49V8a.75.75,0,0,1,1.5,0V18.49c0,.41.47.76,1,.76h8.88c.56,0,1-.35,1-.76V8A.75.75,0,1,1,19,8V18.49A2.4,2.4,0,0,1,16.44,20.75Zm.12-13A.74.74,0,0,1,15.81,7V5.51c0-.41-.48-.76-1-.76H9.22c-.55,0-1,.35-1,.76V7a.75.75,0,1,1-1.5,0V5.51A2.41,2.41,0,0,1,9.22,3.25h5.56a2.41,2.41,0,0,1,2.53,2.26V7A.75.75,0,0,1,16.56,7.76Z" />
                    <path d="M10.22,17a.76.76,0,0,1-.75-.75V11.72a.75.75,0,0,1,1.5,0v4.52A.75.75,0,0,1,10.22,17Z" />
                    <path d="M13.78,17a.75.75,0,0,1-.75-.75V11.72a.75.75,0,0,1,1.5,0v4.52A.76.76,0,0,1,13.78,17Z" />
                  </g>
                </svg>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col overflow-y-auto grow bg-blue-50 p-8">
          <p className="text-clue font-medium text-2xl">Validation Rules</p>
          <div className="grid grid-cols-4 gap-x-12 auto-rows-auto my-3">
            <p className="text-lg text-clue">Attribute Name</p>
            <p className="text-lg text-clue">Value</p>
            <p className="text-lg text-clue">Required</p>
            <p className="text-lg text-clue">Array Type</p>
          </div>

          {Object.entries(validationRules).map((rule, index) => {
            if (rule[0] == "required") return <></>;
            return (
              <RecursiveComponent
                key={index}
                rule={rule}
                required={
                  validationRules?.required.includes(rule[0]) ? true : false
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
