# API Reference & DTOs

## Endpoints

### Authenticate
- `POST /api/Authenticate/login`: User login.
- `POST /api/Authenticate/register`: User registration.

### Cliente
- `POST /api/Cliente/Listado`: List clients (requires token).
- `POST /api/Cliente/Crear`: Create client (requires token).
- `POST /api/Cliente/Actualizar`: Update client (requires token).
- `GET /api/Cliente/Obtener/{IdCliente}`: Get client details.
- `DELETE /api/Cliente/Eliminar/{IdCliente}`: Delete client.

### Intereses
- `GET /api/Intereses/Listado`: Get list of interests.

---

## Schemas (DTOs)

### ClienteCrear / ClienteActualizar
```json
{
  "id": "string ($uuid)", // Only for Actualizar
  "nombre": "string",
  "apellidos": "string",
  "identificacion": "string",
  "celular": "string",
  "otroTelefono": "string",
  "direccion": "string",
  "fNacimiento": "string ($date-time)",
  "fAfiliacion": "string ($date-time)",
  "sexo": "string",
  "resennaPersonal": "string",
  "imagen": "string (base64)",
  "interesFK": "string ($uuid)",
  "usuarioId": "string"
}
```

### DetalleCliente_DTO (Response)
```json
{
  "id": "string ($uuid)",
  "nombre": "string",
  "apellidos": "string",
  "identificacion": "string",
  "telefonoCelular": "string",
  "otroTelefono": "string",
  "direccion": "string",
  "fNacimiento": "string ($date-time)",
  "fAfiliacion": "string ($date-time)",
  "sexo": "string",
  "resenaPersonal": "string",
  "imagen": "string",
  "interesesId": "string ($uuid)"
}
```

### Others
- **LoginModel**: `username`, `password`.
- **RegisterModel**: `username`, `email`, `password`.
- **Interes_DTO**: `id`, `descripcion`.
- **ListarCliente**: `identificacion`, `nombre`, `usuarioId`.
