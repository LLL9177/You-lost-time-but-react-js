export async function fetchData(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return { error: "Network error" }; // 🔑 IMPORTANT
  }
}
