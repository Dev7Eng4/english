import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

interface Props {
  component: React.FunctionComponent;
  [key: string]: any;
}

export default function MyApp({ component, pageProps }: Props) {
  const Component = component;

  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  );
}
