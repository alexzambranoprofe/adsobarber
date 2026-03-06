import GlobalStyles from "@/styles/GlobalStyles";
import Layout from "@/components/Layaout";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
