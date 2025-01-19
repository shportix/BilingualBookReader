const BASE_URL = `http://localhost:8000`;

export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  const res = await fetch(`${BASE_URL}/user/change-password/`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oldPassword,
      newPassword,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.errors[0]);
  }
  return data;
};

export const editProfile = async (profile: any) => {
  if (profile.avatar) {
    await uploadAvatar(profile.avatar);
    delete profile.avatar;
  }
  const res = await fetch(`${BASE_URL}/user/`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.errors[0]);
  }
  return data;
};

export const uploadAvatar = async (avatar: string) => {
  const response = await fetch(avatar);
  const blob = await response.blob();
  const fileAvatar = new File([blob], "avatar", { type: "image/jpeg" });

  const formData = new FormData();
  formData.append("avatar", fileAvatar, "avatar.jpeg");

  const res = await fetch(`${BASE_URL}/user/change-avatar/`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.errors[0]);
  }
  return data;
};

export const deleteUser = async () => {
  const res = await fetch(`${BASE_URL}/user/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.errors[0]);
  }
  return data;
};

export const getBookById = async (id: number) => {
  const res = await fetch(`${BASE_URL}/book/one/info/?book_id=${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

export const getBooks = async () => {
  const res = await fetch(`${BASE_URL}/book/all_books/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  const allBooksJSON = await res.json();
  const booksIds = allBooksJSON.book_ids;

  const books = await Promise.all(
    booksIds.map(async (id: number) => {
      const res = await fetch(`${BASE_URL}/book/one/info/?book_id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      return { id, ...data };
    })
  );

  return books;
};

const getFileFromBlobLink = async (
  blobLink: string,
  options: any = { name: "", type: "application/epub+zip" }
) => {
  const response = await fetch(blobLink);
  const blob = await response.blob();
  const file = new File([blob], options.name, { type: options.type as string });
  return file;
};

export const addBook = async (book: any) => {
  const formData = new FormData();

  const preview = await getFileFromBlobLink(book.preview, {
    name: "preview.jpeg",
    type: "image/jpeg",
  });

  formData.append("preview", preview);
  formData.append("english", book.origin);
  formData.append("translation_0", book.translation_0);
  formData.append(
    "book",
    JSON.stringify({
      title: book.name,
      author: [book.author],
      translator: "uk",
      translation_0_language: "uk",
      translations_count: 1,
      origin_language: "en",
      genre: [book.genre],
      translator_0: ["translator"],
      ageRestriction: book.age,
      totalPages: 86,
    })
  );

  console.log("Preview:", formData.get("preview"));
  console.log("English:", formData.get("english"));
  console.log("Translation_0:", formData.get("translation_0"));
  console.log("Book:", formData.get("book"));

  const res = await fetch(`${BASE_URL}/book/create/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: formData,
  });
  console.log(res.body);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.errors[0]);
  }
  return data;
};

export const getTranslation = async (english: string) => {
  const res = await fetch(`${BASE_URL}/translate/?english=${english}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data.ukrainian;
};

export const getParagraphs = async (bookId: number) => {
  const res = await fetch(`${BASE_URL}/book/paragraphs/?text_id=${bookId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

export const getWords = async () => {
  const token = localStorage.getItem("token") as string;
  const words = JSON.parse(localStorage.getItem(token) || "[]");
  return words;
};

export const addWord = async (word: string, translation: string) => {
  const token = localStorage.getItem("token") as string;
  const words = JSON.parse(localStorage.getItem(token) || "[]");
  words.push({ word, translation });
  localStorage.setItem(token, JSON.stringify(words));
  return words;
};

export const removeWord = async (word: string) => {
  const token = localStorage.getItem("token") as string;
  const words = JSON.parse(localStorage.getItem(token) || "[]");
  const newWords = words.filter((w: any) => w.word !== word);
  localStorage.setItem(token, newWords);
  return newWords;
};
