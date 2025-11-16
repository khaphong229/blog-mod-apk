export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Blog ModAPK
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Full-stack blog website built with Next.js, TypeScript, and Prisma
        </p>
        <div className="flex gap-4 justify-center">
          <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            Next.js 16
          </div>
          <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">
            TypeScript
          </div>
          <div className="px-4 py-2 bg-accent text-accent-foreground rounded-lg">
            Tailwind CSS
          </div>
        </div>
      </div>
    </main>
  );
}
