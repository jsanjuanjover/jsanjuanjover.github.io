# Guía de edición de la web

Chuleta para añadir y cambiar contenido en `jsanjuanjover.com`. Para la parte
técnica (despliegue, dominio, Cloudflare), ver el `README.md`.

---

## 1. Cómo está organizada

```
mi-web/
├── _quarto.yml          ← configuración global: menú, pie, tema, dominio
├── index.qmd            ← portada  (/)
├── cv.qmd               ← CV       (/cv y /cv.pdf)
├── projects/
│   ├── index.qmd        ← listado de proyectos (/projects/). Se rellena solo
│   └── <slug>/index.qmd ← una página por proyecto
├── blog/
│   ├── index.qmd        ← listado del blog (/blog/). Se rellena solo
│   └── posts/<slug>/index.qmd ← un post por carpeta
├── assets/              ← imágenes globales (foto de perfil, favicon)
├── styles.scss          ← estilos del modo claro
├── styles-dark.scss     ← estilos del modo oscuro
└── _freeze/             ← resultados guardados del código Python. Se commitea
```

**Reglas básicas**

- Cada `.qmd` es una página. Su ruta en el repo es su URL:
  `projects/ed-alert/index.qmd` → `jsanjuanjover.com/projects/ed-alert/`.
- Un `.qmd` tiene **cabecera YAML** (entre `---`) con los metadatos y **cuerpo**
  en Markdown.
- El `<slug>` es el nombre de la carpeta y forma parte de la URL: en minúsculas,
  sin tildes ni espacios, con guiones (`wine-quality`, `mi-primer-modelo`).
- Los listados de proyectos, del blog y los "Latest posts" de la portada **no se
  editan a mano**: Quarto busca las páginas de su carpeta y las ordena por `date`.
- **No borres** `projects/index.qmd` ni `blog/index.qmd`: son los listados. Si
  pasa, `git restore projects/index.qmd` lo recupera.

---

## 2. Cabeceras: qué lleva cada tipo de página

### Proyecto (`projects/<slug>/index.qmd`)

```yaml
---
title: "Wine Quality Analysis"
description: >
  Una o dos frases: qué pregunta respondes y con qué. Es lo que se ve en el
  listado de proyectos y en la vista previa al compartir en LinkedIn.
date: 2026-11-05
categories: [Python, Linear Regression, Classification]
image: cover.png        # opcional: miniatura en el listado
---
```

| Campo | Obligatorio | Para qué sirve |
|---|---|---|
| `title` | Sí | Título de la página y del listado |
| `description` | Sí | Resumen en el listado y en la vista previa al compartir |
| `date` | Sí | Orden del listado (el más reciente, primero). Formato `AAAA-MM-DD` |
| `categories` | Recomendado | Etiquetas clicables para filtrar el listado |
| `image` | Opcional | Miniatura en el listado y en la vista previa al compartir |

### Post del blog (`blog/posts/<slug>/index.qmd`)

Igual que un proyecto:

```yaml
---
title: "Título del post"
description: >
  Una o dos frases. Se ve en el listado del blog, en la portada y al compartir.
date: 2026-11-05
categories: [Python, Machine learning]
image: cover.png        # opcional
draft: true             # opcional: no se publica mientras esté en true
---
```

`draft: true` sirve para ir escribiendo un post y subirlo al repo sin que
aparezca en la web. Quítalo (o ponlo en `false`) para publicarlo.

### Subpágina suelta (`<nombre>.qmd` en la raíz)

```yaml
---
title: "Talks"
subtitle: "Charlas y presentaciones"   # opcional
toc: false                             # opcional: quita el índice lateral
---
```

Solo `title` es obligatorio. No lleva `date` ni `categories`, porque no aparece
en ningún listado.

### Portada (`index.qmd`)

Es especial: usa la plantilla `about`, que muestra foto y enlaces.

```yaml
---
title: "Jordi Sanjuan Jover"
subtitle: "Data Scientist · ..."
page-layout: full
toc: false
about:
  template: trestles          # diseño: foto a la izquierda, texto a la derecha
  image: assets/profile.png   # foto de perfil
  image-width: 14em
  image-shape: rounded        # rounded | round (círculo) | rectangle
  links:                      # botones bajo la foto
    - icon: github
      text: GitHub
      href: https://github.com/jsanjuanjover
listing:                      # los "Latest posts" de la portada
  - id: recent-posts
    contents: blog/posts
    max-items: 3
    sort: "date desc"
    fields: [date, title, description]
---
```

