export const sendMessage = async (message: string, file: File | null, model: string = "deepseek-r1:1.5b") => {
    let response;

    if (file) {
        // Handle file upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("message", message);
        formData.append("model", model); // Ensure model is set

        response = await fetch("http://localhost:11434/api/upload", {  // Check if this endpoint exists
            method: "POST",
            body: formData,
        });
    } else {
        // Handle text input with streaming
        response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: model,
                prompt: message,
                stream: true,
            }),
        });
    }

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.body;
};
