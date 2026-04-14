interface Env {
  STRIPE_SECRET_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (url.pathname === "/api/hello") {
      return new Response(
        JSON.stringify({ message: "Tunisia Gateway API attiva" }),
        {
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    if (url.pathname === "/api/create-checkout-session" && request.method === "POST") {
      try {
        const body = (await request.json()) as { email?: string };
        const { email } = body ?? {};

        const params = new URLSearchParams();
        params.append("mode", "payment");
        params.append("success_url", `https://tunisia.coomunity.it/success`);
        params.append("cancel_url", `https://tunisia.coomunity.it/`);
        params.append("line_items[0][price]", "price_1TLRdTEK0SGuWQDR6BkmFESu");
        params.append("line_items[0][quantity]", "1");

        if (email) {
          params.append("customer_email", email);
        }

        const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });

        const stripeData = (await stripeRes.json()) as {
          url?: string;
          error?: { message?: string };
        };

        if (!stripeRes.ok || !stripeData.url) {
          return new Response(
            JSON.stringify({
              error: stripeData?.error?.message || "Errore nella creazione della sessione Stripe",
            }),
            {
              status: 500,
              headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
        }

        return new Response(JSON.stringify({ url: stripeData.url }), {
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch {
        return new Response(JSON.stringify({ error: "Errore server" }), {
          status: 500,
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};