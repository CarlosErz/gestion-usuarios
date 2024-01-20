import { Employees } from '../components/Employees';
import { useState, useEffect } from 'react';
import '../css/page/UserMain.css';
import { Link } from 'react-router-dom';

export function UserMain() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const exel = () => {
    console.log('Generando excel');
  };

  const getEmployees = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/empleados');
      const employeesData = await response.json();

      // Agregar el cálculo de años de trabajo a cada empleado
      const updatedEmployees = employeesData.map((employee) => {
        const currentYear = new Date().getFullYear();
        employee.yearsOfWork = currentYear - new Date(employee.fecha_ingres).getFullYear();
        return employee;
      });

      setEmployees(updatedEmployees);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener la lista de empleados', error);
      setLoading(false);
    }
  };

  const calculateVacationDays = (yearsOfWork) => {
    if (yearsOfWork <= 0) return 0;
    if (yearsOfWork <= 5) return 12 + (yearsOfWork - 1) * 2;
    if (yearsOfWork <= 10) return 22 + (yearsOfWork - 6) * 2;
    return 24 + Math.floor((yearsOfWork - 11) / 5) * 2;
  };

  const calculateNetSalary = (salary, vacationDays) => {
    const salaryDaily = salary / 30; // Assuming a month has 30 days
    const totalSalary = salaryDaily * vacationDays;
    return totalSalary * 0.25 + totalSalary;
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <>
      <nav className="employess_navegation">
        <input type="search" />
        <Link className="register_option" to="/register">
          Registro
        </Link>
        <Link onClick={exel} className="register_option exel">
          Generar excel
        </Link>
        <Link className="register_option exel">Pagos de quincena</Link>
      </nav>
      <h1 className="title">Lista de empleados</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="employees-container">
          {employees.map((employee) => (
            <Employees
              key={employee.id}
              user={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.nombre}`}
              nombre={employee.nombre}
              fecha_ingres={employee.fecha_ingres}
              puesto={employee.puesto}
              salario_mensual={employee.salario_mensual}
              on
              modalInfo={() => {
                console.log('Más información de', employee.nombre);
                setSelectedEmployee(employee);
                setModal(true);
              }}
            />
          ))}
        </div>
      )}
      {modal && selectedEmployee && (
        <div className="modal">
          <button className="modal_close" onClick={() => setModal(false)}>
            X
          </button>
          <div className="modal_content">
            <h2 className="modal_title">Información de pago</h2>
            <div className="modal_employe_info">
              <p className="modal_text">Nombre: {selectedEmployee.nombre}</p>
              <p className="modal_text">Días de vacaciones: {calculateVacationDays(selectedEmployee.yearsOfWork)}</p>
              <p className="modal_text">Salario diario: {selectedEmployee.salario_mensual / 30}</p>
              <p className="modal_text">Sueldo neto con primas vacacionales: {calculateNetSalary(selectedEmployee.salario_mensual, calculateVacationDays(selectedEmployee.yearsOfWork))}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
