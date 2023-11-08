import Select from "react-select";
import { useState } from "react";

const ValidationInput = ({ objKey, value, setCatForm, catForm }) => {
  const [error, setError] = useState(false);
  const handleChange = (newValue) => {
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

    console.log(catForm);
    console.log(catForm[objKey]);
    if (typeof newValue == value) {
      setCatForm((prevState) => {
        return {
          ...prevState,
          [objKey]: newValue,
        };
      });
    } else {
      setCatForm((prevState) => {
        return {
          ...prevState,
          [objKey]: "",
        };
      });
      setError(true);
    }
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor={objKey}
        className="text-left text-sm text-clack font-light"
      >
        {objKey}
      </label>
      <input
        className="placeholder-darkcrey text-sm rounded-md appearance-none border-[1px] border-darkcrey w-full max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
        type="text"
        id={objKey}
        name={objKey}
        value={catForm[objKey] ? "" : catForm?.objKey}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
      />
    </div>
  );
};

export default ValidationInput;
