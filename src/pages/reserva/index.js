// ============================================================
// PÁGINA DE RESERVAS - AdsoBarber
// ============================================================
// Esta página muestra el calendario de disponibilidad de los
// 3 barberos de la barbería. Permite:
//   - Visualizar disponibilidad por barbero (fondo de color)
//   - Ver citas agendadas (bloques de color)
//   - Filtrar por barbero (chips activos/inactivos)
//   - Crear una nueva cita haciendo clic en un slot disponible
// ============================================================

import dynamic from "next/dynamic";
import { useState } from "react";
import styled from "styled-components";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ModalReserva from "@/components/ModalReserva";

// FullCalendar se carga de forma dinámica con ssr:false porque
// la librería usa APIs del navegador (window/document) que no
// existen en el servidor de Next.js.  Sin esto, el build falla.
const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});

// ============================================================
// DATOS DE LOS BARBEROS
// ============================================================
export const BARBEROS = [
  { id: "carlos", nombre: "Carlos", color: "#1565C0", colorFondo: "#E3F2FD" },
  { id: "miguel", nombre: "Miguel", color: "#2E7D32", colorFondo: "#E8F5E9" },
  { id: "andres", nombre: "Andrés", color: "#6A1B9A", colorFondo: "#F3E5F5" },
];

// ============================================================
// DISPONIBILIDAD SEMANAL (horarios de trabajo)
// ============================================================
// display:"background" pinta el fondo del slot sin bloquear la interacción.
// daysOfWeek: [0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb]
const DISPONIBILIDAD = [
  // Carlos: Lunes a Viernes 08:00–18:00
  {
    id: "disp-carlos",
    barberoId: "carlos",
    display: "background",
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: "10:00",
    endTime: "18:00",
    startRecur: "2026-03-01",
    endRecur: "2026-12-31",
  },

  // Miguel: Martes a Sábado 09:00–19:00
  {
    id: "disp-miguel",
    barberoId: "miguel",
    display: "background",
    daysOfWeek: [2, 3, 4, 5, 6],
    startTime: "10:00",
    endTime: "19:00",
    startRecur: "2026-03-01",
    endRecur: "2026-12-31",
  },

  // Andrés: Lunes, Miércoles, Viernes y Sábado 10:00–20:00
  {
    id: "disp-andres",
    barberoId: "andres",
    display: "background",
    daysOfWeek: [1, 3, 5, 6],
    startTime: "10:00",
    endTime: "20:00",
    startRecur: "2026-03-01",
    endRecur: "2026-12-31",
  },
];

// ============================================================
// CITAS INICIALES DE EJEMPLO
// ============================================================
// En producción estas vendrían de una API (GET /citas).
// Las ponemos en una constante separada para luego pasarlas
// al useState como valor inicial.
const CITAS_INICIALES = [
  {
    id: "c1",
    barberoId: "carlos",
    title: "Corte clásico",
    start: "2026-03-09T08:00:00",
    end: "2026-03-09T08:30:00",
  },
  {
    id: "c2",
    barberoId: "carlos",
    title: "Degradado",
    start: "2026-03-09T10:00:00",
    end: "2026-03-09T09:45:00",
  },
  {
    id: "c3",
    barberoId: "carlos",
    title: "Barba",
    start: "2026-03-10T10:00:00",
    end: "2026-03-10T10:30:00",
  },
  {
    id: "c4",
    barberoId: "carlos",
    title: "Corte + Barba",
    start: "2026-03-11T14:00:00",
    end: "2026-03-11T15:00:00",
  },
  {
    id: "m1",
    barberoId: "miguel",
    title: "Corte clásico",
    start: "2026-03-09T10:00:00",
    end: "2026-03-09T09:30:00",
  },
  {
    id: "m2",
    barberoId: "miguel",
    title: "Tintura",
    start: "2026-03-10T11:00:00",
    end: "2026-03-10T12:00:00",
  },
  {
    id: "m3",
    barberoId: "miguel",
    title: "Degradado",
    start: "2026-03-12T15:00:00",
    end: "2026-03-12T15:45:00",
  },
  {
    id: "m4",
    barberoId: "miguel",
    title: "Barba",
    start: "2026-03-14T10:00:00",
    end: "2026-03-14T10:30:00",
  },
  {
    id: "a1",
    barberoId: "andres",
    title: "Corte clásico",
    start: "2026-03-09T10:00:00",
    end: "2026-03-09T10:30:00",
  },
  {
    id: "a2",
    barberoId: "andres",
    title: "Corte + Barba",
    start: "2026-03-11T12:00:00",
    end: "2026-03-11T12:45:00",
  },
  {
    id: "a3",
    barberoId: "andres",
    title: "Degradado",
    start: "2026-03-13T16:00:00",
    end: "2026-03-13T16:45:00",
  },
  {
    id: "a4",
    barberoId: "andres",
    title: "Tintura",
    start: "2026-03-14T11:00:00",
    end: "2026-03-14T12:00:00",
  },
];

