import { NextResponse } from "next/server";

const topicLabels: Record<string, string> = {
  general: "General inquiry",
  support: "Technical support",
  billing: "Billing & payments",
  privacy: "Privacy & data",
};

function clean(value: unknown, max = 3000) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = clean(body.name, 120);
    const email = clean(body.email, 200);
    const subject = clean(body.subject, 180);
    const message = clean(body.message, 5000);
    const topic = clean(body.topic, 40);

    if (!name || !email || !subject || !message || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Origin Income Website <contact@originincome.com>",
        to: ["hello@originincome.com"],
        reply_to: email,
        subject: `[${topicLabels[topic] || "Website contact"}] ${subject}`,
        text: [
          "Neue Anfrage über originincome.com",
          "",
          `Bereich: ${topicLabels[topic] || topic}`,
          `Name: ${name}`,
          `E-Mail: ${email}`,
          `Betreff: ${subject}`,
          "",
          message,
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
