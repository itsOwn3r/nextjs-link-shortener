import Form from "@/components/Form";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-[10vh]">
      <Header />
      <h1 className="text-3xl cursor-pointer hover:scale-110 hover:text-muted">
        NextJS Link Shortener
      </h1>
      <div className="grid w-full max-w-3xl items-center gap-1.5 px-8">
        <Form />
      </div>
    </main>
  );
}
