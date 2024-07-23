import Head from 'next/head';
import WeatherForm from '../components/WeatherForm';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Weather Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold">Weather Tracker</h1>
        <WeatherForm />
      </main>
    </div>
  );
}
