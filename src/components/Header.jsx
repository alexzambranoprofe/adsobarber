import Link from "next/link";
import styled from "styled-components";

/* ===== CONTENEDOR PRINCIPAL ===== */
const HeaderWrapper = styled.header`
  width: 100%;
  background: #39a900;
  color: white;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15);
`;

/* ===== CONTENIDO ===== */
const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 14px 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/* ===== LOGO ===== */
const Brand = styled.a`
  font-size: 22px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  letter-spacing: 1px;

  span {
    color: #dfffd6;
  }
`;

/* ===== MENU ===== */
const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
`;

/* ===== LINKS ===== */
const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 24px;
  font-weight: 500;
  position: relative;

  &:hover {
    opacity: 0.8;
  }

  &:after {
    content: "";
    position: absolute;
    width: 0%;
    height: 4px;
    font-size: 24px;
    background: white;
    left: 0;
    bottom: -4px;
    transition: 0.3s;
  }

  &:hover:after {
    width: 100%;
  }
`;

/* ===== BOTON LOGIN ===== */
const LoginButton = styled.a`
  background: white;
  color: #39a900;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    background: #2e8700;
    color: white;
  }
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <Container>
        <Link href="/" passHref legacyBehavior>
          <Brand>
            Adso<span>Barber</span>
          </Brand>
        </Link>

        <Nav>
          <Link href="/servicios" passHref legacyBehavior>
            <NavLink>Servicios</NavLink>
          </Link>

          <Link href="/reserva" passHref legacyBehavior>
            <NavLink>Reservar</NavLink>
          </Link>

          <Link href="/login" passHref legacyBehavior>
            <LoginButton>Login</LoginButton>
          </Link>
        </Nav>
      </Container>
    </HeaderWrapper>
  );
}
