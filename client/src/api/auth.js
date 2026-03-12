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
  // try {
  //   const res = await fetch(url, {
  //     ...options,
  //     method: "POST",
  //     body: JSON.stringify(userData),
  //   });
  //   const data = await res.json();

  //   if (!res.ok) {
  //     throw new Error(data.message || "Something went wrong");
  //   }

  //   return data;
  // } catch (error) {
  //   throw error;
  // }
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

  // try {
  //   const res = await fetch(url, {
  //     ...options,
  //     method: "POST",
  //     body: JSON.stringify(userData),
  //   });

  //   const data = await res.json();

  //   if (!res.ok) {
  //     throw new Error(data.message || "Something went wrong");
  //   }
  //   return data;
  // } catch (error) {
  //   throw error;
  // }
}
