import { redirect } from "next/navigation";

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    redirect("/");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  const refreshHeaders = {
    ...options.headers,
    refreshToken: `${token}`,
  };

  let res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status == 401) {
      try {
        await fetch("http://localhost:4000/auth/refresh", {
          method: "POST",
          credentials: "include",
        })
          .then((resp) => resp.json())
          .then((response) => {
            console.log("Auth token Refresh Response: ", response);
            localStorage.setItem("token", response.data.accessToken);
            headers.Authorization = `Bearer ${response.data.accessToken}`;
          });
        // running the same request again after new token
        res = await fetch(url, {
          ...options,
          headers,
        });
      } catch (e: any) {
        console.log("refresh token refreshing failed");
        localStorage.clear();
        redirect("/");
      }

      throw new Error(`HTTP error! status: ${res.status}`);
    }
  }

  return res;
}
