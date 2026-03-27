// ============================================================
// PÁGINA DE SERVICIOS - AdsoBarber
// ============================================================
// Esta página muestra el catálogo completo de servicios que
// ofrece la barbería. Cada servicio se presenta en una tarjeta
// (card) con:
//   - Un ícono representativo
//   - Nombre del servicio
//   - Descripción corta
//   - Duración estimada
//   - Precio de referencia
//
// Al final de la página hay un botón que lleva directamente
// a la página de reservas para que el cliente agende su cita.
//
// CONCEPTOS QUE SE APLICAN AQUÍ:
//   - Array.map()       → recorrer un arreglo para crear JSX
//   - styled-components → estilos en JavaScript
//   - next/link         → navegación sin recargar la página
//   - props de styled   → cambiar estilos según datos del array
// ============================================================

// Link es el componente de Next.js para navegar entre páginas.
// A diferencia de <a href="...">, Link NO recarga toda la página;
// solo carga el contenido nuevo, lo que es más rápido.
import Link from "next/link";

// styled-components nos permite escribir CSS dentro de JS.
// Cada constante que creamos con styled.div`...` es un componente
// React que ya trae sus estilos incorporados.
import styled from "styled-components";

// ============================================================
// CATÁLOGO DE SERVICIOS
// ============================================================
// Definimos los servicios como un ARRAY DE OBJETOS.
//
// ¿Por qué un array y no JSX directo?
//   Porque así separamos los DATOS de la PRESENTACIÓN.
//   Si mañana queremos agregar un servicio nuevo, solo tocamos
//   este array — no tenemos que buscar dentro del HTML/JSX.
//
// Campos de cada servicio:
//   id          → identificador único (string sin espacios ni tildes)
//   icono       → emoji que representa visualmente el servicio
//   nombre      → nombre que se muestra al cliente
//   descripcion → texto corto que explica en qué consiste
//   duracionMin → cuántos minutos dura el servicio
//   precio      → valor en pesos colombianos (COP)
//   destacado   → boolean; true = la tarjeta se resalta visualmente
// ============================================================
const SERVICIOS = [
  {
    id: "corte-clasico",
    icono: "✂️",
    nombre: "Corte clásico",
    descripcion:
      "Corte tradicional con tijera o máquina. Incluye lavado y secado.",
    duracionMin: 30,
    precio: 25000,
    destacado: false,
  },
  {
    id: "degradado",
    icono: "💈",
    nombre: "Degradado",
    descripcion:
      "Fade o degradado a distintas alturas. Técnica con máquina y tijera.",
    duracionMin: 45,
    precio: 35000,
    destacado: true, // Este se destaca porque es el más pedido
  },
  {
    id: "barba",
    icono: "🪒",
    nombre: "Arreglo de barba",
    descripcion:
      "Perfilado, afeitado con navaja y aceites hidratantes para la piel.",
    duracionMin: 30,
    precio: 20000,
    destacado: false,
  },
  {
    id: "corte-barba",
    icono: "👑",
    nombre: "Corte + Barba",
    descripcion:
      "Combo completo: corte a elección más arreglo de barba con navaja.",
    duracionMin: 60,
    precio: 45000,
    destacado: true, // Combo más vendido — se resalta
  },
  {
    id: "tintura",
    icono: "🎨",
    nombre: "Tintura",
    descripcion:
      "Coloración completa con productos profesionales. Incluye tratamiento.",
    duracionMin: 60,
    precio: 60000,
    destacado: false,
  },
  {
    id: "pestanas",
    icono: "✨",
    nombre: "Pestañas",
    descripcion:
      "Lifting y tinte de pestañas para un look natural e impactante.",
    duracionMin: 120,
    precio: 80000,
    destacado: false,
  },
];

