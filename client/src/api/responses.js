import { BASE_URL } from "../utility/env";

export async function getAllResponses() {
  const url = `${BASE_URL}/@me/response`;
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

export async function getReponseById(id) {
  const url = `${BASE_URL}/@me/response/${id}`;
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

export async function deleteAllResponse() {
  const url = `${BASE_URL}/@me/response`;
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

export async function deleteResponseById(id) {
  const url = `${BASE_URL}/@me/response/${id}`;
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
