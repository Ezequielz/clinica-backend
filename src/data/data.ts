import { bcryptAdapter } from "../config/bcrypt.adapter";

interface MedicoSeed {
  sueldo: number;
  especialidadId: string;
  turnos: TurnoSeed[];
}

interface TurnoSeed {
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
}


interface ServicioSeed {
  codigo_servicio: string;
  nombre: string;
  descripcion: string;
  precio: number;
}

interface UsersSeed {
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nac: Date;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  rol: RolSeed;
}

enum RolSeed {
  USER = "USER",
  ADMIN = "ADMIN",
}

interface InitialSeed {
  users: UsersSeed[];
  medicos: MedicoSeed[];
  servicios: ServicioSeed[];
}

export const seed: InitialSeed = {
  users: [
    // Pacientes
    {
      nombre: "Juan",
      apellido: "Pérez",
      dni: "1223456789",
      fecha_nac: new Date("1990-01-01"),
      email: "juan.perez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "123456789",
      direccion: "Calle Falsa 123",
      rol: RolSeed.USER
    },

    {
      nombre: "Ana",
      apellido: "Gómez",
      dni: "872654321",
      fecha_nac: new Date("1985-02-02"),
      email: "ana.gomez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "987654321",
      direccion: "Calle Verdadera 456",
      rol: RolSeed.ADMIN
    },

    {
      nombre: "Luis",
      apellido: "Martínez",
      dni: "112223344",
      fecha_nac: new Date("1992-03-03"),
      email: "luis.martinez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "456789123",
      direccion: "Calle Falsa 789",
      rol: RolSeed.ADMIN
    },

    {
      nombre: "María",
      apellido: "López",
      dni: "44332211",
      fecha_nac: new Date("1988-04-04"),
      email: "maria.lopez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "321654987",
      direccion: "Calle Auténtica 321",
      rol: RolSeed.ADMIN
    },

    {
      nombre: "Pedro",
      apellido: "García",
      dni: "667788299",
      fecha_nac: new Date("1995-05-05"),
      email: "pedro.garcia@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "654987321",
      direccion: "Calle Secundaria 654",
      rol: RolSeed.ADMIN
    },

    {
      nombre: "Sofía",
      apellido: "Hernández",
      dni: "99887766",
      fecha_nac: new Date("2000-06-06"),
      email: "sofia.hernandez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "789321654",
      direccion: "Calle Principal 987",
      rol: RolSeed.USER
    },


    // Médicos
    {
      nombre: "Carlos",
      apellido: "Rodríguez",
      dni: "55443322",
      fecha_nac: new Date("1980-07-07"),
      email: "carlos.rodriguez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "987123654",
      direccion: "Calle Médica 111",
      rol: RolSeed.USER
    },

    {
      nombre: "Laura",
      apellido: "Fernández",
      dni: "22113344",
      fecha_nac: new Date("1983-08-08"),
      email: "laura.fernandez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "654321987",
      direccion: "Calle Salud 222",
      rol: RolSeed.USER
    },

    {
      nombre: "Jorge",
      apellido: "Gutiérrez",
      dni: "33221144",
      fecha_nac: new Date("1975-09-09"),
      email: "jorge.gutierrez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "321987654",
      direccion: "Calle Clínica 333",
      rol: RolSeed.USER
    },

    {
      nombre: "Elena",
      apellido: "Castro",
      dni: "665542433",
      fecha_nac: new Date("1990-10-10"),
      email: "elena.castro1@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "987654123",
      direccion: "Calle Hospital 444",
      rol: RolSeed.USER
    },
    {
      nombre: "Elena",
      apellido: "Castro",
      dni: "626554433",
      fecha_nac: new Date("1990-10-10"),
      email: "elena.castro2@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "987654123",
      direccion: "Calle Hospital 444",
      rol: RolSeed.USER
    },
    {
      nombre: "Carlos",
      apellido: "Ramírez",
      dni: "1224345678",
      fecha_nac: new Date("1980-01-01"),
      email: "carlos.ramirez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "123456789",
      direccion: "Calle Principal 123",
      rol: RolSeed.USER,
    },
    {
      nombre: "Laura",
      apellido: "Gómez",
      dni: "234546789",
      fecha_nac: new Date("1985-02-02"),
      email: "laura.gomez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "234567890",
      direccion: "Calle Secundaria 234",
      rol: RolSeed.USER,
    },
    {
      nombre: "Jorge",
      apellido: "Pérez",
      dni: "345675890",
      fecha_nac: new Date("1975-03-03"),
      email: "jorge.perez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "345678901",
      direccion: "Calle Tercera 345",
      rol: RolSeed.USER,
    },
    {
      nombre: "Ana",
      apellido: "López",
      dni: "456782901",
      fecha_nac: new Date("1990-04-04"),
      email: "ana.lopez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "456789012",
      direccion: "Calle Cuarta 456",
      rol: RolSeed.USER,
    },
    {
      nombre: "Luis",
      apellido: "Hernández",
      dni: "567890212",
      fecha_nac: new Date("1982-05-05"),
      email: "luis.hernandez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "567890123",
      direccion: "Calle Quinta 567",
      rol: RolSeed.USER,
    },
    {
      nombre: "Elena",
      apellido: "Castro",
      dni: "66554433",
      fecha_nac: new Date("1990-10-10"),
      email: "elena.castro@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "987654123",
      direccion: "Calle Hospital 444",
      rol: RolSeed.USER,
    },
    {
      nombre: "María",
      apellido: "García",
      dni: "678290123",
      fecha_nac: new Date("1993-06-06"),
      email: "maria.garcia@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "678901234",
      direccion: "Calle Sexta 678",
      rol: RolSeed.USER,
    },
    {
      nombre: "Pedro",
      apellido: "Martínez",
      dni: "789012234",
      fecha_nac: new Date("1987-07-07"),
      email: "pedro.martinez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "789012345",
      direccion: "Calle Séptima 789",
      rol: RolSeed.USER,
    },
    {
      nombre: "Sofía",
      apellido: "Rodríguez",
      dni: "890123452",
      fecha_nac: new Date("1995-08-08"),
      email: "sofia.rodriguez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "890123456",
      direccion: "Calle Octava 890",
      rol: RolSeed.USER,
    },
    {
      nombre: "Fernando",
      apellido: "Díaz",
      dni: "901243456",
      fecha_nac: new Date("1988-09-09"),
      email: "fernando.diaz@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "901234567",
      direccion: "Calle Novena 901",
      rol: RolSeed.USER,
    },
    {
      nombre: "Clara",
      apellido: "Fernández",
      dni: "12345679",
      fecha_nac: new Date("1981-10-10"),
      email: "clara.fernandez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "112233445",
      direccion: "Calle Décima 112",
      rol: RolSeed.USER,
    },
    {
      nombre: "Ricardo",
      apellido: "Vargas",
      dni: "23456780",
      fecha_nac: new Date("1983-11-11"),
      email: "ricardo.vargas@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "223344556",
      direccion: "Calle Central 223",
      rol: RolSeed.USER,
    },
    {
      nombre: "Isabel",
      apellido: "Morales",
      dni: "34567891",
      fecha_nac: new Date("1994-12-12"),
      email: "isabel.morales@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "334455667",
      direccion: "Calle Norte 334",
      rol: RolSeed.USER,
    },
    {
      nombre: "Adrián",
      apellido: "Paredes",
      dni: "45678902",
      fecha_nac: new Date("1992-01-13"),
      email: "adrian.paredes@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "445566778",
      direccion: "Calle Sur 445",
      rol: RolSeed.USER,
    },
    {
      nombre: "Camila",
      apellido: "Núñez",
      dni: "56789013",
      fecha_nac: new Date("1989-02-14"),
      email: "camila.nunez@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "556677889",
      direccion: "Calle Este 556",
      rol: RolSeed.USER,
    },
    {
      nombre: "Andrés",
      apellido: "Guzmán",
      dni: "67890124",
      fecha_nac: new Date("1991-03-15"),
      email: "andres.guzman@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "667788990",
      direccion: "Calle Oeste 667",
      rol: RolSeed.USER,
    },
    {
      nombre: "Victoria",
      apellido: "Mendoza",
      dni: "78901235",
      fecha_nac: new Date("1986-04-16"),
      email: "victoria.mendoza@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "778899001",
      direccion: "Calle Avenida 778",
      rol: RolSeed.USER,
    },
    {
      nombre: "Daniel",
      apellido: "Rojas",
      dni: "89012346",
      fecha_nac: new Date("1984-05-17"),
      email: "daniel.rojas@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "889900112",
      direccion: "Calle Boulevard 889",
      rol: RolSeed.USER,
    },
    {
      nombre: "Patricia",
      apellido: "Cruz",
      dni: "90123457",
      fecha_nac: new Date("1987-06-18"),
      email: "patricia.cruz@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "990011223",
      direccion: "Calle Nueva 990",
      rol: RolSeed.USER,
    },
    {
      nombre: "Hugo",
      apellido: "Navarro",
      dni: "121223344",
      fecha_nac: new Date("1990-07-19"),
      email: "hugo.navarro@example.com",
      password: bcryptAdapter.hash("password123"),
      telefono: "110022334",
      direccion: "Calle Antigua 110",
      rol: RolSeed.USER,
    },

  ],
  medicos: [
    {
      sueldo: 50000,
      especialidadId: "1",
      turnos: [
        { dia_semana: "Lunes", hora_inicio: "08:00", hora_fin: "12:00" },
        { dia_semana: "Miércoles", hora_inicio: "08:00", hora_fin: "12:00" },
      ],
    },
    {
      sueldo: 60000,
      especialidadId: "2",
      turnos: [
        { dia_semana: "Martes", hora_inicio: "09:00", hora_fin: "13:00" },
        { dia_semana: "Jueves", hora_inicio: "09:00", hora_fin: "13:00" },
      ],
    },
    {
      sueldo: 55000,
      especialidadId: "3",
      turnos: [
        { dia_semana: "Viernes", hora_inicio: "10:00", hora_fin: "14:00" },
      ],
    },
    {
      sueldo: 48000,
      especialidadId: "1",
      turnos: [
        { dia_semana: "Lunes", hora_inicio: "14:00", hora_fin: "18:00" },
        { dia_semana: "Miércoles", hora_inicio: "14:00", hora_fin: "18:00" },
      ],
    },
    {
      sueldo: 47000,
      especialidadId: "4",
      turnos: [
        { dia_semana: "Martes", hora_inicio: "10:00", hora_fin: "15:00" },
        { dia_semana: "Miércoles", hora_inicio: "8:00", hora_fin: "18:00" },
      ],
    },
    {
      sueldo: 42000,
      especialidadId: "5",
      turnos: [
        { dia_semana: "Viernes", hora_inicio: "10:00", hora_fin: "15:00" },

      ],
    },
    {
      sueldo: 42000,
      especialidadId: "10",
      turnos: [
        { dia_semana: "Viernes", hora_inicio: "10:00", hora_fin: "15:00" },

      ],
    },
    {
      sueldo: 72000,
      especialidadId: "6",
      turnos: [
        { dia_semana: "Lunes", hora_inicio: "8:00", hora_fin: "15:00" },
        { dia_semana: "Martes", hora_inicio: "8:00", hora_fin: "12:00" },
        { dia_semana: "Viernes", hora_inicio: "8:00", hora_fin: "14:00" },

      ],
    },
    {
      sueldo: 72000,
      especialidadId: "8",
      turnos: [
        { dia_semana: "Lunes", hora_inicio: "8:00", hora_fin: "15:00" },
        { dia_semana: "Martes", hora_inicio: "8:00", hora_fin: "12:00" },
        { dia_semana: "Viernes", hora_inicio: "8:00", hora_fin: "14:00" },

      ],
    },
    {
      sueldo: 53000,
      especialidadId: "7",
      turnos: [
        { dia_semana: "Miércoles", hora_inicio: "8:00", hora_fin: "12:00" },
        { dia_semana: "Jueves", hora_inicio: "8:00", hora_fin: "16:00" },
      ],
    },
    {
      sueldo: 57000,
      especialidadId: "8",
      turnos: [
        { dia_semana: "Miércoles", hora_inicio: "12:00", hora_fin: "18:00" },
        { dia_semana: "Viernes", hora_inicio: "8:00", hora_fin: "12:00" },
      ],
    },
    {
      sueldo: 57000,
      especialidadId: "5",
      turnos: [
        { dia_semana: "Miércoles", hora_inicio: "12:00", hora_fin: "18:00" },
        { dia_semana: "Viernes", hora_inicio: "8:00", hora_fin: "12:00" },
      ],
    },
    {
      sueldo: 53000,
      especialidadId: "8",
      turnos: [
        { dia_semana: "Miércoles", hora_inicio: "12:00", hora_fin: "18:00" },
        { dia_semana: "Viernes", hora_inicio: "8:00", hora_fin: "12:00" },
      ],
    },
    {
      sueldo: 47000,
      especialidadId: "5",
      turnos: [
        { dia_semana: "Martes", hora_inicio: "8:00", hora_fin: "12:00" },
        { dia_semana: "Miércoles", hora_inicio: "8:00", hora_fin: "12:00" },
      ],
    },
    {
      sueldo: 48000,
      especialidadId: "9",
      turnos: [
        { dia_semana: "Jueves", hora_inicio: "8:00", hora_fin: "15:00" },
      ],
    },
    {
      sueldo: 48000,
      especialidadId: "7",
      turnos: [
        { dia_semana: "Jueves", hora_inicio: "8:00", hora_fin: "15:00" },
      ],
    },
    {
      sueldo: 51000,
      especialidadId: "10",
      turnos: [
        { dia_semana: "Martes", hora_inicio: "10:00", hora_fin: "15:00" },
      ],
    },
    {
      sueldo: 51000,
      especialidadId: "8",
      turnos: [
        { dia_semana: "Martes", hora_inicio: "10:00", hora_fin: "15:00" },
      ],
    },
  ],

  servicios: [
    {
      codigo_servicio: "1",
      nombre: "Cardiología",
      descripcion: 'Consulta especializada en cardiología para diagnóstico y tratamiento de enfermedades del corazón.',
      precio: 1500
    },

    {
      codigo_servicio: "2",
      nombre: "Pediatría",
      descripcion: "Atención médica para niños",
      precio: 1200
    },

    {
      codigo_servicio: "3",
      nombre: "Dermatología",
      descripcion: "Especialidad de la piel",
      precio: 1400
    },

    {
      codigo_servicio: '4',
      nombre: 'Consulta General',
      descripcion: 'Consulta médica general para evaluación de salud básica.',
      precio: 1500,
    },
    {
      codigo_servicio: '5',
      nombre: 'Neurología',
      descripcion: 'Consulta especializada para tratar problemas neurológicos como migrañas o trastornos del sistema nervioso.',
      precio: 3500,
    },
    {
      codigo_servicio: '6',
      nombre: 'Ginecología',
      descripcion: 'Consulta especializada en ginecología para el cuidado de la salud femenina.',
      precio: 3200,
    },
    {
      codigo_servicio: '7',
      nombre: 'Análisis de Sangre',
      descripcion: 'Examen médico para evaluar el estado general de salud a través de muestras de sangre.',
      precio: 2500,
    },
    {
      codigo_servicio: '8',
      nombre: 'Radiografía',
      descripcion: 'Examen médico de diagnóstico mediante radiografía para detectar problemas óseos o de tejidos internos.',
      precio: 3500,
    },
    {
      codigo_servicio: '9',
      nombre: 'Ecografía',
      descripcion: 'Examen médico de diagnóstico mediante ecografía para obtener imágenes de órganos internos.',
      precio: 4000,
    },
    {
      codigo_servicio: '10',
      nombre: 'Terapia Psicológica',
      descripcion: 'Tratamiento psicológico para trastornos emocionales y psicológicos.',
      precio: 3500,
    },
  ],
};
