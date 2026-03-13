// ============================================================
// COMPONENTE: ModalReserva
// ============================================================
// Un "modal" es una ventana emergente que aparece encima del
// contenido principal de la página. Se usa para pedir datos
// al usuario sin llevarlo a otra página.
//
// Este modal se abre cuando el usuario hace clic en un slot
// libre del calendario y muestra un formulario para registrar
// una nueva cita.
//
// PROPS (parámetros que recibe el componente desde su padre):
// ┌─────────────────────────────────────────────────────────┐
// │ abierto     → boolean  → ¿El modal debe mostrarse?      │
// │ slotInicio  → string   → Hora de inicio seleccionada    │
// │               (formato ISO: "2026-03-09T09:00:00")      │
// │ slotFin     → string   → Hora de fin seleccionada       │
// │ barberoId   → string   → Barbero pre-seleccionado       │
// │ barberos    → array    → Lista completa de barberos      │
// │ onConfirmar → función  → Se llama al guardar la cita     │
// │               Recibe el objeto con los datos de la cita  │
// │ onCancelar  → función  → Se llama al cerrar sin guardar  │
// └─────────────────────────────────────────────────────────┘
// ============================================================

// useState  → para manejar los campos del formulario
// useEffect → para resetear el formulario cada vez que se abre
import { useState, useEffect } from "react";

// styled-components → para crear componentes con estilos CSS
import styled from "styled-components";

// ============================================================
// CATÁLOGO DE SERVICIOS
// ============================================================
// Lista de servicios que ofrece la barbería.
// Cada uno tiene:
//   id          → identificador interno (no se muestra al usuario)
//   label       → texto que aparece en el selector del formulario
//   duracionMin → cuántos minutos dura el servicio
//                 (lo usamos para calcular la hora de fin)
const SERVICIOS = [
  { id: "corte-clasico", label: "Corte clásico", duracionMin: 30 },
  { id: "degradado", label: "Degradado", duracionMin: 45 },
  { id: "barba", label: "Barba", duracionMin: 30 },
  { id: "corte-barba", label: "Corte + Barba", duracionMin: 60 },
  { id: "tintura", label: "Tintura", duracionMin: 60 },
  { id: "pestañas", label: "Pestañas", duracionMin: 120 },
];

// ============================================================
// ESTILOS CON STYLED-COMPONENTS
// ============================================================
// styled-components nos permite escribir CSS directamente
// dentro del archivo JavaScript, asociado a un componente.
// Esto evita conflictos de nombres de clases y mantiene el
// estilo junto al componente que lo usa.

// ---- Overlay ----
// Capa oscura semitransparente que cubre TODA la pantalla.
// position:fixed → se queda fija aunque el usuario haga scroll.
// inset:0        → shorthand para top:0, right:0, bottom:0, left:0.
// z-index:1000   → se pone encima de todos los demás elementos.
// display:flex   → centra la caja del modal con justify/align center.
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// ---- Caja ----
// Contenedor blanco del modal, centrado en pantalla.
// max-width:440px → no crece demasiado en pantallas anchas.
// box-shadow      → da efecto de "flotante" sobre el overlay.
const Caja = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
`;

// ---- Título del modal ----
const ModalTitulo = styled.h2`
  margin: 0 0 20px;
  font-size: 20px;
  color: #333;
`;

// ---- Grupo de campo ----
// Agrupa el <label> y el <input> en columna para que queden
// uno encima del otro con un pequeño espacio entre ellos.
const Grupo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

// ---- Etiqueta de campo ----
const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #555;
`;

// ---- Estilos base compartidos para Input y Select ----
// Como <input> y <select> lucen igual en este formulario,
// extraemos los estilos en una variable de texto (template literal)
// y la reutilizamos en ambos componentes.
// El borde cambia a verde cuando el campo está activo (:focus).
const inputBase = `
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  width: 100%;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: #39a900;
  }
`;

// Aplicamos los mismos estilos a <input> de texto y a <select>
const Input = styled.input`
  ${inputBase}
`;
const Select = styled.select`
  ${inputBase}
`;

// ---- Franja informativa del slot ----
// Muestra la fecha/hora del slot seleccionado con fondo verde claro
// y una barra lateral verde para destacarla visualmente.
const InfoSlot = styled.p`
  background: #f0fbe8;
  border-left: 4px solid #39a900;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  color: #2e5c00;
  margin-bottom: 20px;
`;

// ---- Fila de botones ----
// justify-content:flex-end → los botones se alinean a la derecha.
const Acciones = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
`;

// ---- Botón base (no se usa directamente, solo sirve de base) ----
// Los botones Cancelar y Confirmar "heredan" estos estilos comunes
// y sólo agregan lo que los diferencia.
const Boton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

// ---- Botón Cancelar ----
// Hereda de Boton. Fondo transparente con borde gris.
const BotonCancelar = styled(Boton)`
  background: transparent;
  border: 1px solid #ccc;
  color: #555;
  &:hover {
    background: #f5f5f5;
  }
