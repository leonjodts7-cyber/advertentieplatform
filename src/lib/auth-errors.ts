import type { AuthError } from "@supabase/supabase-js";

export function vertaalAuthFout(error: AuthError | Error): string {
  console.error("[auth]", error);

  const message = error.message.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "Onjuist e-mailadres of wachtwoord.";
  }
  if (message.includes("email not confirmed")) {
    return "Bevestig eerst je e-mailadres voordat je inlogt.";
  }
  if (
    message.includes("expired") ||
    message.includes("invalid or has expired")
  ) {
    return "Deze activatielink is verlopen. Vraag een nieuwe bevestigingsmail aan.";
  }
  if (
    message.includes("user already registered") ||
    message.includes("already been registered")
  ) {
    return "Dit e-mailadres is al geregistreerd. Log in of reset je wachtwoord.";
  }
  if (message.includes("password should be at least")) {
    return "Het wachtwoord moet minimaal 8 tekens bevatten.";
  }
  if (message.includes("unable to validate email")) {
    return "Voer een geldig e-mailadres in.";
  }
  if (message.includes("signup is disabled")) {
    return "Registratie is momenteel niet mogelijk. Neem contact op met support.";
  }
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return "Te veel pogingen. Probeer het later opnieuw.";
  }
  if (message.includes("network")) {
    return "Geen verbinding. Controleer je internet en probeer opnieuw.";
  }

  return "Er ging iets mis. Probeer het opnieuw.";
}