// ============================================================
// FUNCIÓN AUXILIAR: formatearPrecio
// ============================================================
// Convierte un número entero a formato de moneda colombiana.
//
// Ejemplo:
//   formatearPrecio(25000)  →  "$ 25.000"
//
// Intl.NumberFormat es una API nativa del navegador y de Node.js
// diseñada para formatear números según reglas de cada país.
//   "es-CO" → español de Colombia (usa punto como separador de miles)
//   style:"currency" → agrega el símbolo de la moneda
//   currency:"COP"   → pesos colombianos
//   minimumFractionDigits:0 → no muestra centavos (,00)
// ============================================================
function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor);
}

// ============================================================
// ESTILOS CON STYLED-COMPONENTS
// ============================================================
// Cada "styled.X" crea un componente React con estilos propios.
// Los estilos están escritos en CSS normal dentro de template
// literals (las comillas invertidas ``).

// ---- Contenedor principal de la página ----
// max-width limita el ancho para que no se vea demasiado estirado
// en monitores grandes. margin:0 auto lo centra horizontalmente.
const Pagina = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
`;

// ---- Encabezado de la sección ----
const Encabezado = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

// ---- Título principal ----
const Titulo = styled.h1`
  font-size: 2rem;
  color: #222;
  margin-bottom: 12px;
`;

// ---- Línea decorativa verde bajo el título ----
// Se crea con un <span> estilizado como bloque pequeño.
// Es un detalle visual que le da identidad a la marca.
const LineaVerde = styled.span`
  display: block;
  width: 60px;
  height: 4px;
  background: #39a900;
  border-radius: 2px;
  margin: 0 auto 16px;
`;

// ---- Subtítulo / descripción del encabezado ----
const Subtitulo = styled.p`
  font-size: 1rem;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
`;

// ---- Cuadrícula de tarjetas ----
// CSS Grid divide el espacio en columnas automáticamente.
//
// repeat(auto-fill, minmax(280px, 1fr)) significa:
//   - Crea tantas columnas como quepan en el contenedor
//   - Cada columna mide mínimo 280px y máximo 1 fracción del espacio
//   - Resultado: 1 columna en móvil, 2 en tablet, 3 en escritorio
//     (sin usar media queries!)
const Grilla = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 56px;
`;

// ---- Tarjeta de servicio ----
// Recibe la prop "$destacado" para cambiar el borde si el servicio
// está marcado como popular.
//
// Las props que empiezan con $ (signo dólar) son "transient props"
// de styled-components: le indican al componente cómo verse pero
// NO se pasan al DOM real (lo que evitaría un warning de React).
const Tarjeta = styled.article`
  background: #fff;
  border-radius: 16px;
  padding: 28px 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  border: 2px solid ${(p) => (p.$destacado ? "#39a900" : "transparent")};
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  /* Al pasar el mouse, la tarjeta "se levanta" suavemente */
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

// ---- Etiqueta "Más popular" que aparece en tarjetas destacadas ----
// Solo se renderiza cuando destacado === true (ver JSX más abajo).
const EtiquetaPopular = styled.span`
  display: inline-block;
  background: #39a900;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 3px 10px;
  border-radius: 999px;
  align-self: flex-start; /* se queda a la izquierda, no ocupa todo el ancho */
`;

// ---- Ícono grande del servicio ----
const Icono = styled.div`
  font-size: 2.5rem;
  line-height: 1;
`;

// ---- Nombre del servicio ----
const NombreServicio = styled.h2`
  font-size: 1.15rem;
  color: #222;
  margin: 0;
`;

// ---- Descripción corta ----
const Descripcion = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin: 0;

  /* flex:1 hace que la descripción "crezca" y empuje el precio
     hacia abajo, alineando todos los precios al mismo nivel
     sin importar el largo del texto */
  flex: 1;
`;

// ---- Fila inferior: duración y precio ----
const FilaDetalle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

// ---- Texto de duración ----
const Duracion = styled.span`
  font-size: 0.85rem;
  color: #888;

  /* El símbolo ⏱ se agrega en el JSX como texto,
     no como ícono importado */
`;

