const API_URL = import.meta.env.VITE_API_URL

export async function calculateEarthing(payload) {
  const response = await fetch(`${API_URL}/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text(); // 👈 IMPORTANT
    console.error("Backend error:", errorText);
    throw new Error(errorText);
  }

  return response.json();
}
