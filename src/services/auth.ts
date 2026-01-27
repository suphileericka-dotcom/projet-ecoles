// frontend/src/services/auth.ts
export async function login(identifier: string, password: string) {
  const res = await fetch("http://localhost:8000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    throw new Error("Identifiants invalides");
  }

  return res.json();
}