`;

// ---- Botón Confirmar ----
// Hereda de Boton. Verde SENA sólido.
// &:disabled → cuando el nombre está vacío, se ve gris y no se puede clicar.
const BotonConfirmar = styled(Boton)`
  background: #39a900;
  border: none;
  color: #fff;
  &:hover {
    background: #2e8700;
  }
  &:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
`;

// ============================================================
// FUNCIONES AUXILIARES (helpers)
// ============================================================

// ---- formatearFecha ----
// Convierte una fecha en formato ISO (que usa el computador)
// a un texto legible para el usuario.
//
// Ejemplo:
//   Entrada: "2026-03-09T09:00:00"
//   Salida:  "lun. 9 de mar. · 09:00"
//
// toLocaleString() es un método nativo de JavaScript para
// formatear fechas según el idioma y región indicados.
function formatearFecha(isoString) {
  if (!isoString) return "";
  const fecha = new Date(isoString); // convierte el string en objeto Date
  return fecha.toLocaleString("es-CO", {
    weekday: "short", // "lun.", "mar.", etc.
    day: "numeric", // 9, 10, 11...
    month: "short", // "ene.", "feb.", "mar."...
    hour: "2-digit", // 09, 10, 11...
    minute: "2-digit", // 00, 30...
  });
}

// ---- calcularFin ----
// Dado un horario de inicio y la duración de un servicio en minutos,
// devuelve la hora de fin en formato ISO.
//
// Ejemplo:
//   calcularFin("2026-03-09T09:00:00", 45)
//   → "2026-03-09T09:45:00"
//
// Por qué el ajuste de timezone:
//   new Date().toISOString() siempre devuelve la hora en UTC (zona horaria
//   de referencia mundial).  En Colombia (UTC-5) las 9am son las 2pm UTC.
//   Sin el ajuste, la hora quedaría desplazada 5 horas.
//   La corrección suma el offset del timezone para "volver" a la hora local.
function calcularFin(inicioISO, duracionMin) {
  const fecha = new Date(inicioISO);
  fecha.setMinutes(fecha.getMinutes() + duracionMin); // suma la duración
  const offsetMs = fecha.getTimezoneOffset() * 60000; // offset en milisegundos
  return new Date(fecha.getTime() - offsetMs).toISOString().slice(0, 19);
}

// ============================================================
// COMPONENTE ModalReserva
// ============================================================
export default function ModalReserva({
  abierto,
  slotInicio,
  slotFin,
  barberoId,
  barberos,
  onConfirmar,
  onCancelar,
}) {
  // ----------------------------------------------------------
  // ESTADO INTERNO DEL FORMULARIO
  // ----------------------------------------------------------
  // Cada campo del formulario tiene su propio estado.
  // Cuando el usuario escribe o selecciona algo, actualizamos
  // el estado y React re-renderiza el campo con el nuevo valor.
  // A esto se le llama "componente controlado" (controlled input).

  const [nombreCliente, setNombreCliente] = useState("");
  const [servicioId, setServicioId] = useState(SERVICIOS[0].id);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState("");

  // ----------------------------------------------------------
  // EFECTO: resetear el formulario cada vez que se abre
  // ----------------------------------------------------------
  // useEffect ejecuta su función cuando alguna de las variables
  // de su arreglo de dependencias cambia.
  //
  // Aquí: cuando [abierto, barberoId, barberos] cambia.
  // Si el modal pasa de cerrado (false) a abierto (true),
  // limpiamos los campos para que no queden datos de la vez anterior.
  useEffect(() => {
    if (abierto) {
      // Si el padre nos manda un barbero pre-seleccionado lo usamos,
      // si no, tomamos el primero de la lista.
      // El operador ?. (optional chaining) evita errores si barberos está vacío.
      setBarberoSeleccionado(barberoId || barberos[0]?.id || "");
      setNombreCliente("");
      setServicioId(SERVICIOS[0].id);
    }
  }, [abierto, barberoId, barberos]);

  // ----------------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // ----------------------------------------------------------
  // Si el modal no está abierto, no pintamos nada en el DOM.
  // Esto es más eficiente que tenerlo oculto con display:none.
  if (!abierto) return null;

  // ----------------------------------------------------------
  // MANEJADOR DE ENVÍO DEL FORMULARIO
  // ----------------------------------------------------------
  function manejarEnvio(e) {
    // e.preventDefault() impide el comportamiento por defecto del form
    // que sería recargar la página al hacer submit.
    e.preventDefault();

    // Buscamos en el catálogo el servicio que eligió el usuario
    // para saber cuánto tiempo dura y calcular la hora de fin.
    const servicio = SERVICIOS.find((s) => s.id === servicioId);

    // Calculamos la hora de fin sumando la duración del servicio
    const fin = calcularFin(slotInicio, servicio.duracionMin);

    // Construimos el objeto con TODOS los datos de la nueva cita.
    // Este objeto es el que FullCalendar necesita para pintar el evento.
    const nuevaCita = {
      // Date.now() devuelve el número de milisegundos desde 1970.
      // Lo usamos como ID temporal único. El servidor asignará un ID real.
      id: `cita-${Date.now()}`,

      barberoId: barberoSeleccionado,

      // El título que aparecerá en el bloque del calendario
      title: `${servicio.label} · ${nombreCliente}`,

      start: slotInicio, // hora de inicio del slot seleccionado
      end: fin, // hora de fin calculada con la duración
    };

    // Llamamos a la función del componente padre (ReservaPage)
    // y le pasamos el objeto de la nueva cita.
    // El padre decide qué hacer con ella (guardar en estado, llamar API, etc.)
    onConfirmar(nuevaCita);
  }

  console.log(nombreCliente);
  // ----------------------------------------------------------
  // RENDERIZADO DEL MODAL
  // ----------------------------------------------------------
  return (
    // El Overlay captura el clic FUERA de la caja para cerrar el modal
    <Overlay onClick={onCancelar}>
      {/*
        ¿Por qué stopPropagation?
        Los eventos del DOM "burbujean" hacia arriba por el árbol de elementos.
        Si el usuario hace clic DENTRO de la Caja, ese clic también llegaría
        al Overlay y cerraría el modal sin querer.
        stopPropagation() detiene la propagación del evento en ese punto.
      */}
      <Caja onClick={(e) => e.stopPropagation()}>
        <ModalTitulo>Nueva reserva</ModalTitulo>

        {/* Franja que muestra la fecha y hora del slot seleccionado */}
        <InfoSlot>📅 {formatearFecha(slotInicio)}</InfoSlot>

        {/*
          Usamos un <form> con onSubmit para aprovechar la validación
          nativa del navegador (el atributo "required" en los campos).
          Solo se ejecuta manejarEnvio si todos los campos requeridos
          están completos.
        */}
        <form onSubmit={manejarEnvio}>
          {/* ---- Campo: Nombre del cliente ---- */}
          <Grupo>
            <Label htmlFor="nombreCliente">Nombre del cliente</Label>
            {/*
              value={nombreCliente}             → el input muestra el estado
              onChange={(e) => setNombre(...)}  → al escribir, actualiza el estado
              required                          → el navegador bloquea el submit si está vacío
              autoFocus                         → el cursor aparece aquí al abrir el modal
            */}
            <Input
              id="nombreCliente"
              type="text"
              placeholder="Ej: Juan Pérez"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              required
              autoFocus
            />
          </Grupo>

          {/* ---- Campo: Servicio ---- */}
          <Grupo>
            <Label htmlFor="servicio">Servicio</Label>
            {/*
              Recorremos el array SERVICIOS con .map() para generar
              una <option> por cada servicio.  La key es obligatoria
              en React cuando se renderizan listas.
            */}
            <Select
              id="servicio"
              value={servicioId}
              onChange={(e) => setServicioId(e.target.value)}
            >
              {SERVICIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({s.duracionMin} min)
                </option>
              ))}
            </Select>
          </Grupo>

          {/* ---- Campo: Barbero ---- */}
          <Grupo>
            <Label htmlFor="barbero">Barbero</Label>
            {/*
              La lista de barberos viene del componente padre (props.barberos).
              Así el modal no conoce directamente el array BARBEROS del padre,
              lo que lo hace más reutilizable.
            */}
            <Select
              id="barbero"
              value={barberoSeleccionado}
              onChange={(e) => setBarberoSeleccionado(e.target.value)}
            >
              {barberos.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre}
                </option>
              ))}
            </Select>
          </Grupo>

          {/* ---- Botones de acción ---- */}
          <Acciones>
            {/* type="button" evita que este botón dispare el onSubmit del form */}
            <BotonCancelar type="button" onClick={onCancelar}>
              Cancelar
            </BotonCancelar>

            {/*
              disabled={!nombreCliente.trim()}
              Si el nombre está vacío (o solo tiene espacios), el botón
              queda deshabilitado y no se puede confirmar la reserva.
              .trim() elimina espacios al inicio y al final del string.
            */}
            <BotonConfirmar type="submit" disabled={!nombreCliente.trim()}>
              Confirmar reserva
            </BotonConfirmar>
          </Acciones>
        </form>
      </Caja>
    </Overlay>
  );
}
