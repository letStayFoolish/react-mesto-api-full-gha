export const BASE_URL = 'https://api.chili.nomoreparties.co';
// export const BASE_URL = 'http://localhost:8000';

// Check response from promises:
function checkResponse(response) {
  if (!response.ok) {
    return Promise.reject(`ERROR: ${response.status}`);
  }
  return Promise.resolve(response.json());
}

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({email, password}),
  }).then(checkResponse);
};
export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({email, password}),
  }).then(checkResponse);
};

export const logout = () => {
  return fetch(`${BASE_URL}/signout`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(checkResponse);
};

export const getContent = () => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(checkResponse);
};
