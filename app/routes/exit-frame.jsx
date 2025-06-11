import { redirect } from "@remix-run/node";

export const loader = ({ request }) => {
  const url = new URL(request.url);
  const to = url.searchParams.get("to");

  if (!to || !to.startsWith("http")) {
    return new Response("Invalid redirect", { status: 400 });
  }

  return new Response(
    `<html>
      <head>
        <meta charset="utf-8" />
        <title>Redirecting...</title>
      </head>
      <body>
        <script>
          window.top.location.href = ${JSON.stringify(to)};
        </script>
      </body>
    </html>`,
    {
      headers: {
        "Content-Type": "text/html",
        "Content-Security-Policy": "script-src 'self' 'unsafe-inline';",
      },
    }
  );
};
