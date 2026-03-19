import { BASE_URL } from "./auth";

export async function createQuiz(userData) {
  const url = `${BASE_URL}/@me/quiz`;
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
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
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
export async function editQuizById(id, quizData) {
  const url = `${BASE_URL}/@me/quiz/${id}`;
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(quizData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
export async function deleteQuizById(id) {
  const url = `${BASE_URL}/@me/quiz/${id}`;
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
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
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
