import ValidationSelect from "./ValidationSelect";

const RecursiveComponent = ({ rule, required }) => {
  if (typeof rule[1] == "object") {
    const entries = Object.entries(rule[1]);
    return (
      <div>
        <p>{rule[0]}</p>
        {entries.map(([key, value], index) => (
          <RecursiveComponent
            key={index}
            rule={[key, value]}
            required={required}
          />
        ))}
      </div>
    );
  } else {
    return (
      <ValidationSelect objKey={rule[0]} value={rule[1]} required={required} />
    );
  }
};

export default RecursiveComponent;
