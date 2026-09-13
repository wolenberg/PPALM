const API_URL =
"http://localhost:3001/api";

export async function analyzeSolution() {

  const response =
    await fetch(
      `${API_URL}/solutions/analyze`
    );

  return await response.json();

}

export async function validateSolution() {

  const response =
    await fetch(
      `${API_URL}/solutions/validate`
    );

  return await response.json();

}
