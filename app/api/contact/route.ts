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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = clean(body.name, 120);
    const email = clean(body.email, 200);
    const subject = clean(body.subject, 180);
    const message = clean(body.message, 5000);
    const topic = clean(body.topic, 40);
    const website = clean(body.website, 200); // honeypot

    if (website) return NextResponse.json({ ok: true });

    if (!name || !email || !subject || !message || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }

    const topicLabel = topicLabels[topic] || "Website contact";
    const receivedAt = new Intl.DateTimeFormat("de-CH", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Europe/Zurich",
    }).format(new Date());

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Origin Income Website <hello@originincome.com>",
        to: ["hello@originincome.com"],
        reply_to: email,
        subject: `[${topicLabel}] ${subject}`,
        text: [
          "Neue Kontaktanfrage über originincome.com",
          "",
          `Bereich: ${topicLabel}`,
          `Name: ${name}`,
          `E-Mail: ${email}`,
          `Betreff: ${subject}`,
          `Eingegangen: ${receivedAt}`,
          "",
          message,
        ].join("\n"),
        html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:32px;color:#111;background:#fff">
            <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8b6b22;margin:0 0 12px">Origin Income</p>
            <h1 style="font-size:26px;line-height:1.2;margin:0 0 28px">Neue Kontaktanfrage</h1>
            <table style="width:100%;border-collapse:collapse;font-size:15px">
              <tr><td style="padding:10px 0;color:#666;width:150px">Bereich</td><td style="padding:10px 0;font-weight:600">${escapeHtml(topicLabel)}</td></tr>
              <tr><td style="padding:10px 0;color:#666">Name</td><td style="padding:10px 0">${escapeHtml(name)}</td></tr>
              <tr><td style="padding:10px 0;color:#666">E-Mail</td><td style="padding:10px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
              <tr><td style="padding:10px 0;color:#666">Betreff</td><td style="padding:10px 0">${escapeHtml(subject)}</td></tr>
              <tr><td style="padding:10px 0;color:#666">Eingegangen</td><td style="padding:10px 0">${escapeHtml(receivedAt)}</td></tr>
            </table>
            <div style="margin-top:26px;padding:22px;border:1px solid #e6e6e6;border-radius:12px;white-space:pre-wrap;line-height:1.65">${escapeHtml(message)}</div>
            <p style="margin-top:24px;color:#666;font-size:13px">Du kannst direkt auf diese E-Mail antworten. Die Antwort geht automatisch an ${escapeHtml(email)}.</p>
          </div>`,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Resend delivery failed:", response.status, details);
      return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
