const BASE_URL = "http://localhost:3000";
let options = {
  headers: {
    "Content-Type": "application/json",
  },
};
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

export async function updateUser(userData) {
  const url = `${BASE_URL}/@me`;
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    ...options,
    method: "PATCH",
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

export async function createQuiz(userData) {
  const url = `${BASE_URL}/@me/quiz`;
  const token = localStorage.getItem("token");
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
  const token = localStorage.getItem("token");
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

export async function getAllQuizzes(page = 1) {
  const url = `${BASE_URL}/@me/quiz?page=${page}`;
  const token = localStorage.getItem("token");
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
