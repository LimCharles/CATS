import Select from "react-select";
import { array } from "zod";
const ValidationSelect = ({ objKey, value }) => {
  const options = [
    { label: "Double", value: "double" },
    { label: "String", value: "string" },
    { label: "Object", value: "object" },
    { label: "Binary data", value: "binary data" },
    { label: "ObjectId", value: "objectId" },
    { label: "Boolean", value: "bool" },
    { label: "Date", value: "date" },
    { label: "Null", value: "null" },
    { label: "Regular Expression", value: "regex" },
    { label: "JavaScript", value: "javascript" },
    { label: "32-bit integer", value: "int" },
    { label: "Timestamp", value: "Timestamp" },
    { label: "64-bit integer", value: "long" },
    { label: "Decimal128", value: "decimal" },
    { label: "Min key", value: "minKey" },
    { label: "Max key", value: "maxKey" },
    { label: "Array", value: "array" },
  ];

  const arrayOptions = [
    { label: "Doubles", value: "array double" },
    { label: "Strings", value: "array string" },
    { label: "Objects", value: "array object" },
    { label: "Binary data", value: "array binary data" },
    { label: "ObjectIds", value: "array objectId" },
    { label: "Booleans", value: "array bool" },
    { label: "Dates", value: "array date" },
    { label: "Nulls", value: "array null" },
    { label: "Regular Expressions", value: "array regex" },
    { label: "JavaScript", value: "array javascript" },
    { label: "32-bit integers", value: "array int" },
    { label: "Timestamps", value: "array Timestamp" },
    { label: "64-bit integers", value: "array long" },
    { label: "Decimal128", value: "array decimal" },
    { label: "Min keys", value: "array minKey" },
    { label: "Max keys", value: "array maxKey" },
  ];

  const currentOption = options.find(
    (option) => option.value == value || option.value == value.split(" ")[0]
  );

  const currentArrayOption = arrayOptions.find(
    (option) => option.value == value
  );

  return (
    <div className="grid grid-cols-3 gap-x-12 auto-rows-auto my-2">
      <div className="flex flex-row items-center bg-cellow rounded-md px-3 bg-opacity-30">
        <p className="text-clue bg-blue">{objKey}</p>
      </div>
      <Select
        isSearchable={true}
        options={options}
        value={currentOption}
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
        className="text-sm rounded-md appearance-none border-[1px] border-crey font-sans text-left leading-tight font-light w-40 text-clue"
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
      />
      {currentOption?.value == "array" && (
        <Select
          isSearchable={true}
          options={arrayOptions}
          value={currentArrayOption}
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
          className="text-sm rounded-md appearance-none border-[1px] border-crey font-sans text-left leading-tight font-light w-40 text-clue"
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
        />
      )}
    </div>
  );
};

export default ValidationSelect;
