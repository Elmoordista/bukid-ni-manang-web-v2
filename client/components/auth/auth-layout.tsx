"use client";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-xl">
            <img src="/images/IMG_9900_1759418259559.jpeg" alt="Bukid ni Manang" className="h-16 w-16 object-cover rounded-xl shadow-lg" />
          </div>
          <span className="text-3xl ml-4 font-semibold">Bukid ni Manang</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-4">
            <p className="text-2xl leading-relaxed font-medium">
              &ldquo;Experience the tranquil beauty of nature and luxury combined at Bukid ni Manang.&rdquo;
            </p>
            <footer className="text-lg text-white/80">Your perfect getaway destination</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-8 lg:p-12 flex items-center justify-center bg-muted/50">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}