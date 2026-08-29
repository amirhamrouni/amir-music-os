import { env } from "cloudflare:workers";

type Brief = { direction?: string; language?: string; vocal?: string; hook?: string };

export async function POST(request: Request) {
  const key = env.GEMINI_API_KEY;
  if (!key) return Response.json({ error: "AI key is not configured" }, { status: 503 });
  const brief = await request.json() as Brief;
  if (!brief.direction?.trim()) return Response.json({ error: "Creative direction is required" }, { status: 400 });
  const instruction = `You are the private creative director for independent artist Amir Hamrouni. Create an original commercial song package. Never imitate a named artist or existing song. Language: ${brief.language || "Tunisian"}. Vocal: ${brief.vocal || "Emotional male"}. Direction: ${brief.direction}. Hook idea: ${brief.hook || "Create one"}. Return polished lyrics with labeled sections, a concise Suno style prompt, excluded styles, three short-form hooks, and a one-sentence rationale.`;
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent", {
    method: "POST", headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({ contents: [{ parts: [{ text: instruction }] }], generationConfig: { temperature: 0.85, responseMimeType: "application/json", responseJsonSchema: { type: "object", properties: { title: { type: "string" }, lyrics: { type: "string" }, stylePrompt: { type: "string" }, excludedStyles: { type: "string" }, hooks: { type: "array", items: { type: "string" } }, rationale: { type: "string" } }, required: ["title", "lyrics", "stylePrompt", "excludedStyles", "hooks", "rationale"] } } })
  });
  if (!response.ok) return Response.json({ error: `Gemini request failed (${response.status})` }, { status: 502 });
  const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return Response.json({ error: "Gemini returned no usable result" }, { status: 502 });
  try { return Response.json({ package: JSON.parse(text) }); }
  catch { return Response.json({ error: "Gemini returned invalid output" }, { status: 502 }); }
}
