// app/routes/exit-frame.tsx
import { LoaderFunctionArgs } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const to = url.searchParams.get("to");

  if (!to || !to.startsWith("http")) {
    return new Response("Invalid redirect", { status: 400 });
  }

  // Return HTML that redirects the top window
  return new Response(
    `<html>
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
}
