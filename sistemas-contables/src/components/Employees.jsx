import PropTypes from 'prop-types';
import '../css/components/user.css';
export function Employees({ nombre, fecha_ingres, puesto, salario_mensual, user, modalInfo }) {
  return (
    <>
      <article className="employe">
        <img src={user} alt="Logo de usuario" />
        <h3 className='employe_name '>{nombre}</h3>
        <div className="employe_content_flex"><p className='employe_state'>Ingreso:</p>
          <p className='employe_fech'>{fecha_ingres}</p>

        </div>
        <div className="employe_content_flex">
          <p className='employe_state'>Puesto:</p>
          <p className='employe_fech'>{puesto}</p>
        </div>
        <div className="employe_content_flex">
          <p className='employe_state'>Salario:</p>
          <p className='employe_salary'>${salario_mensual}</p>
        </div>
        
        <button onClick={modalInfo} className="employe_modal_pago">MÁS INFORMACION</button>
      </article>

    </>
  )
}

Employees.propTypes = {
  nombre: PropTypes.string,
  fecha_ingres: PropTypes.string,
  puesto: PropTypes.string,
  salario_mensual: PropTypes.number,
  user: PropTypes.string,
  modalInfo: PropTypes.func
}