Los iconos (`github`, `linkedin`, `envelope`…) son de
[Bootstrap Icons](https://icons.getbootstrap.com/): vale cualquier nombre de ahí.

---

## 3. Tareas habituales

### Cambiar la foto de perfil

1. Copia la foto a `assets/`, por ejemplo `assets/profile.png`. Mejor cuadrada
   y de unos 600×600 px: más grande pesa sin que se note la diferencia.
2. En `index.qmd`, cambia la línea `image:` de `about:`:
   ```yaml
     image: assets/profile.png
   ```
3. Si ya no la usas, borra la anterior (`assets/profile-placeholder.svg`).

### Imágenes dentro de una página

Pon la imagen **en la misma carpeta que su `index.qmd`** y enlázala con ruta
relativa:

```markdown
![Precio medio por barrio](mapa-precios.png)
```

El texto entre corchetes es el pie de foto y el texto alternativo
(accesibilidad). No lo dejes vacío.

### Crear un proyecto nuevo

```bash
mkdir projects/<slug>
code projects/<slug>/index.qmd
```

1. Pega la cabecera de proyecto (sección 2) y rellénala.
2. Opcional: botones de enlaces justo debajo de la cabecera:
   ```markdown
   ::: {.project-links}
   [Repository](https://github.com/...){.btn .btn-outline-primary .btn-sm}
   [Dataset](https://...){.btn .btn-outline-primary .btn-sm}
   :::
   ```
3. Escribe el cuerpo. Los proyectos actuales siguen esta estructura:
   `## The question` → enfoque y datos → resultados → qué aprendí.
4. Aparece solo en `/projects/`. Si quieres **destacarlo en la portada**, mira
   "Modificar la portada" más abajo.

### Crear un post nuevo

```bash
mkdir blog/posts/<slug>
code blog/posts/<slug>/index.qmd
```

1. Pega la cabecera de post (sección 2) y rellénala.
2. Escribe el cuerpo. Aparece solo en `/blog/` y en "Latest posts" de la portada.

**Si el post tiene código Python** (bloques ```` ```{python} ````):

- Se ejecuta en local al hacer `quarto preview` o `quarto render`, y el
  resultado se guarda en `_freeze/`.
- **Haz commit de `_freeze/` junto con el post.** En GitHub Actions no se ejecuta
  Python: si falta `_freeze/`, el post se publica sin gráficos ni resultados.
- También vale un notebook: pon `index.ipynb` en lugar de `index.qmd`, con la
  cabecera en una primera celda de tipo *raw*.

### Crear una subpágina y añadirla al menú

1. Crea el fichero en la raíz, por ejemplo `talks.qmd`, con la cabecera de
   subpágina (sección 2).
2. Para que salga en la barra de navegación, añádela en `_quarto.yml`, dentro de
   `website: navbar: left:`, en el orden en que quieras verla:
   ```yaml
       left:
         - href: index.qmd
           text: Home
         - href: projects/index.qmd
           text: Projects
         - href: talks.qmd        # ← nueva
           text: Talks
   ```
   Respeta la indentación: en YAML los espacios importan.

Si no la añades al menú, la página existe igualmente (`/talks`), pero solo se
llega a ella con un enlace.

### Modificar la portada (`index.qmd`)

- **Subtítulo** (`subtitle:`): la línea bajo tu nombre.
- **Botones bajo la foto** (`about: links:`): añadir, quitar o reordenar. Cada uno
  lleva `icon`, `text` y `href`.
- **Texto de presentación**: los párrafos después de la cabecera.
- **"Selected projects"**: se escribe **a mano**. Para destacar un proyecto,
  añade un párrafo con el mismo formato que los demás:
  ```markdown
  [**Wine Quality Analysis**](projects/wine-quality/index.qmd) —
  una o dos frases sobre el proyecto.
  ```
  Enlaza al `.qmd`, no a la URL: Quarto la convierte y avisa si el enlace se rompe.
- **"Latest posts"**: es automático. Para mostrar más o menos posts, cambia
  `max-items` en `listing:`.

---

## 4. Ciclo de trabajo

```bash
# 1. Previsualizar en local: abre el navegador y recarga al guardar
uv run quarto preview

# 2. Editar y revisar en el navegador hasta que esté bien
#    (Ctrl+C en la terminal para parar el preview)

# 3. Revisar qué ha cambiado
git status
git diff

# 4. Commit: solo los ficheros de ese cambio
git add projects/wine-quality/          # + _freeze/ si hay código
git commit -m "feat: add wine quality project"

# 5. Publicar
git push
```

En 1–2 minutos está en `jsanjuanjover.com`. El progreso se ve en la pestaña
**Actions** de GitHub.

**Mensajes de commit** (`tipo: descripción`):

| Tipo | Cuándo |
|---|---|
| `feat:` | Contenido nuevo: proyecto, post, subpágina |
| `fix:` | Corregir algo roto: enlace, errata, imagen que no carga |
| `docs:` | README o esta guía |
| `chore:` | Configuración: `_quarto.yml`, workflow, dependencias |

Un commit por cambio: no mezcles un post nuevo con un cambio de estilos.

---

## 5. Si algo sale mal

| Problema | Solución |
|---|---|
| He borrado o estropeado un fichero que ya estaba en un commit | `git restore <fichero>` (descarta los cambios desde el último commit) |
| `quarto preview` da error | Lee el mensaje: suele indicar fichero y línea. Casi siempre es la indentación del YAML o un `---` que falta |
| Un post se publica sin gráficos | Falta `_freeze/` en el commit. Ejecuta `uv run quarto render`, haz `git add _freeze/` y vuelve a hacer commit |
| La action de GitHub sale en rojo | La web publicada no cambia: sigue la versión anterior. Abre el paso en rojo en **Actions** y lee el error |
| Un proyecto no aparece en el listado | Revisa que esté en `projects/<slug>/index.qmd` y que la cabecera tenga `title` y `date` |
