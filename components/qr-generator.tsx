"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

type QRType = "url" | "text" | "wifi" | "email";

const tabs: { id: QRType; label: string }[] = [
  { id: "url", label: "URL" },
  { id: "text", label: "Text" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "email", label: "Email" },
];

export default function QRGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [type, setType] = useState<QRType>("url");
  const [value, setValue] = useState("https://example.com");
  const [ssid, setSsid] = useState("My Wi-Fi");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");
  const [email, setEmail] = useState("hello@example.com");
  const [subject, setSubject] = useState("Hello!");
  const [message, setMessage] = useState("Sent from QRkan.");
  const [dark, setDark] = useState("#000000");
  const [light, setLight] = useState("#ffffff");
  const [size, setSize] = useState(900);
  const [margin, setMargin] = useState(3);
  const [ready, setReady] = useState(false);

  const payload = type === "wifi"
    ? `WIFI:T:${encryption};S:${ssid};P:${password};;`
    : type === "email"
      ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
      : value;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !payload.trim()) {
      setReady(false);
      return;
    }
    QRCode.toCanvas(canvas, payload, {
      width: size,
      margin,
      color: { dark, light },
      errorCorrectionLevel: "H",
    }).then(() => setReady(true)).catch(() => setReady(false));
  }, [payload, dark, light, size, margin]);

  function download(ext: "png" | "svg") {
    if (!payload.trim()) return;

    if (ext === "png") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const a = document.createElement("a");
      a.download = "qr-code.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
      return;
    }

    QRCode.toString(payload, {
      type: "svg",
      margin,
      color: { dark, light },
      errorCorrectionLevel: "H",
      width: size,
    }).then((svg) => {
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const a = document.createElement("a");
      a.download = "qr-code.svg";
      a.href = URL.createObjectURL(blob);
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  return (
    <main className="shell">
      <nav className="nav">
        <a
          className="brand github-link"
          href="https://github.com/BeLfayza"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub BeLfayza"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="github-icon"
          >
            <path
              fill="currentColor"
              d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.69-3.88-1.54-3.88-1.54-.53-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
            />
          </svg>
        </a>
        <div className="badge">100% client-side · no upload</div>
      </nav>

      <section className="hero">
        <h1>QR-kan <span>dlu le</span></h1>
        <p>Generate clean, customizable QR codes for links, text, Wi-Fi and email.</p>
      </section>

      <section className="grid">
        <div className="card">
          <h2>Content</h2>
          <div className="tabs">
            {tabs.map((tab) => (
              <button key={tab.id} className={`tab ${type === tab.id ? "active" : ""}`} onClick={() => setType(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>

          {type === "url" && (
            <div className="field">
              <div className="label"><span>Website URL</span></div>
              <input className="input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://example.com" />
            </div>
          )}

          {type === "text" && (
            <div className="field">
              <div className="label"><span>Text</span></div>
              <textarea className="input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type anything..." />
            </div>
          )}

          {type === "wifi" && (
            <>
              <div className="field"><div className="label"><span>Network name (SSID)</span></div><input className="input" value={ssid} onChange={(e) => setSsid(e.target.value)} /></div>
              <div className="field"><div className="label"><span>Password</span></div><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              <div className="field"><div className="label"><span>Encryption</span></div><select className="select" value={encryption} onChange={(e) => setEncryption(e.target.value)}><option>WPA</option><option>WEP</option><option>nopass</option></select></div>
            </>
          )}

          {type === "email" && (
            <>
              <div className="field"><div className="label"><span>Email address</span></div><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="field"><div className="label"><span>Subject</span></div><input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
              <div className="field"><div className="label"><span>Message</span></div><textarea className="input" value={message} onChange={(e) => setMessage(e.target.value)} /></div>
            </>
          )}

          <h2 style={{ marginTop: 28 }}>Appearance</h2>
          <div className="two">
            <div className="field">
              <div className="label"><span>QR color</span><span>{dark}</span></div>
              <div className="color"><input type="color" value={dark} onChange={(e) => setDark(e.target.value)} /><input className="input" value={dark} onChange={(e) => setDark(e.target.value)} /></div>
            </div>
            <div className="field">
              <div className="label"><span>Background</span><span>{light}</span></div>
              <div className="color"><input type="color" value={light} onChange={(e) => setLight(e.target.value)} /><input className="input" value={light} onChange={(e) => setLight(e.target.value)} /></div>
            </div>
          </div>

          <div className="field">
            <div className="label"><span>Size</span><span>{size}px</span></div>
            <input className="range" type="range" min="300" max="1600" step="100" value={size} onChange={(e) => setSize(Number(e.target.value))} />
          </div>

          <div className="field">
            <div className="label"><span>Margin</span><span>{margin}</span></div>
            <input className="range" type="range" min="0" max="10" value={margin} onChange={(e) => setMargin(Number(e.target.value))} />
          </div>
        </div>

        <div className="card preview">
          <h2 style={{ width: "100%" }}>Preview</h2>
          <div className="qrbox">
            {payload.trim() ? (
              <div className="qrcanvas">
                <canvas ref={canvasRef} />
              </div>
            ) : (
              <div className="empty">Enter some content to generate your QR code.</div>
            )}
          </div>
          <div className="downloads">
            <button className="btn primary" disabled={!ready} onClick={() => download("png")}>Download PNG</button>
            <button className="btn" disabled={!ready} onClick={() => download("svg")}>Download SVG</button>
          </div>
        </div>
      </section>

      <div className="footer">Gabut njir.</div>
    </main>
  );
}
