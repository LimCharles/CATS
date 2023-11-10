import Select from "react-select";
import { useState } from "react";
import axios from "axios";
import { set } from "zod";

const ValidationInput = ({ objKey, value, setCatForm, catForm, cats }) => {
  const [error, setError] = useState("");
  const [areas, setAreas] = useState([]);

  let catsOptions = cats.map((cat) => {
    return { value: cat._id, label: cat.name };
  });

  //#region Retrieve Areas
  const handleChange = (newValue, index = null) => {
    const values = [
      "double",
      "string",
      "object",
      "binary data",
      "objectId",
      "bool",
      "date",
      "null",
      "regex",
      "javascript",
      "int",
      "Timestamp",
      "long",
      "decimal",
      "minKey",
      "maxKey",
      "array",
    ];

    if (newValue == "" && typeof newValue != "boolean") {
      setCatForm((prevState) => {
        return {
          ...prevState,
          [objKey]: "",
        };
      });
      return;
    }

    if (value == "int" || value == "long" || value == "decimal") {
      const savedValue = newValue;
      newValue = parseInt(newValue);
      if (newValue.toString() != savedValue) {
        setError("Input must be of type " + value);
        return;
      }
    }

    if (
      typeof newValue == value ||
      (typeof newValue == "boolean" && value == "bool") ||
      (typeof newValue == "number" && value == "int" && !Number.isNaN(newValue))
    ) {
      setCatForm((prevState) => {
        return {
          ...prevState,
          [objKey]: newValue,
        };
      });
      setError("");
    } else if (value.includes("array")) {
      let existingArr = catForm?.[objKey] ?? [];

      if (
        (value.includes("int") ||
          value.includes("long") ||
          value.includes("decimal")) &&
        typeof newValue === "string"
      ) {
        existingArr[index] = newValue;
        setCatForm({
          ...catForm,
          [objKey]: existingArr,
        });
      } else if (value.includes("bool") && typeof newValue == "boolean") {
        existingArr[index] = newValue;
        setCatForm({
          ...catForm,
          [objKey]: existingArr,
        });
      } else if (value.includes("date")) {
        existingArr[index] = newValue;
        setCatForm({
          ...catForm,
          [objKey]: existingArr,
        });
      } else if (value.includes("objectId")) {
        let newOption = areas.find((area) => area.value === newValue);
        existingArr[index] = newOption;
        setCatForm({
          ...catForm,
          [objKey]: existingArr,
        });
      }
    } else if (value.includes("date")) {
      setCatForm((prevState) => {
        return {
          ...prevState,
          [objKey]: newValue,
        };
      });
      setError("");
    } else if (value == "objectId") {
      setCatForm((prevState) => {
        let newOption = areas.find((area) => area.value == newValue);
        return {
          ...prevState,
          [objKey]: newOption,
        };
      });
      setError("");
    } else {
      setCatForm((prevState) => {
        return {
          ...prevState,
          [objKey]: "",
        };
      });
      setError("Input must be of type " + value);
    }
  };
  //#endregion

  //#region Check Data Struc and Value Type
  let dataType;
  let valueType;

  if (value.includes("array")) {
    dataType = "array";
    valueType = value.split(" ")[1];
  } else {
    dataType = "single";
    valueType = value;
  }
  //#endregion

  //#region Retrieve Areas
  const [loading, setLoading] = useState(false);
  const retrieveAreas = async () => {
    let areas;
    setLoading(true);
    await axios
      .get("/api/areas/get")
      .then((res) => {
        areas = res.data;
        areas = areas.map((area) => {
          return { value: area._id, label: area.name };
        });
        setAreas(areas);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const handleFocus = async (objKey) => {
    if (objKey.includes("areas") || objKey.includes("location")) {
      if (areas.length == 0) {
        await retrieveAreas();
      }
    }
  };
  //#endregion

  switch (dataType) {
    case "array":
      switch (valueType) {
        case "bool":
          return (
            <div className="flex flex-col">
              <label
                htmlFor={objKey}
                className="text-left text-base text-clack font-light"
              >
                {objKey}
              </label>
              <div className="flex flex-row items-center gap-2 min-h-[34px]">
                <div className="flex flex-row flex-wrap gap-3 items-center">
                  {catForm?.[objKey]?.map((item, index) => {
                    return (
                      <Select
                        key={objKey + index}
                        instanceId={objKey}
                        id={objKey}
                        isSearchable={true}
                        options={[
                          { value: true, label: "true" },
                          { value: false, label: "false" },
                        ]}
                        value={
                          typeof catForm?.[objKey][index] == "boolean"
                            ? {
                                value: catForm?.[objKey][index] ?? null,
                                label: JSON.stringify(
                                  catForm?.[objKey][index] ?? null
                                ),
                              }
                            : null
                        }
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
                            minHeight: "31px",
                            height: "31px",
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
                          handleChange(JSON.parse(e.value), index);
                        }}
                      />
                    );
                  })}

                  <div>
                    <svg
                      onClick={() => {
                        if (catForm?.[objKey] == null) {
                          setCatForm((prevState) => {
                            return {
                              ...prevState,
                              [objKey]: [null],
                            };
                          });
                        } else {
                          setCatForm((prevState) => {
                            return {
                              ...prevState,
                              [objKey]: [...prevState[objKey], null],
                            };
                          });
                        }
                      }}
                      className="cursor-pointer"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlSpace="preserve"
                      viewBox="0 0 50 50"
                      height={22}
                      widht={22}
                    >
                      <circle
                        cx="25"
                        cy="25"
                        r="25"
                        style={{ fill: "#43b05c" }}
                      />
                      <path
                        d="M25 13v25M37.5 25h-25"
                        style={{
                          fill: "none",
                          stroke: "#fff",
                          strokeWidth: 2,
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeMiterlimit: 10,
                        }}
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs text-left">{error}</p>
              )}
            </div>
          );

        case "objectId":
          return (
            <div className="flex flex-col">
              <label
                htmlFor={objKey}
                className="text-left text-base text-clack font-light"
              >
                {objKey}
              </label>
              <div className="flex flex-row items-center gap-2 min-h-[34px]">
                <div className="flex flex-row flex-wrap gap-3 items-center">
                  {catForm?.[objKey]?.map((item, index) => {
                    return (
                      <Select
                        key={objKey + index}
                        instanceId={objKey}
                        id={objKey}
                        isSearchable={true}
                        isLoading={loading}
                        options={
                          objKey.includes("location") ||
                          objKey.includes("areas")
                            ? areas
                            : catsOptions
                        }
                        onFocus={() => {
                          handleFocus(objKey);
                        }}
                        value={catForm?.[objKey][index] ?? null}
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
                            minHeight: "31px",
                            height: "31px",
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
                          handleChange(e.value, index);
                        }}
                      />
                    );
                  })}

                  <div>
                    <svg
                      onClick={() => {
                        if (catForm?.[objKey] == null) {
                          setCatForm((prevState) => {
                            return {
                              ...prevState,
                              [objKey]: [null],
                            };
                          });
                        } else {
                          setCatForm((prevState) => {
                            return {
                              ...prevState,
                              [objKey]: [...prevState[objKey], null],
                            };
                          });
                        }
                      }}
                      className="cursor-pointer"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlSpace="preserve"
                      viewBox="0 0 50 50"
                      height={22}
                      widht={22}
                    >
                      <circle
                        cx="25"
                        cy="25"
                        r="25"
                        style={{ fill: "#43b05c" }}
                      />
                      <path
                        d="M25 13v25M37.5 25h-25"
                        style={{
                          fill: "none",
                          stroke: "#fff",
                          strokeWidth: 2,
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeMiterlimit: 10,
                        }}
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs text-left">{error}</p>
              )}
            </div>
          );

        default:
          return (
            <div className="flex flex-col">
              <label
                htmlFor={objKey}
                className="text-left text-base text-clack font-light"
              >
                {objKey}
              </label>
              <div className="flex flex-row items-center gap-2 min-h-[34px]">
                <div className="flex flex-row flex-wrap gap-3 items-center">
                  {catForm?.[objKey]?.map((item, index) => {
                    return (
                      <input
                        key={objKey + index}
                        className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-40 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
                        type={
                          value == "array date" ? "date" : value.split(" ")[1]
                        }
                        id={objKey}
                        name={objKey}
                        value={catForm?.[objKey]?.[index] ?? ""}
                        onChange={(e) => {
                          handleChange(e.target.value, index);
                        }}
                      />
                    );
                  })}

                  <div>
                    <svg
                      onClick={() => {
                        if (catForm?.[objKey] == null) {
                          setCatForm((prevState) => {
                            return {
                              ...prevState,
                              [objKey]: [null],
                            };
                          });
                        } else {
                          setCatForm((prevState) => {
                            return {
                              ...prevState,
                              [objKey]: [...prevState[objKey], null],
                            };
                          });
                        }
                      }}
                      className="cursor-pointer"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlSpace="preserve"
                      viewBox="0 0 50 50"
                      height={22}
                      widht={22}
                    >
                      <circle
                        cx="25"
                        cy="25"
                        r="25"
                        style={{ fill: "#43b05c" }}
                      />
                      <path
                        d="M25 13v25M37.5 25h-25"
                        style={{
                          fill: "none",
                          stroke: "#fff",
                          strokeWidth: 2,
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeMiterlimit: 10,
                        }}
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs text-left">{error}</p>
              )}
            </div>
          );
      }

    case "single":
      switch (valueType) {
        case "bool":
          return (
            <div className="flex flex-col">
              <label
                htmlFor={objKey}
                className="text-left text-base text-clack font-light"
              >
                {objKey}
              </label>
              <div className="flex flex-row items-center gap-2 min-h-[34px]">
                <Select
                  instanceId={objKey}
                  id={objKey}
                  isSearchable={true}
                  options={[
                    { value: true, label: "true" },
                    { value: false, label: "false" },
                  ]}
                  value={
                    typeof catForm?.[objKey] == "boolean"
                      ? {
                          value: catForm?.[objKey] ?? null,
                          label: JSON.stringify(catForm?.[objKey] ?? null),
                        }
                      : null
                  }
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
                      minHeight: "31px",
                      height: "31px",
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
                    handleChange(JSON.parse(e.value));
                  }}
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs text-left">{error}</p>
              )}
            </div>
          );

        case "objectId":
          return (
            <div className="flex flex-col">
              <label
                htmlFor={objKey}
                className="text-left text-base text-clack font-light"
              >
                {objKey}
              </label>
              <div className="flex flex-row items-center gap-2 min-h-[34px]">
                <Select
                  instanceId={objKey}
                  id={objKey}
                  isSearchable={true}
                  options={
                    objKey.includes("location") || objKey.includes("areas")
                      ? areas
                      : catsOptions
                  }
                  onFocus={() => {
                    handleFocus(objKey);
                  }}
                  isLoading={loading}
                  value={catForm?.[objKey] ?? null}
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
                      minHeight: "31px",
                      height: "31px",
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
                    handleChange(e.value);
                  }}
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs text-left">{error}</p>
              )}
            </div>
          );

        default:
          return (
            <div className="flex flex-col">
              <label
                htmlFor={objKey}
                className="text-left text-base text-clack font-light"
              >
                {objKey}
              </label>
              <div className="flex flex-row items-center gap-2 min-h-[34px]">
                <input
                  className="placeholder-darkcrey text-base rounded-md appearance-none border-[1px] border-darkcrey w-40 max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
                  type={value == "date" ? "date" : value}
                  id={objKey}
                  name={objKey}
                  value={catForm?.[objKey] ?? ""}
                  onChange={(e) => {
                    handleChange(e.target.value);
                  }}
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs text-left">{error}</p>
              )}
            </div>
          );
      }

    default:
      return null;
  }
};

export default ValidationInput;
