let currentStep = 0;
let pacienteEditandoId = null;
const steps = document.querySelectorAll('.step');

let paciente = crearPacienteVacio();

function crearPacienteVacio() {
  return {
    id: crypto.randomUUID(),
    datosPersonales: {},
    familiares: [],
    condiciones: [],
    internamientos: []
  };
}

/* ================= PASOS ================= */

function showStep(index) {
  steps.forEach(s => s.classList.remove('active'));
  steps[index].classList.add('active');
}

function nextStep() {

  // Validación datos personales
  if (currentStep === 1) {

    if (cedula.value.length !== 11) {
      alert("La cédula debe tener 11 dígitos");
      return;
    }

    // NO sobrescribir el objeto completo
    paciente.datosPersonales.nombres = nombres.value;
    paciente.datosPersonales.apellidos = apellidos.value;
    paciente.datosPersonales.cedula = cedula.value;
  }

  if (currentStep === 4) {
    mostrarResumen();
  }

  currentStep++;
  showStep(currentStep);
}

function prevStep() {
  currentStep--;
  showStep(currentStep);
}

/* ================= LISTADO ================= */

function cargarPacientes() {
  const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
  tablaPacientes.innerHTML = "";

  pacientes.forEach(p => {
    tablaPacientes.innerHTML += `
      <tr>
        <td>${p.datosPersonales.nombres} ${p.datosPersonales.apellidos}</td>
        <td>${p.datosPersonales.cedula}</td>
        <td>
          <button onclick="editarPaciente('${p.id}')">Editar</button>
        </td>
      </tr>
    `;
  });
}

function nuevoPaciente() {
  paciente = crearPacienteVacio();
  pacienteEditandoId = null;
  limpiarFormulario();
  cedula.disabled = false;
  currentStep = 1;
  showStep(currentStep);
}

/* ================= EDICIÓN ================= */

function editarPaciente(id) {
  const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
  paciente = pacientes.find(p => p.id === id);
  pacienteEditandoId = id;

  nombres.value = paciente.datosPersonales.nombres;
  apellidos.value = paciente.datosPersonales.apellidos;
  cedula.value = paciente.datosPersonales.cedula;
  cedula.disabled = true;

  cargarListas();
  currentStep = 1;
  showStep(currentStep);
}

/* ================= AGREGADOS ================= */

function agregarFamiliar() {
  paciente.familiares.push({
    nombre: famNombre.value,
    relacion: famRelacion.value
  });

  listaFamiliares.innerHTML += `<li>${famNombre.value} - ${famRelacion.value}</li>`;
}

function agregarCondicion() {
  paciente.condiciones.push({
    enfermedad: enfermedad.value,
    tiempo: tiempo.value,
    detalle: detalle.value
  });

  listaCondiciones.innerHTML += `<li>${enfermedad.value}</li>`;
}

function agregarInternamiento() {
  paciente.internamientos.push({
    fecha: fecha.value,
    centro: centro.value,
    diagnostico: diagnostico.value
  });

  listaInternamientos.innerHTML += `<li>${fecha.value} - ${centro.value}</li>`;
}

function cargarListas() {
  listaFamiliares.innerHTML = "";
  listaCondiciones.innerHTML = "";
  listaInternamientos.innerHTML = "";

  paciente.familiares.forEach(f =>
    listaFamiliares.innerHTML += `<li>${f.nombre} - ${f.relacion}</li>`
  );

  paciente.condiciones.forEach(c =>
    listaCondiciones.innerHTML += `<li>${c.enfermedad}</li>`
  );

  paciente.internamientos.forEach(i =>
    listaInternamientos.innerHTML += `<li>${i.fecha} - ${i.centro}</li>`
  );
}

/* ================= GUARDAR ================= */

document.getElementById('formPaciente').addEventListener('submit', e => {
  e.preventDefault();

  let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

  if (pacienteEditandoId) {
    pacientes = pacientes.map(p =>
      p.id === pacienteEditandoId ? paciente : p
    );
  } else {
    pacientes.push(paciente);
  }

  localStorage.setItem('pacientes', JSON.stringify(pacientes));
  alert("Paciente guardado");

  currentStep = 0;
  showStep(currentStep);
  cargarPacientes();
});

/* ================= UTIL ================= */

function mostrarResumen() {
  resumen.textContent = JSON.stringify(paciente, null, 2);
}

function limpiarFormulario() {
  document.querySelectorAll("input, textarea").forEach(e => e.value = "");
  listaFamiliares.innerHTML = "";
  listaCondiciones.innerHTML = "";
  listaInternamientos.innerHTML = "";
}

/* ================= INIT ================= */

document.addEventListener('DOMContentLoaded', cargarPacientes);