// ---- Precio del servicio ----
const Precio = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #39a900;
`;

// ---- Sección del llamado a la acción (CTA) ----
// CTA = Call To Action → el botón o enlace principal de la página
const SeccionCTA = styled.div`
  text-align: center;
  padding: 48px 24px;
  background: #f7fdf2;
  border-radius: 20px;
`;

const TextoCTA = styled.p`
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 24px;
`;

// ---- Botón de reserva ----
// styled(Link) aplica estilos a un componente externo (Link de Next.js).
// Esto funciona porque Link acepta la prop className, que es como
// styled-components inyecta los estilos.
const BotonReservar = styled(Link)`
  display: inline-block;
  background: #39a900;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  padding: 14px 36px;
  border-radius: 999px;
  text-decoration: none;
  transition:
    background 0.2s,
    transform 0.2s;

  &:hover {
    background: #2e8700;
    transform: scale(1.03);
  }
`;

// ============================================================
// COMPONENTE PRINCIPAL: ServiciosPage
// ============================================================
// Este es el componente que Next.js exporta como página.
// Como está en src/pages/servicios.js, se accede en /servicios.
// ============================================================
export default function ServiciosPage() {
  return (
    <Pagina>
      {/* ---- ENCABEZADO ---- */}
      <Encabezado>
        <Titulo>Nuestros Servicios</Titulo>

        {/* LineaVerde es solo decorativa; no tiene contenido de texto */}
        <LineaVerde />

        <Subtitulo>
          Ofrecemos cortes y tratamientos de calidad atendidos por barberos
          profesionales. Elige el servicio que más se adapte a tu estilo.
        </Subtitulo>
      </Encabezado>

      {/* ---- CUADRÍCULA DE TARJETAS ---- */}
      {/*
        SERVICIOS.map() recorre cada elemento del array y devuelve
        un fragmento de JSX (la tarjeta).

        React necesita que cada elemento de una lista tenga una
        prop "key" única para poder identificarlos y actualizarlos
        de forma eficiente. Usamos servicio.id como key.
      */}
      <Grilla>
        {SERVICIOS.map((servicio) => (
          <Tarjeta key={servicio.id} $destacado={servicio.destacado}>
            {/*
              Renderizado condicional con &&:
              Si servicio.destacado es true, se muestra la etiqueta.
              Si es false, la expresión cortocircuita y no pinta nada.
              Equivale a: if (servicio.destacado) { return <Etiqueta /> }
            */}
            {servicio.destacado && (
              <EtiquetaPopular>Más popular</EtiquetaPopular>
            )}

            {/* Ícono del servicio (emoji) */}
            <Icono>{servicio.icono}</Icono>

            {/* Nombre */}
            <NombreServicio>{servicio.nombre}</NombreServicio>

            {/* Descripción — ocupa el espacio disponible gracias a flex:1 */}
            <Descripcion>{servicio.descripcion}</Descripcion>

            {/* Fila inferior con duración y precio */}
            <FilaDetalle>
              <Duracion>⏱ {servicio.duracionMin} min</Duracion>

              {/*
                formatearPrecio() convierte 25000 → "$ 25.000"
                Se llama aquí en el JSX igual que cualquier función JS.
              */}
              <Precio>{formatearPrecio(servicio.precio)}</Precio>
            </FilaDetalle>
          </Tarjeta>
        ))}
      </Grilla>

      {/* ---- LLAMADO A LA ACCIÓN ---- */}
      {/*
        BotonReservar es un <Link> de Next.js con estilos de botón.
        href="/reserva" indica la ruta a la que navega al hacer clic.
        Next.js hace la transición sin recargar toda la página.
      */}
      <SeccionCTA>
        <TextoCTA>
          ¿Listo para lucir tu mejor versión? Agenda tu cita en minutos.
        </TextoCTA>
        <BotonReservar href="/reserva">Reservar ahora →</BotonReservar>
      </SeccionCTA>
    </Pagina>
  );
}
