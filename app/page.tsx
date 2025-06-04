'use client'
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="w-full">
      <section>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md px-4">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}