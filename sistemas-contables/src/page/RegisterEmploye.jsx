import { useState } from 'react';
import '../css/page/RegisterEmploye.css'

export function RegisterEmployee() {
  const initialFormData = { id: 0, nombre: '', fecha_ingres: '', salario_mensual: 0 };
  const [dataForm, setDataForm] = useState({ id: 0, nombre: '', fecha_ingres: '', salario_mensual: 0 });
  const [modal, setModal] = useState(false);




  const handleFormInput = (event) => {
    setDataForm({ ...dataForm, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const { ...formDataWithoutId } = dataForm;

    fetch('https://employess.onrender.com/api/v1/empleados',
 {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formDataWithoutId)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setDataForm(initialFormData);
        setModal(true);

        // Mostrar modal en caso de éxito
      })
      .catch(error => console.error('Error:', error))
      .then(response => console.log('Success:', response));
  };


  return (
    <>
      <h1 className="register">Registro de empleados</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="flex_register">
          <label className="register_name">
            Nombre Completo:
          </label>
          <input
            type="text"
            onChange={handleFormInput}
            placeholder="Nombre Completo"
            className="register_input"
            name="nombre"
            value={dataForm.nombre}
          // Corregido aquí
          />
        </div>
        <div className="flex_register">
          <label className="register_name">
            Fecha de ingreso:
          </label>


          <input
            type="date"
            onChange={handleFormInput}
            placeholder="YYYY-MM-DD"
            className="register_input"
            name="fecha_ingres"
            value={dataForm.fecha_ingres}
          />
        </div>
        <div className="flex_register">
          <label className="register_name">
            Puesto:
          </label>
          <select
            onChange={handleFormInput}
            className="register_input"
            name="puesto"
            defaultValue={dataForm.puesto}
            value={dataForm.puesto}
            id=""
          >
            <option value="Seleccione el puesto" disabled>
              Seleccione el puesto
            </option>
            <option value="Gerente Administrativo">G.administrativo</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Contador">Contador</option>
            <option value="Vendedor">Vendedor</option>
            <option value="Secretaria">Secretaria</option>
            <option value="Gerente de ventas"> G. de ventas</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Sistemas">Sistemas</option>
            <option value="Intendente">Intendente</option>
          </select>
        </div>
        <div className="flex_register">
          <label className="register_name">
            Salario Mensual:
          </label>
          <input
            type="number"
            onChange={handleFormInput}
            placeholder="Salario mensual"
            className="register_input"
            name="salario_mensual"
            value={dataForm.salario_mensual}

          />
        </div>
        <input className="button_register" type="submit" value="Registrar" />
      </form>
      {modal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModal(false)}>&times;</span>


            <p className="user_name">
              {dataForm.nombre}
            </p>
            <p>Registrado con exito</p>
          </div>
        </div>
      )}
    </>
  );
}

