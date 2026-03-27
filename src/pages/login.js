// ============================================================
// PÁGINA DE LOGIN - AdsoBarber
// ============================================================
// Esta página permite que un usuario (administrador o barbero)
// inicie sesión en el sistema. Por ahora usa datos FAKE en
// memoria; cuando el backend esté listo solo hay que cambiar
// la función "autenticar()" para que llame a /api/login.
//
// CONCEPTOS QUE SE APLICAN AQUÍ:
//   - useState          → manejar el formulario y el estado de la UI
//   - Eventos React     → onChange (campos) y onSubmit (formulario)
//   - Validaciones      → errores antes de "enviar" al servidor
//   - Renderizado cond. → mostrar/ocultar error o pantalla de éxito
//   - styled-components → estilos en JavaScript
//   - next/router       → redirigir al usuario tras iniciar sesión
// ============================================================

import { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

// ============================================================
// DATOS FAKE DE USUARIOS
// ============================================================
// En producción NUNCA almacenes contraseñas en el cliente.
// Este array existe SOLO para que el módulo funcione sin backend.
//
// Roles disponibles:
//   "admin"   → dueño/administrador de la barbería
//   "barbero" → uno de los 3 barberos del sistema
//
// TODO: Reemplazar "autenticar()" por fetch("/api/login", {...})
//       cuando el endpoint real esté implementado.
// ============================================================
const USUARIOS_FAKE = [
  {
    id: 1,
    email: "admin@adsobarber.com",
    password: "admin123",
    nombre: "Administrador",
    rol: "admin",
  },
  {
    id: 2,
    email: "carlos@adsobarber.com",
    password: "carlos123",
    nombre: "Carlos",
    rol: "barbero",
  },
  {
    id: 3,
    email: "miguel@adsobarber.com",
    password: "miguel123",
    nombre: "Miguel",
    rol: "barbero",
  },
  {
    id: 4,
    email: "andres@adsobarber.com",
    password: "andres123",
    nombre: "Andrés",
    rol: "barbero",
  },
];

// ============================================================
// FUNCIÓN: autenticar
// ============================================================
// Recibe email y password, busca en USUARIOS_FAKE y devuelve
// el usuario si coincide, o null si las credenciales son incorrectas.
//
// Array.find() recorre el array y retorna el PRIMER elemento
// que cumpla la condición, o undefined si ninguno lo hace.
//
// TODO: Cuando exista el backend, esta función debería ser:
//
//   async function autenticar(email, password) {
//     const res = await fetch("/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });
//     if (!res.ok) return null;
//     return res.json(); // → { id, nombre, rol, token }
//   }
// ============================================================
function autenticar(email, password) {
  const usuario = USUARIOS_FAKE.find(
    (u) => u.email === email && u.password === password,
  );
  // Si no encuentra coincidencia, find() devuelve undefined.
  // Convertimos undefined → null para ser más explícitos.
  return usuario ?? null;
}

// ============================================================
// ESTILOS CON STYLED-COMPONENTS
// ============================================================

// ---- Fondo de la página ----
// Usamos flexbox para centrar la tarjeta tanto horizontal
// como verticalmente en toda la pantalla (100vh = 100% de la
// altura del viewport).
const Pagina = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f0;
  padding: 24px;
`;

// ---- Tarjeta del formulario ----
const Tarjeta = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
`;

// ---- Logo / marca en la parte superior ----
const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 2rem;
    font-weight: 800;
    color: #222;
    margin: 0 0 4px;
  }

  span {
    color: #39a900; /* verde SENA */
  }

  p {
    font-size: 0.9rem;
    color: #888;
    margin: 0;
  }
`;

// ---- Línea decorativa verde (igual que en /servicios) ----
const LineaVerde = styled.div`
  width: 50px;
  height: 4px;
  background: #39a900;
  border-radius: 2px;
  margin: 8px auto 0;
`;

// ---- Grupo de campo: etiqueta + input ----
// flex-direction:column apila la etiqueta arriba del input.
const GrupoCampo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
`;

// ---- Etiqueta del campo ----
const Etiqueta = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #444;
`;

// ---- Campo de texto / contraseña ----
// La prop "$conError" cambia el borde a rojo si hay un error
// de validación en ese campo.
const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid ${(p) => (p.$conError ? "#e53e3e" : "#e0e0e0")};
  border-radius: 10px;
  font-size: 1rem;
  color: #222;
  background: #fafafa;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${(p) => (p.$conError ? "#e53e3e" : "#39a900")};
    background: #fff;
  }

  /* Placeholder más suave */
  &::placeholder {
    color: #bbb;
  }
`;

