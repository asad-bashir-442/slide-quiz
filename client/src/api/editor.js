import { BASE_URL } from "./auth";

export async function getAllQuestionsById(id) {
  const url = `${BASE_URL}/@me/quiz/${id}/editor`;
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return Error(data.message || "Something went wrong");
  }
  return data;
}

export async function createQuizQuestion(id, questionData) {
  const url = `${BASE_URL}/@me/quiz/${id}/editor`;
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(questionData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return Error(data.message || "Something went wrong");
  }
  return data;
}
