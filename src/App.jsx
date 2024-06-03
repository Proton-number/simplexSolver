import { useState } from "react";
import Simplex from "./Simplex";

function App() {
  const [objective, setObjective] = useState({ x1: 0, x2: 0, x3: 0 });
  const [constraints, setConstraints] = useState([
    { x1: 0, x2: 0, x3: 0, b: 0 },
    { x1: 0, x2: 0, x3: 0, b: 0 },
    { x1: 0, x2: 0, x3: 0, b: 0 },
  ]);
  const [solution, setSolution] = useState(null);

  const handleObjectiveChange = (e, variable) => {
    setObjective({ ...objective, [variable]: parseFloat(e.target.value) });
  };

  const handleConstraintChange = (index, e, variable) => {
    const newConstraints = [...constraints];
    newConstraints[index][variable] = parseFloat(e.target.value);
    setConstraints(newConstraints);
  };

  const handleSolve = () => {
    const solution = Simplex(objective, constraints);
    setSolution(solution);
  };

  return (
    <>
      <div>
        <h1>Simplex Solver</h1>
        <div>
          <h2>Objective Function</h2>
          <input
            type="number"
            value={objective.x1}
            onChange={(e) => handleObjectiveChange(e, "x1")}
            placeholder="Coefficient of x1"
          />
          <input
            type="number"
            value={objective.x2}
            onChange={(e) => handleObjectiveChange(e, "x2")}
            placeholder="Coefficient of x2"
          />
          <input
            type="number"
            value={objective.x3}
            onChange={(e) => handleObjectiveChange(e, "x3")}
            placeholder="Coefficient of x3"
          />
        </div>
        <div>
          <h2>Constraints</h2>
          {constraints.map((constraint, index) => (
            <div key={index}>
              <input
                type="number"
                value={constraint.x1}
                onChange={(e) => handleConstraintChange(index, e, "x1")}
                placeholder={`x1 constraint ${index + 1}`}
              />
              <input
                type="number"
                value={constraint.x2}
                onChange={(e) => handleConstraintChange(index, e, "x2")}
                placeholder={`x2 constraint ${index + 1}`}
              />
              <input
                type="number"
                value={constraint.x3}
                onChange={(e) => handleConstraintChange(index, e, "x3")}
                placeholder={`x3 constraint ${index + 1}`}
              />
              ≤
              <input
                type="number"
                value={constraint.b}
                onChange={(e) => handleConstraintChange(index, e, "b")}
                placeholder={`b${index + 1}`}
              />
            </div>
          ))}
        </div>
        <br />
        <button onClick={handleSolve}>Solve</button>
        {solution && (
          <div>
            <h2>Solution</h2>
            <pre>{JSON.stringify(solution, null, 2)}</pre>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
