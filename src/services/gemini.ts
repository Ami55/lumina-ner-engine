import { NERResult } from "../types";

const PROXY_URL = "https://gemini-proxy-2-pearl.vercel.app/api/lumina-ner";

export async function analyzeText(text: string): Promise<NERResult> {
  const response = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result?.error || `Proxy returned status ${response.status}`);
  return result as NERResult;
}
