import { Employees } from '../components/Employees';
import { useState, useEffect } from 'react';
import '../css/page/UserMain.css';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
export function UserMain() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);



  const exel = async () => {
    try {
      const workbook = XLSX.utils.book_new();
      const modifiedEmployees = employees.map(employee => {
        return {
          ...employee,
          'Días de vacaciones': calculateVacationDays(employee.años_trabajados),
          'Salario diario': employee.salario_mensual / 30,
          'Salario mensual bruto': employee.salario_mensual,
          'Salario Quincenal': calculateSalary_15(employee.salario_mensual),
          'Sueldo neto con primas vacacionales': calculateNetSalary(employee.salario_mensual, calculateVacationDays(employee.yearsOfWork))
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(modifiedEmployees);

      // Aplicar estilos a todas las celdas
      const cellStyle = { numFmt: '#,##0.00', alignment: { horizontal: 'right' } };
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddr = XLSX.utils.encode_cell({ r: row, c: col });
          worksheet[cellAddr].s = cellStyle;
        }
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');
      await XLSX.writeFile(workbook, 'empleados.xlsx');
    } catch (error) {
      console.error('Error al generar el archivo Excel', error);
    }
  };



  const searchEmployee = async () => {
    try {
      if (!searchId.trim() || searchId === 0 || searchId === '1') {
        getEmployees();
      } else {
        const response = await fetch(`https://employess.onrender.com/api/v1/empleados/${searchId}`);
        const employeeData = await response.json();

        if (employeeData) {
          const currentYear = new Date().getFullYear();
          const updatedEmployee = {
            ...employeeData,
            yearsOfWork: currentYear - new Date(employeeData.fecha_ingres).getFullYear(),
          };

          setEmployees([updatedEmployee]);
        } else {
          setSearchId("");
          getEmployees();
        }
      }
    } catch (error) {
      console.error('Error al buscar empleado', error);
    }
  };

  const getEmployees = async () => {
    try {
      const response = await fetch('https://employess.onrender.com/api/v1/empleados');
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
    switch (yearsOfWork) {
      case 1:
        return 12;
      case 2:
        return 14;
      case 3:
        return 16;
      case 4:
        return 18;
      case 5:
        return 20;
      case 6:
        return 20;
      case 7:
        return 20;
      case 8:
        return 20;
      case 9:
        return 20;
      case 10:
        return 22;

      case 11:
        return 22;
      case 12:
        return 22;
      case 13:
        return 22;
      case 14:
        return 22;
      case 15:
        return 22;
      case 16:
        return 22;
      case 17:
        return 22;
      case 18:
        return 22;
      case 19:
        return 22;
    }
  };
  const calculateSalary_15 = (salary) => {
    return salary / 2;
  }

  const calculateNetSalary = (salary, vacationDays) => {
    const salaryDaily = salary / 30; // Assuming a month has 30 days
    const totalSalary = salaryDaily * vacationDays;

    return totalSalary * 0.25 + calculateSalary_15(salary);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <>
      <nav className="employess_navegation">
        <div className="content_search">
          <label >ID</label>

          <input
            type="search"
            placeholder='Ingresa el ID del empleado'
            value={searchId}
            onChange={(event) => setSearchId(event.target.value)}
          />

          <button className='btn' onClick={searchEmployee}>Buscar</button>


        </div>

        <div className="nav_buttons">
          <Link className="register_option" to="/register">
            Registro
          </Link>
          <Link onClick={exel} className="register_option exel">
            Generar excel
          </Link>

        </div>

      </nav>
      <h1 className="title">Lista de empleados</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="employees-container">
          {employees.map((employee) => (
            <Employees
              key={employee.id}
              id={employee.id}
              user={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.nombre}`}
              nombre={employee.nombre}
              fecha_ingres={employee.fecha_ingres}
              puesto={employee.puesto}
              salario_mensual={employee.salario_mensual}
              on
              modalInfo={() => {
                setSelectedEmployee(employee);
                setModal(true);
              }}
            />
          ))}
        </div>
      )}
      {modal && selectedEmployee && (
        <div className="modal">

          <div className="modal_content">
            <button className="modal_close" onClick={() => setModal(false)}>
              X
            </button>
            <h2 className="modal_title">Información de pago</h2>
            <div className="modal_employe_info">
              <img className='modal_img' src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedEmployee.nombre}`} alt="" />
              <p className="modal_text"> Nombre: <b>{selectedEmployee.nombre}</b> </p>
              <p className="modal_text">Días de vacaciones: {calculateVacationDays(selectedEmployee.yearsOfWork)} Dias</p>
              <p
                className="modal_text">Salario diario: $ {selectedEmployee.salario_mensual / 30}</p>
              <p className="modal_text">
                Salario mensual bruto: $ {selectedEmployee.salario_mensual}
              </p>
              <p className="modal_text">
                Salario Quincenal:
                ${calculateSalary_15(selectedEmployee.salario_mensual)}
              </p>
              <p className="modal_text">Sueldo neto con primas vacacionales: $    {calculateNetSalary(selectedEmployee.salario_mensual, calculateVacationDays(selectedEmployee.yearsOfWork))}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
