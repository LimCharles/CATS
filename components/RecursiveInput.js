import ValidationInput from "./ValidationInput";

const RecursiveInput = ({ rule, catForm, setCatForm, cats }) => {
  if (typeof rule[1] == "object") {
    const entries = Object.entries(rule[1]);
    return (
      <div className="w-full">
        <hr className="w-11/12" />
        <p className="text-left">{rule[0]}</p>
        {entries.map(([key, value], index) => (
          <RecursiveInput
            key={index}
            rule={[key, value]}
            catForm={catForm}
            setCatForm={setCatForm}
            cats={cats}
          />
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
        cats={cats}
      />
    );
  }
};

export default RecursiveInput;
