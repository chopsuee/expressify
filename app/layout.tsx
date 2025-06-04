'use client'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { PostsProvider } from "@/lib/posts-context";
import { UsersProvider } from "@/lib/users-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <PostsProvider>
              <UsersProvider>
                {children}
              </UsersProvider>
            </PostsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}