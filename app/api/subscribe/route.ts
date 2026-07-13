import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const subscribersPath = path.join(process.cwd(), "data/subscribers.json");

function ensureDataDir() {
  const dir = path.dirname(subscribersPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(subscribersPath)) {
    fs.writeFileSync(subscribersPath, JSON.stringify([]));
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "无效的邮箱地址" }, { status: 400 });
    }

    ensureDataDir();
    const subscribers: { email: string; subscribedAt: string }[] = JSON.parse(
      fs.readFileSync(subscribersPath, "utf8")
    );

    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json({ message: "已订阅" }, { status: 200 });
    }

    subscribers.push({ email, subscribedAt: new Date().toISOString() });
    fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));

    return NextResponse.json({ message: "订阅成功" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
