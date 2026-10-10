import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto prose prose-xl w-full max-w-3xl px-4 py-12 prose-invert xl:col-start-2 xl:w-[65ch] xl:max-w-none">
      <h1>Página não encontrada</h1>
      <p>O endereço acessado não existe ou foi removido.</p>
      <Link href="/">Voltar para o início</Link>
    </section>
  );
}
