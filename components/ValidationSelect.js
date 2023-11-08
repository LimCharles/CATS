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
      <Select options={options} value={currentOption} className="w-40" />
      {currentOption?.value == "array" && (
        <Select
          options={arrayOptions}
          value={currentArrayOption}
          className="w-40"
        />
      )}
    </div>
  );
};

export default ValidationSelect;
