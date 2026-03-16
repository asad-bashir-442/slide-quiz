const BASE_URL = "http://localhost:3000";
let options = {
  headers: {
    "Content-Type": "application/json",
  },
};
const token = localStorage.getItem("token");
export async function registerUser(userData) {
  const url = `${BASE_URL}/@me/register`;

  const res = await fetch(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(userData),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function loginUser(userData) {
  const url = `${BASE_URL}/@me/login`;
  const res = await fetch(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export async function createQuiz(userData) {
  const url = `${BASE_URL}/@me/quiz`;
  const res = await fetch(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export async function getQuizById(id) {
  const url = `${BASE_URL}/@me/quiz/${id}`;
  const res = await fetch(url, {
    ...options,
    method: "GET",
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}
