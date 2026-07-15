export const sendChatMessage = async (payload) => {

  console.log("BASE_URL:", BASE_URL);
  console.log("Sending Payload:", payload);

  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  console.log("Status:", response.status);

  const data = await response.json();

  console.log("Response:", data);

  return data;
};