// ---- Texto de error bajo el campo ----
const TextoError = styled.p`
  font-size: 0.8rem;
  color: #e53e3e;
  margin: 0;
`;

// ---- Mensaje de error general (credenciales incorrectas) ----
// Se muestra en un recuadro rojo cuando el login falla.
const AlertaError = styled.div`
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 10px;
  padding: 12px 16px;
  color: #c53030;
  font-size: 0.9rem;
  margin-bottom: 20px;
  text-align: center;
`;

// ---- Botón principal de envío ----
// disabled cambia la apariencia y evita doble clic mientras carga.
const BotonLogin = styled.button`
  width: 100%;
  padding: 14px;
  background: ${(p) => (p.disabled ? "#a5d68a" : "#39a900")};
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  transition:
    background 0.2s,
    transform 0.1s;
  margin-top: 4px;

  &:hover:not(:disabled) {
    background: #2e8700;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

// ---- Pantalla de éxito (se muestra cuando el login fue correcto) ----
const PantallaExito = styled.div`
  text-align: center;

  .icono {
    font-size: 3.5rem;
    margin-bottom: 16px;
  }

  h2 {
    font-size: 1.4rem;
    color: #222;
    margin: 0 0 8px;
  }

  p {
    color: #666;
    font-size: 0.95rem;
    margin: 0 0 24px;
  }
`;

// ---- Chip del rol del usuario (Admin / Barbero) ----
const ChipRol = styled.span`
  display: inline-block;
  background: ${(p) => (p.$rol === "admin" ? "#fff3cd" : "#e8f5e9")};
  color: ${(p) => (p.$rol === "admin" ? "#856404" : "#2e7d32")};
  border: 1px solid ${(p) => (p.$rol === "admin" ? "#ffc107" : "#39a900")};
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

// ---- Botón secundario (volver a inicio, etc.) ----
const BotonSecundario = styled.button`
  background: transparent;
  border: 2px solid #39a900;
  color: #39a900;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #39a900;
    color: #fff;
  }
`;

// ---- Sección de usuarios de prueba (solo en modo fake) ----
// Esta sección le indica al evaluador/profesor qué credenciales
// puede usar. Se puede eliminar cuando haya autenticación real.
const SeccionDemo = styled.div`
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
`;

const TituloDemo = styled.p`
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  color: #bbb;
  letter-spacing: 0.5px;
  margin: 0 0 10px;
  text-align: center;
`;

const FilaDemo = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 6px;
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.82rem;
  color: #555;
  transition: background 0.15s;
  text-align: left;

  &:hover {
    background: #f0fae8;
    border-color: #39a900;
    color: #2e7d32;
  }

  span {
    font-weight: 600;
  }