// ============================================================
// FUNCIÓN: construir la lista de eventos para FullCalendar
// ============================================================
function construirEventos(barberosActivos, citas) {
  const mapaBarberos = Object.fromEntries(BARBEROS.map((b) => [b.id, b]));
  const eventos = [];

  // 1. Franjas de disponibilidad (fondo de color suave)
  DISPONIBILIDAD.forEach((disp) => {
    if (!barberosActivos.includes(disp.barberoId)) return;
    const barbero = mapaBarberos[disp.barberoId];
    eventos.push({
      ...disp,
      backgroundColor: barbero.colorFondo,
      extendedProps: { barberoId: disp.barberoId },
    });
  });

  // 2. Citas agendadas (bloques sólidos con color del barbero)
  citas.forEach((cita) => {
    if (!barberosActivos.includes(cita.barberoId)) return;
    const barbero = mapaBarberos[cita.barberoId];
    eventos.push({
      ...cita,
      title: `${barbero.nombre}: ${cita.title}`,
      backgroundColor: barbero.color,
      borderColor: barbero.color,
      textColor: "#ffffff",
      extendedProps: { barberoId: cita.barberoId },
    });
  });

  return eventos;
}

// ============================================================
// ESTILOS
// ============================================================
const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Titulo = styled.h1`
  margin-bottom: 20px;
  color: #333;
`;

const Leyenda = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const ChipBarbero = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 2px solid ${(p) => p.$color};
  background: ${(p) => (p.$activo ? p.$color : "transparent")};
  color: ${(p) => (p.$activo ? "#fff" : p.$color)};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    opacity: 0.85;
  }
