let currentStep = 0;
const steps = document.querySelectorAll('.step');

const paciente = {
  datosPersonales: {},
  familiares: [],
  condiciones: [],
  internamientos: []
};

function showStep(index) {
  steps.forEach(step => step.classList.remove('active'));
  steps[index].classList.add('active');
}

function nextStep() {
  if (currentStep === 0) {
    const cedula = document.getElementById('cedula').value;
    if (cedula.length !== 11) {
      alert("La cédula debe tener 11 dígitos");
      return;
    }

    paciente.datosPersonales = {
      nombres: nombres.value,
      apellidos: apellidos.value,
      cedula: cedula
    };
  }

  currentStep++;
  if (currentStep === 4) mostrarResumen();
  showStep(currentStep);
}

function prevStep() {
  currentStep--;
  showStep(currentStep);
}

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

function mostrarResumen() {
  document.getElementById('resumen').textContent =
    JSON.stringify(paciente, null, 2);
}

document.getElementById('formPaciente').addEventListener('submit', e => {
  e.preventDefault();
  let registros = JSON.parse(localStorage.getItem('pacientes')) || [];
  registros.push(paciente);
  localStorage.setItem('pacientes', JSON.stringify(registros));
  alert("Paciente guardado correctamente");
});
