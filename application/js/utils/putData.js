export const putData = async (url, usersData) => {
  // console.log("Sending data...", url, usersData)
  const updateUrl = `${url}/${usersData.id}`;
  try {
    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        my_key: "my_super_secret_phrase",
      },
      body: JSON.stringify(usersData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
