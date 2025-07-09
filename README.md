# 📘 Aplicación de Historias de Usuario

Aplicación web desarrollada en **Angular** (frontend) y **Django REST Framework** (backend) para gestionar historias de usuario.

---

## 🧱 Tecnologías

- Angular (standalone)
- Django + Django REST Framework
- Tailwind CSS

---

## 📁 Estructura del Proyecto (Frontend)

```
src/
└── app/
    ├── components/listcards/
    ├── pages/hulist/
    ├── services/historiasusuario.ts
    ├── app.routes.ts
    ├── app.ts / app.html
```

---

## 🌐 API Django Esperada

- Base URL: `http://localhost:8000/api/userstories/`

| Método | Endpoint                  | Descripción               |
|--------|---------------------------|---------------------------|
| GET    | `/api/userstories/`       | Listar todas las HUs      |
| POST   | `/api/userstories/`       | Crear nueva HU            |
| PUT    | `/api/userstories/<id>/`  | Actualizar HU existente   |

---

## ⚙️ Funcionalidades

- ✅ Crear historia de usuario
- ✅ Visualizar todas las historias
- ✅ Editar historias

---

## 🚀 Cómo ejecutar

### Backend (Django)

```bash
python manage.py runserver
```

### Frontend (Angular)

```bash
npm install
ng serve
```

---

## 🧪 Pruebas básicas

| Acción           | Resultado Esperado                 |
|------------------|------------------------------------|
| Crear historia   | Formulario se despliega            |
| Guardar historia | HU se envía a API y se visualiza   |
| Editar historia  | Formulario se precarga             |

---

## 📌 Mejoras futuras

- [ ] Eliminar historia de usuario
- [ ] Filtros por estado (To Do, In Progress, Done)
- [ ] Modales en lugar de formulario inline
- [ ] Autenticación con JWT

---

## ✍️ Autor

**Jose Lubo**