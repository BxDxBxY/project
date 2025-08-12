import { HeaderDefault } from "@/components/dictionary/HeaderDefault";

export default function About() {
  return (
    <>
      <HeaderDefault />
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <h1 className="text-3xl font-bold mb-4">
          About the Diplomatic Glossary
        </h1>
        <p className="max-w-xl text-lg text-center">
          This glossary provides definitions and explanations of diplomatic
          terms in English, Uzbek, and Russian. It is designed to help students,
          professionals, and anyone interested in international relations
          understand key concepts and terminology.
        </p>
      </div>
    </>
  );
}
