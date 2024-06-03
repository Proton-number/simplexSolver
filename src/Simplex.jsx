function Simplex(objective, constraints) {
  const tableau = initializeTableau(objective, constraints);

  while (!isOptimal(tableau)) {
    const pivotColumn = choosePivotColumn(tableau);
    const pivotRow = choosePivotRow(tableau, pivotColumn);
    if (pivotRow === -1) {
      return { status: "Unbounded", tableau };
    }
    pivot(tableau, pivotRow, pivotColumn);
  }

  return extractSolution(tableau);
}

function initializeTableau(objective, constraints) {
  const numVariables = 3; // x1, x2, x3
  const numConstraints = constraints.length;

  // Initialize the tableau with the objective function and constraints
  const tableau = [];

  // Add constraints with slack variables
  for (let i = 0; i < numConstraints; i++) {
    const row = [
      constraints[i].x1,
      constraints[i].x2,
      constraints[i].x3,
      ...Array(numConstraints).fill(0),
      constraints[i].b,
    ];
    row[numVariables + i] = 1; // Add slack variable
    tableau.push(row); //Adds the constructed row to the tableau.
  }

  // Add the objective function row
  const objectiveRow = [
    -objective.x1,
    -objective.x2,
    -objective.x3,
    ...Array(numConstraints).fill(0),
    0,
  ];
  tableau.push(objectiveRow);

  return tableau;
}

function isOptimal(tableau) {
  // Check if the tableau represents an optimal solution
  const lastRow = tableau[tableau.length - 1];
  return lastRow.slice(0, -1).every((value) => value >= 0);
}

function choosePivotColumn(tableau) {
  // Choose the pivot column (most negative value in the objective row)
  const lastRow = tableau[tableau.length - 1];
  return lastRow.slice(0, -1).indexOf(Math.min(...lastRow.slice(0, -1)));
}

function choosePivotRow(tableau, pivotColumn) {
  // Choose the pivot row (minimum ratio of RHS to pivot column value)
  let minRatio = Infinity;
  let pivotRow = -1;
  for (let i = 0; i < tableau.length - 1; i++) {
    const row = tableau[i];
    const ratio = row[row.length - 1] / row[pivotColumn];
    if (ratio > 0 && ratio < minRatio) {
      minRatio = ratio;
      pivotRow = i;
    }
  }
  return pivotRow;
}

function pivot(tableau, pivotRow, pivotColumn) {
  // Perform pivot operations to update the tableau
  const pivotValue = tableau[pivotRow][pivotColumn];
  for (let j = 0; j < tableau[pivotRow].length; j++) {
    tableau[pivotRow][j] /= pivotValue;
  }
  for (let i = 0; i < tableau.length; i++) {
    if (i !== pivotRow) {
      const multiplier = tableau[i][pivotColumn];
      for (let j = 0; j < tableau[i].length; j++) {
        tableau[i][j] -= multiplier * tableau[pivotRow][j];
      }
    }
  }
}

function extractSolution(tableau) {
  const numVariables = 3;
  const solution = {
    status: "Optimal",
    variables: {},
    objectiveValue: -tableau[tableau.length - 1][tableau[0].length - 1],
  };

  // Determine values of decision variables
  for (let i = 0; i < numVariables; i++) {
    const col = tableau.map((row) => row[i]);
    if (
      col.filter((x) => x === 1).length === 1 &&
      col.filter((x) => x === 0).length === tableau.length - 1
    ) {
      solution.variables[`x${i + 1}`] =
        tableau[col.indexOf(1)][tableau[0].length - 1];
    } else {
      solution.variables[`x${i + 1}`] = 0;
    }
  }

  // Negate the objective value to correct it for maximization problems
  solution.objectiveValue = -solution.objectiveValue;

  return solution;
}

export default Simplex;
