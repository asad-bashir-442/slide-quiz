const BASE_URL = "http://localhost:3000";
let options = {
  headers: {
    "Content-Type": "application/json",
  },
};
export async function registerUser(userData) {
  const url = `${BASE_URL}/@me/register`;
  try {
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
  } catch (error) {
    throw error;
  }
}

export async function loginUser(userData) {
  const url = `${BASE_URL}/@me/login`;

  try {
    const res = await fetch(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
