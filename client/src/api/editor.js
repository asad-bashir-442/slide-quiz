import { BASE_URL } from "../utility/env";

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

export async function createQuestionById(id, questionData) {
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

export async function deleteQuestionById(quizId, questionId) {
  const url = `${BASE_URL}/@me/quiz/${quizId}/editor?question=${questionId}`;
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    method: "DELETE",
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

export async function createAnswerById(quizId, questionId, answerData) {
  const url = `${BASE_URL}/@me/quiz/${quizId}/editor/${questionId}`;
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(answerData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw Error(data.message || "Something went wrong");
  }
  return data;
}

export async function deleteAnswerById(quizId, questionId, answerId) {
  const url = `${BASE_URL}/@me/quiz/${quizId}/editor/${questionId}?answer=${answerId}`;
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    method: "DELETE",
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
