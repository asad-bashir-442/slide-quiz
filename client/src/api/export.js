import { BASE_URL } from "../utility/env";

export async function exportQuiz(id) {
    const url = `${BASE_URL}/@me/quiz/${id}/export`;
    const token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Something went wrong");
    }

    return await res.text();
}

export async function exportResults(id) {
    const url = `${BASE_URL}/@me/response/${id}/export`;
    const token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Something went wrong");
    }

    return await res.text();
}
