import styled from "styled-components";

/* ===== CONTENEDOR PRINCIPAL ===== */
const FooterWrapper = styled.footer`
  background: #f5f7f6;
  border-top: 4px solid #39a900;
  margin-top: 40px;
`;

/* ===== CONTENIDO INTERNO ===== */
const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

/* ===== SECCIONES ===== */
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* ===== TITULOS ===== */
const Title = styled.h4`
  margin: 0;
  color: #39a900;
  font-weight: 600;
`;

/* ===== TEXTO ===== */
const Text = styled.p`
  margin: 0;
  color: #333;
  font-size: 14px;
`;

/* ===== COPYRIGHT ===== */
const Bottom = styled.div`
  text-align: center;
  padding: 14px;
  background: #2e8700;
  color: white;
  font-size: 13px;
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <Container>
        <Section>
          <Title>AdsoBarber</Title>
          <Text>Barbería moderna con reservas digitales.</Text>
          <Text>Proyecto académico ADSO</Text>
        </Section>

        <Section>
          <Title>Servicios</Title>
          <Text>Corte clásico</Text>
          <Text>Barba</Text>
          <Text>Combo corte + barba</Text>
        </Section>

        <Section>
          <Title>Contacto</Title>
          <Text>adso@barber.com</Text>
          <Text>+57 300 000 0000</Text>
        </Section>
      </Container>

      <Bottom>
        © {new Date().getFullYear()} AdsoBarber - Formación SENA ADSO
      </Bottom>
    </FooterWrapper>
  );
}
