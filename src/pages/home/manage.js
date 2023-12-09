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

  function formatDate(date) {
    return new Date(date).toISOString().slice(0, 10);
  }

  function convertDatesInObject(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = obj[key];

        // Check if the value is a string and contains dashes, suggesting a date format
        if (
          typeof value === "string" &&
          value.includes("-") &&
          !isNaN(Date.parse(value))
        ) {
          obj[key] = formatDate(value);
        } else if (Array.isArray(value)) {
          obj[key] = value.map((item) => {
            if (
              typeof item === "string" &&
              item.includes("-") &&
              !isNaN(Date.parse(item))
            ) {
              return formatDate(item);
            } else if (typeof item === "object") {
              return convertDatesInObject(item);
            } else {
              return item;
            }
          });
        } else if (typeof value === "object") {
          convertDatesInObject(value);
        }
      }
    }
    return obj;
  }

  catsData = catsData.map((cat) => convertDatesInObject(cat));

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

  let areas;
  await axios
    .get(`${process.env.BASE_URL}/api/areas/get`)
    .then((res) => {
      areas = res.data;
      areas = areas.map((area) => {
        return { value: area._id, label: area.name };
      });
    })
    .catch((e) => {
      console.log(e);
    });

  return { props: { catsData, validationRules, session, areas } };
}

