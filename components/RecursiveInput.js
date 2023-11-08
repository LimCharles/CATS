import ValidationInput from "./ValidationInput";

const RecursiveInput = ({ rule, catForm, setCatForm }) => {
  if (typeof rule[1] == "object") {
    const entries = Object.entries(rule[1]);
    return (
      <div>
        <p className="text-left">{rule[0]}</p>
        {entries.map(([key, value], index) => (
          <RecursiveInput key={index} rule={[key, value]} />
        ))}
      </div>
    );
  } else {
    return (
      <ValidationInput
        objKey={rule[0]}
        value={rule[1]}
        catForm={catForm}
        setCatForm={setCatForm}
      />
    );
  }
};

export default RecursiveInput;