`;

const Punto = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => (p.$activo ? "#fff" : p.$color)};
  display: inline-block;
`;

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function ReservaPage() {
  // ---- Estado 1: qué barberos están visibles ----
  const [barberosActivos, setBarberosActivos] = useState(
    BARBEROS.map((b) => b.id),
  );

  // ---- Estado 2: lista de citas (se puede actualizar al crear una nueva) ----
  // Arranca con las citas de ejemplo; en producción se cargaría desde la API.
  const [citas, setCitas] = useState(CITAS_INICIALES);

  // ---- Estado 3: datos del modal ----
  // Cuando el usuario hace clic en un slot, guardamos la información
  // de ese slot aquí para pasársela al modal.
  const [modal, setModal] = useState({
    abierto: false,
    slotInicio: null,
    slotFin: null,
    barberoId: null,
  });

  // ---- Activar/desactivar barbero en los filtros ----
  function toggleBarbero(id) {
    setBarberosActivos((prev) =>
      prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id],
    );
  }

  // ============================================================
  // HANDLER: usuario hace clic/arrastra un slot del calendario
  // ============================================================
  // FullCalendar llama a esta función con un objeto que contiene:
  //   selectInfo.startStr → ISO string de inicio del slot
  //   selectInfo.endStr   → ISO string de fin del slot
  function manejarSeleccionSlot(selectInfo) {
    setModal({
      abierto: true,
      slotInicio: selectInfo.startStr,
      slotFin: selectInfo.endStr,
      // No pre-seleccionamos barbero; el usuario elige en el modal
      barberoId: null,
    });
  }

  // ============================================================
  // HANDLER: usuario confirma la reserva en el modal
  // ============================================================
  // Recibe el objeto nuevaCita construido en ModalReserva
  async function manejarConfirmarReserva(nuevaCita) {
    // ----------------------------------------------------------
    // MODO FAKE (actual):
    // Simplemente añadimos la cita al estado local.
    // La cita aparece en el calendario al instante.
    // ----------------------------------------------------------
    setCitas((prev) => [...prev, nuevaCita]);

    // ----------------------------------------------------------
    // TODO: MODO REAL (cuando tengas el endpoint listo):
    // Reemplaza el setCitas de arriba por este bloque:
    //
    //   try {
    //     const respuesta = await fetch("/api/citas", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(nuevaCita),
    //     });
    //
    //     if (!respuesta.ok) throw new Error("Error al guardar la cita");
    //
    //     // El servidor devuelve la cita guardada (con ID real de BD)
    //     const citaGuardada = await respuesta.json();
    //     setCitas((prev) => [...prev, citaGuardada]);
    //
    //   } catch (error) {
    //     console.error(error);
    //     alert("No se pudo guardar la cita. Intenta de nuevo.");
    //   }
    // ----------------------------------------------------------

    // Cerramos el modal después de guardar
    setModal({
      abierto: false,
      slotInicio: null,
      slotFin: null,
      barberoId: null,
    });
  }

  // ---- Cierra el modal sin guardar ----
  function manejarCancelar() {
    setModal({
      abierto: false,
      slotInicio: null,
      slotFin: null,
      barberoId: null,
    });
  }

  // Construimos los eventos con los filtros y citas actuales
  const eventos = construirEventos(barberosActivos, citas);

  return (
    <Page>
      <Titulo>Reservas AdsoBarber</Titulo>

      {/* ---- FILTROS POR BARBERO ---- */}
      <Leyenda>
        {BARBEROS.map((barbero) => {
          const activo = barberosActivos.includes(barbero.id);
          return (
            <ChipBarbero
              key={barbero.id}
              $color={barbero.color}
              $activo={activo}
              onClick={() => toggleBarbero(barbero.id)}
              title={
                activo
                  ? `Ocultar a ${barbero.nombre}`
                  : `Mostrar a ${barbero.nombre}`
              }
            >
              <Punto $color={barbero.color} $activo={activo} />
              {barbero.nombre}
            </ChipBarbero>
          );
        })}
      </Leyenda>

      {/* ---- CALENDARIO ---- */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        editable={false}
        allDaySlot={false}
        slotMinTime="10:00:00"
        slotMaxTime="20:00:00"
        slotDuration="00:30:00"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay,dayGridMonth",
        }}
        buttonText={{ today: "Hoy", week: "Semana", day: "Día", month: "Mes" }}
        locale="es"
        events={eventos}
        // select es el callback de FullCalendar para cuando el usuario
        // hace clic o arrastra sobre un rango de tiempo libre
        select={manejarSeleccionSlot}
      />

      {/* ---- MODAL DE NUEVA RESERVA ---- */}
      {/* Solo se renderiza cuando modal.abierto es true */}
      <ModalReserva
        abierto={modal.abierto}
        slotInicio={modal.slotInicio}
        slotFin={modal.slotFin}
        barberoId={modal.barberoId}
        barberos={BARBEROS}
        onConfirmar={manejarConfirmarReserva}
        onCancelar={manejarCancelar}
      />
    </Page>
  );
}
