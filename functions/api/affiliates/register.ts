// functions/api/affiliates/register.ts
export async function onRequestPost(context: any) {
  try {
    const { env, request } = context;
    const data = await request.json();

    const { name, email, phone, refCode } = data;

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Cloudflare D1 me insert query
    const insertQuery = `
      INSERT INTO affiliates (user_name, email, phone, ref_code, status)
      VALUES (?, ?, ?, ?, 'active')
    `;

    await env.DB.prepare(insertQuery)
      .bind(name, email, phone, refCode || `PRO-${Math.floor(1000 + Math.random() * 9000)}`)
      .run();

    return new Response(
      JSON.stringify({ success: true, message: "Affiliate registered successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate"
        }
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
