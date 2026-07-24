import { NextResponse } from "next/server";
import { getCachedUser } from "@/lib/auth-server";
import { haalCreditSaldo } from "@/lib/credits";
import { haalRecenteAiGesprekken } from "@/lib/ai/queries";
import { zorgProfielBestaat } from "@/lib/profiel";

export async function GET() {
  const user = await getCachedUser();
  if (!user) {
    return NextResponse.json({
      ingelogd: false,
      creditsSaldo: 0,
      recentChats: [],
    });
  }

  await zorgProfielBestaat(user.id, user.email ?? "");
  const [creditsSaldo, recentChats] = await Promise.all([
    haalCreditSaldo(user.id),
    haalRecenteAiGesprekken(user.id),
  ]);

  return NextResponse.json({
    ingelogd: true,
    creditsSaldo,
    recentChats,
  });
}
