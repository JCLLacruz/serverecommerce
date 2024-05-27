
# Desarrollo backend Red Social

![NB](https://github.com/JCLLacruz/NeverBoringNetwork/assets/161235632/31c0f7fb-c616-4498-bc8c-cb01b3f8f5ea)


Este proyecto consta del back-end de una red Social.

En esta tendremos que crearnos nuestro usuario y una vez logueados podremos acceder a las etiquetas que nos interesen y acceder a las publicaciones con esa etiqueta.
Dentro de las publicaciones podremos reaccionar con un me gusta, seguir al usuario que la ha publicado, comentar y darle un me gusta al comentario.

Si en algún momento queremos podremos, modificar o eliminar una de nuestras publicaciones o comentarios, dejar de seguir a un usuario o quitar un me gusta.

## Tecnologías utilizadas

- JavaScript
- Node.js
- express
- bcryptjs
- jsonwebtoken
- Mongoose 
- Multer
- Dotenv
- Nodemailer
- Swagger
- Jest
- Node-Cron

```bash
  npm init -y
  npm i express mongoose
  npm i bcryptjs
  npm i jsonwebtoken
  npm i nodemailer
```


## Instalación

En el archivo Example.env borrar el example y sustituir lo siguiente:

```bash
PORT = Introducir un Puerto disponible
MONGO_URI = 'URL de tu base de datos'
MONGO_URI_TEST = 'URL de tu base de datos'
JWT_SECRET = 'Introduce Secreto'
USER = 'Correo electrónico nodemailer'
PASS = 'Contraseña nodemailer'
```

## Documentación

Este proyecto consta de:

- Usuarios 

Hemos implementado el registro del usuario con validación por Correo electrónico, Recuperar contraseña, Login, Logout, seguir a otros usuarios y ver los usuarios que estan conectados.

Los usuarios tienen un token de autentificación y la contraseña de acceso esta encriptada para una mayor seguridad.

- Publicaciones

Hemos creado un CRUD para crear, actualizar nuestras Publicaciones, eliminarlas, buscar publicaciones por titulo, ver todas las disponibles, o por id.
Ademas hemos añadido para darle me gusta a las publicaciones del resto de usuarios.

- Comentarios

Hemos creado un CRUD para crear, actualizar, ver y eliminar nuestros comentarios en las publicaciones.
a su vez le hemos implementado los me gusta.

- Etiquetas

Las etiquetas serían como los intereses de los usuarios, por lo que a tráves de ver estas podemos acceder a las publicaciones que nos interesan.








## Documentación API

https://documenter.getpostman.com/view/34523030/2sA3JRaepN

https://neverboringnetwork.onrender.com/api-docs/



## Autores


- [GitHub Juanjo](https://www.github.com/JuanjoSalas) || [LinkedIn Juanjo](https://www.linkedin.com/in/juanjo-salas-jiménez)

- [GitHub Juan Carlos](https://github.com/JCLLacruz) || [LinkedIn Juan Carlos](https://www.linkedin.com/in/juan-carlos-lacruz-lacruz/)
