import axios from "axios";

export const uploadImage = async (image) => {
  const form = new FormData();

  form.append("file", {
    uri: image.uri,
    name: image.fileName,
    type: image.type || "image/jpeg",
  });

  const res = await axios.post(
    "http://10.0.2.2:5029/api/upload/image",
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.imageUrl; // URL backend trả về
};