`;

// ============================================================
// COMPONENTE PRINCIPAL: LoginPage
// ============================================================
// Next.js exporta esta función como la página /login.
// ============================================================
export default function LoginPage() {
  // useRouter nos da acceso al router de Next.js para poder
  // redirigir al usuario a otra página después del login.
  const router = useRouter();

  // ---- Estado 1: datos del formulario ----
  // Guardamos email y password en un solo objeto para tener
  // toda la información del formulario en un lugar.
  // Patrón común: "formulario controlado" (controlled form).
  const [form, setForm] = useState({ email: "", password: "" });

  // ---- Estado 2: errores de validación por campo ----
  // Cada clave corresponde al nombre de un campo del formulario.
  // Si tiene texto, se muestra debajo del campo como error.
  const [errores, setErrores] = useState({});

  // ---- Estado 3: error general de autenticación ----
  // Se activa cuando las credenciales no coinciden con ningún usuario.
  const [errorLogin, setErrorLogin] = useState("");

  // ---- Estado 4: usuario que inició sesión ----
  // null = no autenticado; objeto = sesión activa.
  const [usuarioActual, setUsuarioActual] = useState(null);

  // ---- Estado 5: indicador de carga ----
  // Simula el tiempo de respuesta de un servidor real.
  const [cargando, setCargando] = useState(false);

  // ============================================================
  // HANDLER: onChange de los inputs
  // ============================================================
  // Este handler maneja TODOS los inputs con una sola función.
  // e.target.name  → nombre del campo (ej: "email")
  // e.target.value → valor actual que escribió el usuario
  //
  // El spread operator {...form} copia las propiedades anteriores
  // y [name]: value actualiza solo la que cambió (propiedad dinámica).
  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Limpiar el error del campo mientras el usuario escribe,
    // para que no vea el error rojo mientras corrige.
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  }

  // ============================================================
  // FUNCIÓN: validar
  // ============================================================
  // Revisa que los campos no estén vacíos y que el email tenga
  // un formato básico válido (contiene @ y un punto después).
  //
  // Devuelve:
  //   true  → formulario válido (puede enviarse)
  //   false → hay errores (se muestran en la UI)
  // ============================================================
  function validar() {
    const nuevosErrores = {};

    // Validar email: no puede estar vacío
    if (!form.email.trim()) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      // Expresión regular básica para formato de email:
      //   [^\s@]+  → uno o más caracteres que NO sean espacio ni @
      //   @        → el símbolo arroba
      //   [^\s@]+  → dominio
      //   \.       → punto literal
      //   [^\s@]+  → extensión (.com, .co, etc.)
      nuevosErrores.email = "Ingresa un correo electrónico válido.";
    }

    // Validar contraseña: no puede estar vacía y mínimo 6 caracteres
    if (!form.password) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    } else if (form.password.length < 6) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrores(nuevosErrores);

    // Object.keys() devuelve un array con las claves del objeto.
    // Si la longitud es 0, no hay errores → formulario válido.
    return Object.keys(nuevosErrores).length === 0;
  }

  // ============================================================
  // HANDLER: onSubmit del formulario
  // ============================================================
  // Se ejecuta cuando el usuario hace clic en "Ingresar".
  // e.preventDefault() evita que el formulario recargue la página
  // (comportamiento predeterminado de HTML).
  // ============================================================
  async function manejarEnvio(e) {
    e.preventDefault();

    // 1. Limpiar errores anteriores
    setErrorLogin("");

    // 2. Validar antes de intentar autenticar
    if (!validar()) return; // Si hay errores, no continuamos

    // 3. Simular tiempo de carga de red (500ms)
    //    En producción esto desaparece; el tiempo real lo pone el servidor.
    setCargando(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCargando(false);

    // 4. Intentar autenticar con los datos del formulario
    const usuario = autenticar(form.email, form.password);

    if (!usuario) {
      // Las credenciales no coinciden con ningún usuario fake
      setErrorLogin("Correo o contraseña incorrectos. Intenta de nuevo.");
      return;
    }

    // 5. Login exitoso: guardar el usuario en el estado
    setUsuarioActual(usuario);

    // ----------------------------------------------------------
    // TODO: MODO REAL — Cuando exista el backend:
    //   - Guardar el token JWT en localStorage o en una cookie:
    //       localStorage.setItem("token", usuario.token);
    //   - O usar una librería como next-auth para sesiones seguras.
    //   - Luego redirigir con router.push() al panel del usuario.
    // ----------------------------------------------------------
  }

  // ============================================================
  // HANDLER: rellenar formulario con credenciales de demo
  // ============================================================
  // Cuando el usuario hace clic en una fila de la sección demo,
  // copiamos el email y password al formulario automáticamente.
  function usarCredencialDemo(usuario) {
    setForm({ email: usuario.email, password: usuario.password });
    setErrores({});
    setErrorLogin("");
  }

  // ============================================================
  // RENDER — PANTALLA DE ÉXITO
  // ============================================================
  // Si el login fue exitoso, mostramos una pantalla de bienvenida
  // en lugar del formulario. Esto es renderizado condicional: React
  // evalúa la condición y elige qué JSX pintar.
  if (usuarioActual) {
    return (
      <Pagina>
        <Tarjeta>
          <PantallaExito>
            <div className="icono">✅</div>

            <h2>¡Bienvenido, {usuarioActual.nombre}!</h2>

            {/*
              Chip de rol: muestra "Admin" o "Barbero" con color diferente.
              La prop $rol se pasa al styled-component para cambiar los colores.
            */}
            <ChipRol $rol={usuarioActual.rol}>
              {usuarioActual.rol === "admin"
                ? "👑 Administrador"
                : "✂️ Barbero"}
            </ChipRol>

            <p>
              Tu sesión está activa. Aquí irán los accesos rápidos del panel
              según tu rol.
            </p>

            {/*
              router.push() navega a otra ruta sin recargar la página.
              Es el equivalente programático de hacer clic en un <Link>.
            */}
            <BotonSecundario onClick={() => router.push("/reserva")}>
              Ver calendario de reservas →
            </BotonSecundario>
          </PantallaExito>
        </Tarjeta>
      </Pagina>
    );
  }

  // ============================================================
  // RENDER — FORMULARIO DE LOGIN
  // ============================================================
  return (
    <Pagina>
      <Tarjeta>
        {/* ---- ENCABEZADO / LOGO ---- */}
        <Logo>
          <h1>
            Adso<span>Barber</span>
          </h1>
          <LineaVerde />
          <p>Inicia sesión para continuar</p>
        </Logo>

        {/*
          ---- MENSAJE DE ERROR GENERAL ----
          Solo se renderiza si errorLogin tiene texto.
          El operador && funciona como un "if corto":
            Si errorLogin es "" (falsy) → no renderiza nada
            Si errorLogin tiene texto  → renderiza la alerta
        */}
        {errorLogin && <AlertaError>⚠️ {errorLogin}</AlertaError>}

        {/* ---- FORMULARIO ---- */}
        {/*
          onSubmit apunta a manejarEnvio.
          React captura el evento "submit" del formulario y llama
          a nuestra función, donde hacemos e.preventDefault().
        */}
        <form onSubmit={manejarEnvio} noValidate>
          {/*
            noValidate le dice al navegador que NO use su propia
            validación HTML5 (el globito rojo nativo).
            Así tomamos el control total de los mensajes de error.
          */}

          {/* ---- CAMPO EMAIL ---- */}
          <GrupoCampo>
            <Etiqueta htmlFor="email">Correo electrónico</Etiqueta>

            {/*
              Input "controlado":
                value={form.email}        → React controla el valor
                onChange={manejarCambio}  → React actualiza el estado
              Así, el estado siempre refleja lo que hay en el input.

              name="email" coincide con la clave en el estado `form`,
              lo que permite que manejarCambio funcione genéricamente.
            */}
            <Input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={manejarCambio}
              placeholder="correo@ejemplo.com"
              $conError={!!errores.email}
              autoComplete="email"
            />
            <input />

            {/* Muestra el error del campo solo si existe */}
            {errores.email && <TextoError>{errores.email}</TextoError>}
          </GrupoCampo>

          {/* ---- CAMPO CONTRASEÑA ---- */}
          <GrupoCampo>
            <Etiqueta htmlFor="password">Contraseña</Etiqueta>

            <Input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={manejarCambio}
              placeholder="Mínimo 6 caracteres"
              $conError={!!errores.password}
              autoComplete="current-password"
            />

            {errores.password && <TextoError>{errores.password}</TextoError>}
          </GrupoCampo>

          {/* ---- BOTÓN DE ENVÍO ---- */}
          {/*
            disabled={cargando} bloquea el botón mientras esperamos
            la respuesta del servidor (o el timeout fake).
            Esto evita que el usuario haga clic varias veces.
          */}
          <BotonLogin type="submit" disabled={cargando}>
            {cargando ? "Verificando..." : "Ingresar"}
          </BotonLogin>
        </form>

        {/* ---- SECCIÓN DE CREDENCIALES DEMO ---- */}
        {/*
          Esta sección es SOLO para demostración académica.
          Permite probar el login sin memorizar credenciales.
          TODO: Eliminar esta sección cuando se implemente el backend real.
        */}
        <SeccionDemo>
          <TituloDemo>Usuarios de prueba (datos fake)</TituloDemo>

          {/*
            USUARIOS_FAKE.map() genera una FilaDemo por cada usuario.
            Al hacer clic, usarCredencialDemo() rellena el formulario.
          */}
          {USUARIOS_FAKE.map((u) => (
            <FilaDemo
              key={u.id}
              type="button" // Evita que el clic dispare el onSubmit del form
              onClick={() => usarCredencialDemo(u)}
              title={`Usar credenciales de ${u.nombre}`}
            >
              <span>{u.nombre}</span>
              <span style={{ color: "#aaa", fontWeight: 400 }}>{u.email}</span>
            </FilaDemo>
          ))}
        </SeccionDemo>
      </Tarjeta>
    </Pagina>
  );
}
