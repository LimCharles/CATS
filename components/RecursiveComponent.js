const RecursiveComponent = ({ rule }) => {
  if (typeof rule[1] == "object") {
    const entries = Object.entries(rule[1]);
    return (
      <div>
        <p>{rule[0]}</p>
        {entries.map(([key, value], index) => (
          <RecursiveComponent key={index} rule={[key, value]} />
        ))}
      </div>
    );
  } else {
    return (
      <p>
        {rule[0]}: {rule[1]}
      </p>
    );
  }
};

export default RecursiveComponent;
