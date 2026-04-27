export const metadata = {
  title: "BSC Falcão das Milhas",
  description: "Balanced Scorecard Q2/2026 - Falcão das Milhas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, background: "#f8f9fa", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
