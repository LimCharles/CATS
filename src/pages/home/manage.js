import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "#components/Navbar";
import axios from "axios";
import RecursiveComponent from "#components/RecursiveComponent";
import Modal from "#components/Modal";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Select from "react-select";
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

  //#region Cat Form
  const [catForm, setCatForm] = useState({
    name: "",
    sex: "",
    age: "",
    breed: "",
    isAlive: "",
    isPregnant: "",
    identifiers: "",
    imageUrl: "",
    lastSighting: {
      location: "",
      dateTime: "",
    },
    medicalInfo: {
      causeOfDeath: "",
      dateOfDeath: "",
      hasVaccinations: "",
      vaccinationTypes: [],
      medicalHistory: "",
    },
    isNeutered: "",
    isPregnant: "",
    adoptionInfo: {
      adopterName: "",
      adopterContactInfo: "",
    },
    familyInfo: {
      parents: [],
      siblings: [],
      children: [],
    },
    notableActivity: "",
    remarks: "",
  });
  const [catFormOpen, setCatFormOpen] = useState(false);
  //#endregion

  const [loading, setLoading] = useState(false);

  //#region Are you sure? modal
  const [sureModalOpen, setSureModalOpen] = useState(false);
  //#endregion

  //#region Add Cat
  const addCat = async () => {
    setLoading(true);
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
        setError("");
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);

        if (e.response.status == 400) {
          setError("Data did not pass validation");
        }
      });
  };
  //#endregion

  //#region Update Cat
  const updateCat = async (cat) => {
    setLoading(true);
    await axios
      .post(
        `/api/cats/update`,
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
        setError("");
        setCatForm({});
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        if (e.response.status == 400) {
          setError("Data did not pass validation");
        }
      });
  };
  //#endregion

  //#region Delete Cat
  const [catForDeletion, setCatForDeletion] = useState(null);
  const deleteCat = async () => {
    setLoading(true);
    await axios
      .post(
        `/api/cats/delete`,
        {
          cat: catForDeletion,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        setCatFormOpen(false);
        let newCats = cats.filter((c) => c._id != catForDeletion._id);
        setCats(newCats);
        setCatForm({});
        setError("");
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        if (e.response.status == 400) {
          setError("Data did not pass validation");
        }
      });
  };
  //#endregion

  return (
    <div className="flex flex-col w-screen h-screen overflow-x-hidden">
      <Navbar session={session} />
      {/* Contact Form Modal */}

      <Modal hidden={!catFormOpen}>
        <div className="flex flex-col items-start w-full overflow-y-auto gap-3 py-6">
          <div className="flex flex-row justify-end px-4 w-full">
            <svg
              className="cursor-pointer"
              onClick={() => {
                setCatFormOpen(false);
                setCatForm({});
                setError("");
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

          <div className="flex flex-col gap-1">
            <label htmlFor="catName" className="text-left text-sm font-medium">
              Name
            </label>
            <input
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="catName"
              value={catForm.name}
              onChange={(e) => {
                setCatForm({ ...catForm, name: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p htmlFor="name" className="text-left text-sm font-medium">
              Sex
            </p>
            <Select
              isSearchable={true}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  sex: e.value,
                });
              }}
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
              ]}
              value={{
                label: catForm.sex,
                value: catForm.sex,
              }}
              components={{
                DropdownIndicator: () => (
                  <div className="mr-4">
                    <svg
                      width="10"
                      height="14"
                      viewBox="0 0 10 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2L7.25 7.25L2 12.5"
                        stroke="#d5b53c"
                        strokeWidth="2.86364"
                      />
                    </svg>
                  </div>
                ),
              }}
              className="text-sm rounded-md appearance-none border-[1px] border-crey font-sans text-left leading-tight font-light w-64 text-clue"
              styles={{
                placeholder: (baseStyles, state) => ({
                  ...baseStyles,
                  color: "#003A6C",
                }),
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  border: "0px",
                  outline: "0px",
                  minHeight: "34px",
                  height: "34px",
                  boxShadow: "none",
                  color: "#003A6C",
                }),
                valueContainer: (provided, state) => ({
                  ...provided,
                  height: "31px",
                  textAlign: "left",
                }),
                input: (provided, state) => ({
                  ...provided,
                  margin: "0px",
                }),
                indicatorSeparator: (state) => ({
                  display: "none",
                }),
                noOptionsMessage: (state) => ({
                  textAlign: "left",
                  padding: "0.5rem 1rem 0.5rem 1rem",
                }),
                option: (provided, state) => ({
                  ...provided,
                  color: "#003A6C",
                  backgroundColor: "white",
                  "&:active": {
                    backgroundColor: "white",
                  },
                  "&:hover": {
                    backgroundColor: "#d5b53c",
                  },
                  "&:focus": {
                    backgroundColor: "white",
                  },
                }),
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="age" className="text-left text-sm font-medium">
              Age
            </label>
            <input
              type="number"
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="age"
              value={catForm.age}
              onChange={(e) => {
                setCatForm({ ...catForm, age: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="breed" className="text-left text-sm font-medium">
              Breed
            </label>
            <input
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="breed"
              value={catForm.breed}
              onChange={(e) => {
                setCatForm({ ...catForm, breed: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p htmlFor="name" className="text-left text-sm font-medium">
              Pregnant
            </p>
            <Select
              isSearchable={true}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  isPregnant: e.value,
                });
              }}
              options={[
                { label: "True", value: true },
                { label: "False", value: false },
              ]}
              value={{
                label:
                  JSON.stringify(catForm.isPregnant) != '""' &&
                  JSON.stringify(catForm.isPregnant).charAt(0).toUpperCase() +
                    JSON.stringify(catForm.isPregnant).slice(1),
                value: catForm.isPregnant,
              }}
              components={{
                DropdownIndicator: () => (
                  <div className="mr-4">
                    <svg
                      width="10"
                      height="14"
                      viewBox="0 0 10 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2L7.25 7.25L2 12.5"
                        stroke="#d5b53c"
                        strokeWidth="2.86364"
                      />
                    </svg>
                  </div>
                ),
              }}
              className="text-sm rounded-md appearance-none border-[1px] border-crey font-sans text-left leading-tight font-light w-64 text-clue"
              styles={{
                placeholder: (baseStyles, state) => ({
                  ...baseStyles,
                  color: "#003A6C",
                }),
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  border: "0px",
                  outline: "0px",
                  minHeight: "34px",
                  height: "34px",
                  boxShadow: "none",
                  color: "#003A6C",
                }),
                valueContainer: (provided, state) => ({
                  ...provided,
                  height: "31px",
                  textAlign: "left",
                }),
                input: (provided, state) => ({
                  ...provided,
                  margin: "0px",
                }),
                indicatorSeparator: (state) => ({
                  display: "none",
                }),
                noOptionsMessage: (state) => ({
                  textAlign: "left",
                  padding: "0.5rem 1rem 0.5rem 1rem",
                }),
                option: (provided, state) => ({
                  ...provided,
                  color: "#003A6C",
                  backgroundColor: "white",
                  "&:active": {
                    backgroundColor: "white",
                  },
                  "&:hover": {
                    backgroundColor: "#d5b53c",
                  },
                  "&:focus": {
                    backgroundColor: "white",
                  },
                }),
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p htmlFor="name" className="text-left text-sm font-medium">
              Alive
            </p>
            <Select
              isSearchable={true}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  isAlive: e.value,
                });
              }}
              options={[
                { label: "True", value: true },
                { label: "False", value: false },
              ]}
              value={{
                label:
                  JSON.stringify(catForm.isAlive) != '""' &&
                  JSON.stringify(catForm.isAlive).charAt(0).toUpperCase() +
                    JSON.stringify(catForm.isAlive).slice(1),
                value: catForm.isAlive,
              }}
              components={{
                DropdownIndicator: () => (
                  <div className="mr-4">
                    <svg
                      width="10"
                      height="14"
                      viewBox="0 0 10 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2L7.25 7.25L2 12.5"
                        stroke="#d5b53c"
                        strokeWidth="2.86364"
                      />
                    </svg>
                  </div>
                ),
              }}
              className="text-sm rounded-md appearance-none border-[1px] border-crey font-sans text-left leading-tight font-light w-64 text-clue"
              styles={{
                placeholder: (baseStyles, state) => ({
                  ...baseStyles,
                  color: "#003A6C",
                }),
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  border: "0px",
                  outline: "0px",
                  minHeight: "34px",
                  height: "34px",
                  boxShadow: "none",
                  color: "#003A6C",
                }),
                valueContainer: (provided, state) => ({
                  ...provided,
                  height: "31px",
                  textAlign: "left",
                }),
                input: (provided, state) => ({
                  ...provided,
                  margin: "0px",
                }),
                indicatorSeparator: (state) => ({
                  display: "none",
                }),
                noOptionsMessage: (state) => ({
                  textAlign: "left",
                  padding: "0.5rem 1rem 0.5rem 1rem",
                }),
                option: (provided, state) => ({
                  ...provided,
                  color: "#003A6C",
                  backgroundColor: "white",
                  "&:active": {
                    backgroundColor: "white",
                  },
                  "&:hover": {
                    backgroundColor: "#d5b53c",
                  },
                  "&:focus": {
                    backgroundColor: "white",
                  },
                }),
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="identifiers"
              className="text-left text-sm font-medium"
            >
              Identifiers
            </label>
            <input
              type="number"
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="identifiers"
              value={catForm.identifiers}
              onChange={(e) => {
                setCatForm({ ...catForm, identifiers: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="imageUrl" className="text-left text-sm font-medium">
              Image URL
            </label>
            <input
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="imageUrl"
              value={catForm.imageUrl}
              onChange={(e) => {
                setCatForm({ ...catForm, imageUrl: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="lastSightingLocation"
              className="text-left text-sm font-medium"
            >
              Last Sighting Location
            </label>
            <input
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="lastSightingLocation"
              value={catForm.lastSighting?.location}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  lastSighting: {
                    ...catForm.lastSighting,
                    location: e.target.value,
                  },
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="lastSightingLocation"
              className="text-left text-sm font-medium"
            >
              Last Sighting Date
            </label>
            <input
              autoComplete="off"
              type="date"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="lastSightingLocation"
              value={catForm.lastSighting?.location}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  lastSighting: {
                    ...catForm.lastSighting,
                    dateTime: e.target.value,
                  },
                });
              }}
            />
          </div>

          <button
            onClick={() => {
              addCat();
            }}
            className="flex flex-row items-center justify-center px-4 py-2 bg-clue text-white rounded-md mt-4"
          >
            Add Cat
          </button>
          {error && <p className="text-red-500 text-xs text-left">{error}</p>}
        </div>
      </Modal>

      {/* Loading Modal */}
      <Modal hidden={!loading}>
        <div className="flex flex-col w-full gap-4 items-center h-40">
          <div className="flex flex-row gap-2">
            <Image alt="" src="/logo.png" width={30} height={30} />
            <p className="font-bold text-transparent text-lg bg-clip-text bg-gradient-to-r from-clue to-clue">
              CATS
            </p>
          </div>
          <div className="flex flex-col gap-4 items-center justify-center grow">
            <p className="font-bold text-3xl">Loading</p>
            <div className="flex flex-row gap-2 justify-center">
              <svg
                className="animate-superbounce"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="5" cy="5" r="5" fill="#0C3777" />
              </svg>
              <svg
                style={{
                  animationDelay: "0.3s",
                }}
                className="animate-superbounce"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="5" cy="5" r="5" fill="#0C3777" />
              </svg>
              <svg
                style={{
                  animationDelay: "0.5s",
                }}
                className="animate-superbounce"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="5" cy="5" r="5" fill="#0C3777" />
              </svg>
            </div>
          </div>
        </div>
      </Modal>

      {/* Are you sure? modal */}
      <Modal hidden={!sureModalOpen}>
        <div className="flex flex-col gap-4">
          <p className="text-left text-sm">
            Are you sure you want to delete this cat?
          </p>
          <div className="flex flex-row gap-8">
            <button
              type="button"
              onClick={() => {
                setSureModalOpen(false);
              }}
              className="font-poppins font-light flex flex-row gap-2 justify-center items-center text-clue rounded-md border-[1px] border-creen py-2 w-1/3 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setSureModalOpen(false);
                deleteCat(catForDeletion);
              }}
              className="font-poppins font-light flex flex-row gap-2 justify-center items-center bg-gradient-to-r from-clue to-clue rounded-md text-white py-2 w-1/3 text-sm"
            >
              Proceed
            </button>
          </div>
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
                    setSureModalOpen(true);
                    setCatForDeletion(cat);
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
          <div className="grid grid-cols-4 gap-x-6 auto-rows-auto my-3">
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
