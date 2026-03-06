import styled from "styled-components";
import Footer from "./Footer";
import Header from "./Header";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
const Main = styled.main`
  flex: 1;
`;

export default function Layout({ children }) {
  return (
    <Wrapper>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </Wrapper>
  );
}
