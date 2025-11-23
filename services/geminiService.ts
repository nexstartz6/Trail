import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an expert Frontend Web Developer and UI/UX Designer. 
Your task is to generate a single, complete, self-contained HTML file based on the user's request.
The file must include all necessary CSS (inside <style> tags) and JavaScript (inside <script> tags).
Use modern HTML5, Tailwind CSS (via CDN link), and vanilla JavaScript.
Do not wrap the output in markdown code blocks (like \`\`\`html). Return ONLY the raw HTML code.
The design should be professional, clean, and responsive.
If the user asks to modify an existing website, output the full modified HTML file.
`;

const TAILWIND_CDN = '<script src="https://cdn.tailwindcss.com"></script>';

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const generateWebsiteStream = async (
  prompt: string, 
  currentCode?: string
): Promise<AsyncIterable<GenerateContentResponse>> => {
  const client = getClient();
  
  let fullPrompt = prompt;
  if (currentCode) {
    fullPrompt = `
    Existing Code:
    ${currentCode}

    User Request:
    ${prompt}
    
    Return the fully updated HTML file based on the request.
    `;
  } else {
    fullPrompt = `${prompt}. Ensure you include ${TAILWIND_CDN} in the head.`;
  }

  const responseStream = await client.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: fullPrompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  return responseStream;
};