const Home = ({ catsData, validationRules, session, areas }) => {
  const router = useRouter();
  const [cats, setCats] = useState(catsData);
  const [error, setError] = useState("");

  let catsOptions = cats.map((cat) => {
    return { label: cat.name, value: cat._id };
  });

  //#region Cat Form
  const [catForm, setCatForm] = useState({
    catId: "",
    name: "",
    sex: "",
    age: "",
    breed: "",
    isAlive: "",
    isPregnant: "",
    isNeutered: "",
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
    adoptionInfo: {
      adopterName: "",
      adopterContactInfo: "",
    },
    familyInfo: {
      parents: ["", ""],
      siblings: [],
      children: [],
    },
    notableActivity: "",
    remarks: "",
  });

  const resetCatForm = () => {
    setCatForm({
      catId: "",
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
  };
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
        resetCatForm();
        setError("");
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        if (e.response.status == 400) {
          setError(e.response.data);
        }
      });
  };
  //#endregion

  //#region Update Cat
  const [editing, setEditing] = useState(false);
  const updateCat = async () => {
    setLoading(true);
    await axios
      .post(
        `/api/cats/update`,
        {
          catForm,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        setCatFormOpen(false);

        setCats((prevCats) => {
          let newCats = [...prevCats];
          let index = newCats.findIndex((c) => c._id == catForm._id);
          newCats[index] = catForm;
          return newCats;
        });
        setError("");
        resetCatForm();
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
        resetCatForm();
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
      {/* Cat Form Modal */}
      <Modal hidden={!catFormOpen}>
        <div className="flex flex-col items-start w-full overflow-y-auto gap-5 py-6">
          <div className="flex flex-row justify-end px-4 w-full">
            <svg
              className="cursor-pointer"
              onClick={() => {
                setEditing(false);
                setCatFormOpen(false);
                resetCatForm();
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
            <label htmlFor="catId" className="text-left text-sm font-medium">
              Cat ID
            </label>
            <input
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="catId"
              value={catForm.catId}
              onChange={(e) => {
                setCatForm({ ...catForm, catId: e.target.value });
              }}
            />
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
              Neutered
            </p>
            <Select
              isSearchable={true}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  isNeutered: e.value,
                });
              }}
              options={[
                { label: "True", value: true },
                { label: "False", value: false },
              ]}
              value={{
                label:
                  JSON.stringify(catForm.isNeutered) != '""' &&
                  JSON.stringify(catForm.isNeutered).charAt(0).toUpperCase() +
                    JSON.stringify(catForm.isNeutered).slice(1),
                value: catForm.isNeutered,
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
            <Select
              isSearchable={true}
              options={areas}
              value={{
                label:
                  areas.length > 0 &&
                  catForm?.lastSighting?.location &&
                  areas.find((a) => {
                    return a.value == catForm?.lastSighting?.location;
                  })?.label,
                value:
                  areas.length > 0 &&
                  catForm?.lastSighting?.location &&
                  areas.find((a) => {
                    return a.value == catForm?.lastSighting?.location;
                  })?.label,
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
              className="text-base rounded-md appearance-none border-[1px] border-crey font-sans text-left leading-tight font-light w-64 text-clue"
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
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  lastSighting: {
                    ...catForm.lastSighting,
                    location: e.value,
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
              value={catForm.lastSighting?.dateTime}
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

          <div className="flex flex-col gap-1">
            <label
              htmlFor="causeOfDeath"
              className="text-left text-sm font-medium"
            >
              Cause of Death
            </label>
            <input
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="causeOfDeath"
              value={catForm.medicalInfo.causeOfDeath}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  medicalInfo: {
                    ...catForm.medicalInfo,
                    causeOfDeath: e.target.value,
                  },
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="dateOfDeath"
              className="text-left text-sm font-medium"
            >
              Date of Death
            </label>
            <input
              type="date"
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="dateOfDeath"
              value={catForm.medicalInfo.dateOfDeath}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  medicalInfo: {
                    ...catForm.medicalInfo,
                    dateOfDeath: e.target.value,
                  },
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p htmlFor="name" className="text-left text-sm font-medium">
              Has Vaccinations
            </p>
            <Select
              isSearchable={true}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  medicalInfo: {
                    ...catForm.medicalInfo,
                    hasVaccinations: e.value,
                  },
                });
              }}
              options={[
                { label: "True", value: true },
                { label: "False", value: false },
              ]}
              value={{
                label:
                  JSON.stringify(catForm.medicalInfo.hasVaccinations) != '""' &&
                  JSON.stringify(catForm.medicalInfo.hasVaccinations)
                    .charAt(0)
                    .toUpperCase() +
                    JSON.stringify(catForm.medicalInfo.hasVaccinations).slice(
                      1
                    ),
                value: catForm.medicalInfo.hasVaccinations,
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

          <div className="flex flex-col gap-2">
            <p htmlFor="name" className="text-left text-sm font-medium">
              Vaccination Types
            </p>
            {catForm.medicalInfo.vaccinationTypes.length > 0 &&
              catForm.medicalInfo.vaccinationTypes.map(
                (vaccinationType, index) => {
                  return (
                    <div className="flex flex-row gap-4">
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="vaccinationType"
                          className="text-left text-sm font-medium"
                        >
                          Vaccination Type
                        </label>
                        <input
                          autoComplete="off"
                          className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-40 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
                          id="vaccinationType"
                          value={
                            catForm.medicalInfo.vaccinationTypes[index]
                              .vaccinationType
                          }
                          onChange={(e) => {
                            setCatForm((prev) => {
                              let newVaccinationTypes =
                                prev.medicalInfo.vaccinationTypes;
                              newVaccinationTypes[index].vaccinationType =
                                e.target.value;
                              return {
                                ...prev,
                                medicalInfo: {
                                  ...prev.medicalInfo,
                                  vaccinationTypes: newVaccinationTypes,
                                },
                              };
                            });
                          }}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="vaccinationDate"
                          className="text-left text-sm font-medium"
                        >
                          Vaccination Date
                        </label>
                        <input
                          type="date"
                          autoComplete="off"
                          className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-40 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
                          id="vaccinationDate"
                          value={
                            catForm.medicalInfo.vaccinationTypes[index]
                              .vaccinationDate
                          }
                          onChange={(e) => {
                            setCatForm((prev) => {
                              let newVaccinationTypes =
                                prev.medicalInfo.vaccinationTypes;
                              newVaccinationTypes[index].vaccinationDate =
                                e.target.value;
                              return {
                                ...prev,
                                medicalInfo: {
                                  ...prev.medicalInfo,
                                  vaccinationTypes: newVaccinationTypes,
                                },
                              };
                            });
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            <div className="flex flex-row gap-3 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                fill="none"
                className="cursor-pointer"
                onClick={() => {
                  setCatForm({
                    ...catForm,
                    medicalInfo: {
                      ...catForm.medicalInfo,
                      vaccinationTypes: [
                        ...catForm.medicalInfo.vaccinationTypes,
                        {
                          vaccinationType: "",
                          vaccinationDate: "",
                        },
                      ],
                    },
                  });
                }}
              >
                <rect
                  width="16"
                  height="16"
                  stroke="#d5b53c"
                  strokeWidth="1.5"
                  rx="8"
                  transform="scale(1 -1) rotate(45 33.238 2.747)"
                />
                <path
                  stroke="#d5b53c"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15.103 11.495h-3.536V7.96"
                />
                <path
                  stroke="#d5b53c"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M11.678 14.92v-3.535H8.142"
                />
              </svg>
              <p className="text-sm">Add Vaccination Type</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="medicalHistory"
              className="text-left text-sm font-medium"
            >
              Medical History
            </label>
            <input
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="medicalHistory"
              value={catForm.medicalInfo.medicalHistory}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  medicalInfo: {
                    ...catForm.medicalInfo,
                    medicalHistory: e.target.value,
                  },
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="adopterName"
              className="text-left text-sm font-medium"
            >
              Adopter Name
            </label>
            <input
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="adopterName"
              value={catForm.adoptionInfo.adopterName}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  adoptionInfo: {
                    ...catForm.adoptionInfo,
                    adopterName: e.target.value,
                  },
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="adopterContactInfo"
              className="text-left text-sm font-medium"
            >
              Adopter Contact Info
            </label>
            <input
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="adopterContactInfo"
              value={catForm.adoptionInfo.adopterContactInfo}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  adoptionInfo: {
                    ...catForm.adoptionInfo,
                    adopterContactInfo: e.target.value,
                  },
                });
              }}
            />
          </div>

          <div className="flex flex-row gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="parent" className="text-left text-sm font-medium">
                Parent
              </label>
              <Select
                isSearchable={true}
                options={catsOptions}
                value={{
                  label:
                    catsOptions.length > 0 &&
                    catsOptions.find((c) => {
                      return c.value == catForm?.familyInfo?.parents[0];
                    })?.label,
                  value:
                    catsOptions.length > 0 &&
                    catsOptions.find((c) => {
                      return c.value == catForm?.familyInfo?.parents[0];
                    })?.label,
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
                className="text-base rounded-md appearance-none border-[1px] border-crey font-sans text-left leading-tight font-light w-40 text-clue"
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
                onChange={(e) => {
                  setCatForm((prev) => {
                    let parents = prev.familyInfo.parents;
                    parents[0] = e.value;
                    return {
                      ...prev,
                      familyInfo: {
                        ...prev.familyInfo,
                        parents: parents,
                      },
                    };
                  });
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="parent" className="text-left text-sm font-medium">
                Parent
              </label>
              <Select
                isSearchable={true}
                options={catsOptions}
                value={{
                  label:
                    catsOptions.length > 0 &&
                    catsOptions.find((c) => {
                      return c.value == catForm?.familyInfo?.parents[1];
                    })?.label,
                  value:
                    catsOptions.length > 0 &&
                    catsOptions.find((c) => {
                      return c.value == catForm?.familyInfo?.parents[1];
                    })?.label,
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
                className="text-base rounded-md appearance-none border-[1px] border-crey font-sans text-left leading-tight font-light w-40 text-clue"
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
                onChange={(e) => {
                  setCatForm((prev) => {
                    let parents = prev.familyInfo.parents;
                    parents[1] = e.value;
                    return {
                      ...prev,
                      familyInfo: {
                        ...prev.familyInfo,
                        parents: parents,
                      },
                    };
                  });
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p htmlFor="siblings" className="text-left text-sm font-medium">
              Siblings
            </p>
            {catForm.familyInfo.siblings.length > 0 &&
              catForm.familyInfo.siblings.map((sibling, index) => {
                return (
                  <div className="flex flex-col gap-1">
                    <Select
                      isSearchable={true}
                      options={catsOptions}
                      value={{
                        label:
                          catsOptions.length > 0 &&
                          catsOptions.find((c) => {
                            return (
                              c.value == catForm?.familyInfo?.siblings[index]
                            );
                          })?.label,
                        value:
                          catsOptions.length > 0 &&
                          catsOptions.find((c) => {
                            return (
                              c.value == catForm?.familyInfo?.siblings[index]
                            );
                          })?.label,
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
                      className="text-base rounded-md appearance-none border-[1px] border-crey font-sans text-left leading-tight font-light w-40 text-clue"
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
                      onChange={(e) => {
                        setCatForm((prev) => {
                          let siblings = prev.familyInfo.siblings;
                          siblings[index] = e.value;
                          return {
                            ...prev,
                            familyInfo: {
                              ...prev.familyInfo,
                              siblings: siblings,
                            },
                          };
                        });
                      }}
                    />
                  </div>
                );
              })}
            <div className="flex flex-row gap-3 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                fill="none"
                className="cursor-pointer"
                onClick={() => {
                  setCatForm({
                    ...catForm,
                    familyInfo: {
                      ...catForm.familyInfo,
                      siblings: [...catForm.familyInfo.siblings, ""],
                    },
                  });
                }}
              >
                <rect
                  width="16"
                  height="16"
                  stroke="#d5b53c"
                  strokeWidth="1.5"
                  rx="8"
                  transform="scale(1 -1) rotate(45 33.238 2.747)"
                />
                <path
                  stroke="#d5b53c"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15.103 11.495h-3.536V7.96"
                />
                <path
                  stroke="#d5b53c"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M11.678 14.92v-3.535H8.142"
                />
              </svg>
              <p className="text-sm">Add Sibling</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p htmlFor="children" className="text-left text-sm font-medium">
              Children
            </p>
            {catForm.familyInfo.children.length > 0 &&
              catForm.familyInfo.children.map((child, index) => {
                return (
                  <div className="flex flex-col gap-1">
                    <Select
                      isSearchable={true}
                      options={catsOptions}
                      value={{
                        label:
                          catsOptions.length > 0 &&
                          catsOptions.find((c) => {
                            return (
                              c.value == catForm?.familyInfo?.children[index]
                            );
                          })?.label,
                        value:
                          catsOptions.length > 0 &&
                          catsOptions.find((c) => {
                            return (
                              c.value == catForm?.familyInfo?.children[index]
                            );
                          })?.label,
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
                      className="text-base rounded-md appearance-none border-[1px] border-crey font-sans text-left leading-tight font-light w-40 text-clue"
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
                      onChange={(e) => {
                        setCatForm((prev) => {
                          let children = prev.familyInfo.children;
                          children[index] = e.value;
                          return {
                            ...prev,
                            familyInfo: {
                              ...prev.familyInfo,
                              children: children,
                            },
                          };
                        });
                      }}
                    />
                  </div>
                );
              })}
            <div className="flex flex-row gap-3 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                fill="none"
                className="cursor-pointer"
                onClick={() => {
                  setCatForm({
                    ...catForm,
                    familyInfo: {
                      ...catForm.familyInfo,
                      children: [...catForm.familyInfo.children, ""],
                    },
                  });
                }}
              >
                <rect
                  width="16"
                  height="16"
                  stroke="#d5b53c"
                  strokeWidth="1.5"
                  rx="8"
                  transform="scale(1 -1) rotate(45 33.238 2.747)"
                />
                <path
                  stroke="#d5b53c"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15.103 11.495h-3.536V7.96"
                />
                <path
                  stroke="#d5b53c"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M11.678 14.92v-3.535H8.142"
                />
              </svg>
              <p className="text-sm">Add Child</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="notableActivity"
              className="text-left text-sm font-medium"
            >
              Notable Activity
            </label>
            <input
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="notableActivity"
              value={catForm.notableActivity}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  notableActivity: e.target.value,
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="remarks" className="text-left text-sm font-medium">
              Remarks
            </label>
            <input
              autoComplete="off"
              className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-64 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
              id="remarks"
              value={catForm.remarks}
              onChange={(e) => {
                setCatForm({
                  ...catForm,
                  remarks: e.target.value,
                });
              }}
            />
          </div>

          {error && <p className="text-red-500 text-xs text-left">{error}</p>}
          <button
            onClick={() => {
              if (editing) {
                updateCat();
              } else {
                addCat();
              }
            }}
            className="flex flex-row items-center justify-center px-4 py-2 bg-clue text-white rounded-md mt-4"
          >
            {editing ? "Edit Cat" : "Add Cat"}
          </button>
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
              <div className="flex flex-row w-full justify-between items-center">
                <img
                  width={50}
                  height={50}
                  src={(() => {
                    if (cat?.imageUrl && cat.imageUrl !== "none") {
                      const fileIdMatch = cat.imageUrl.match(/[-\w]{25,}/);
                      return fileIdMatch
                        ? `https://drive.google.com/uc?export=view&id=${fileIdMatch[0]}`
                        : "/logo.png";
                    }
                    return "/logo.png";
                  })()}
                />

                <div className="flex flex-col px-3 py-5 col-span-6">
                  <p>Cat ID: {cat.catId}</p>
                  <p>Name: {cat?.name}</p>
                  <p>Breed: {cat?.breed}</p>
                </div>
                <div className="flex flex-col px-3 py-5 col-span-4">
                  <p>Identifiers: {cat.identifiers}</p>
                  <p>
                    Last Sighting:{" "}
                    {
                      areas.find((a) => {
                        return a?.value == cat?.lastSighting?.location;
                      })?.label
                    }
                  </p>
                  <p>Alive: {JSON.stringify(cat.isAlive)}</p>
                </div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer"
                  onClick={() => {
                    setCatFormOpen(true);
                    setEditing(true);
                    setCatForm((prevState) => {
                      let updatedState = { ...prevState };

                      for (let key in cat) {
                        if (
                          cat.hasOwnProperty(key) &&
                          updatedState.hasOwnProperty(key)
                        ) {
                          if (
                            typeof cat[key] === "object" &&
                            cat[key] !== null &&
                            !Array.isArray(cat[key])
                          ) {
                            updatedState[key] = {
                              ...updatedState[key],
                              ...cat[key],
                            };
                          } else {
                            updatedState[key] = cat[key];
                          }
                        }
                      }

                      updatedState = {
                        _id: cat._id,
                        ...updatedState,
                      };
                      return updatedState;
                    });
                  }}
                >
                  <path
                    d="M0 13.7471V17.3641H3.61702L14.2848 6.69631L10.6678 3.07929L0 13.7471ZM17.082 3.89915C17.4582 3.52298 17.4582 2.91532 17.082 2.53915L14.825 0.282128C14.4488 -0.0940425 13.8411 -0.0940425 13.465 0.282128L11.6999 2.04723L15.3169 5.66425L17.082 3.89915Z"
                    fill="#969696"
                  />
                </svg>
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
