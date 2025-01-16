

// export const upload = async (file: File): Promise<string> => {
//   try {
//     const result = await cloudinary.uploader.upload(file, {
//       upload_preset: "connectorCld",
//     });
//     return result.secure_url;
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     throw error;
//   }
// };

export const upload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'connectorCld');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dlfflriaw/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  const data = await response.json();
  return data.secure_url;
};
