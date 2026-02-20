export const metadata = {
  title: "Woofwoof 同人生成器",
  description: "陈楚生 × 王栎鑫 同人创作工具",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
