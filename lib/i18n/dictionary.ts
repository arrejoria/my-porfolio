export type Locale = 'es' | 'en'

export const dictionary = {
  es: {
    nav: {
      home: 'Inicio',
      portfolio: 'Proyectos',
      blog: 'Blog',
      contact: 'Contacto',
      admin: 'Panel',
    },
    hero: {
      role: 'Desarrollador Frontend',
      subtitle:
        'Desarrollador web con experiencia creando sitios para clientes de todo el mundo, especializado en JavaScript, React, WordPress y PHP.',
      discover: 'Ver proyectos',
      contact: 'Hablemos',
    },
    about: {
      title: 'Sobre mí',
      body: 'Soy desarrollador front-end con más de 7 años de experiencia construyendo sitios web para personas de todo el mundo, usando las últimas tecnologías. Mi objetivo es crear productos de alta calidad, fáciles de usar y con código limpio, simple de leer y reutilizar.',
      cardName: 'Lucas Arrejoria',
      cardRole: 'Desarrollador Frontend',
      cardLocation: 'Buenos Aires, Argentina',
      experienceTitle: 'Experiencia',
    },
    skills: {
      title: 'Lo que sé',
      body: 'A lo largo de mi carrera como desarrollador web he adquirido un conocimiento sólido en diversas tecnologías y herramientas. Me comprometo con la excelencia y busco mejorar constantemente para ofrecer soluciones de alta calidad. Estas son algunas de las tecnologías en las que me especializo.',
      columns: {
        skills: 'Habilidades',
        frameworks: 'Frameworks',
        learning: 'Aprendiendo',
      },
    },
    portfolio: {
      title: 'Proyectos',
      subtitle:
        'Una selección de trabajos en los que combiné diseño, código limpio y buenas prácticas.',
      visit: 'Visitar',
      code: 'Código',
      viewAll: 'Ver todos los proyectos',
    },
    blog: {
      title: 'Blog',
      subtitle:
        'Notas sobre desarrollo web, aprendizajes y experimentos con nuevas tecnologías.',
      readMore: 'Leer más',
      empty: 'Todavía no hay publicaciones. Vuelve pronto.',
      back: 'Volver al blog',
      publishedOn: 'Publicado el',
      minRead: 'min de lectura',
      viewAll: 'Ver todo el blog',
    },
    contact: {
      title: 'Hablemos',
      subtitle:
        '¿Tienes un proyecto en mente o quieres colaborar? Escríbeme y te responderé pronto.',
      name: 'Nombre',
      email: 'Correo',
      message: 'Mensaje',
      send: 'Enviar mensaje',
      sending: 'Enviando...',
      success: '¡Gracias! Tu mensaje fue enviado.',
      error: 'Algo salió mal. Intenta de nuevo.',
      or: 'O encuéntrame en',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      builtWith: 'Diseñado y desarrollado por Lucas Arrejoria.',
    },
    admin: {
      title: 'Panel de administración',
      subtitle: 'Gestiona las publicaciones del blog.',
      newPost: 'Nueva publicación',
      signOut: 'Cerrar sesión',
      edit: 'Editar',
      delete: 'Eliminar',
      noPosts: 'Aún no creaste publicaciones.',
      form: {
        title: 'Título',
        slug: 'Slug (URL)',
        excerpt: 'Resumen',
        content: 'Contenido (Markdown)',
        coverImage: 'URL de imagen de portada',
        published: 'Publicado',
        save: 'Guardar',
        saving: 'Guardando...',
        cancel: 'Cancelar',
      },
    },
  },
  en: {
    nav: {
      home: 'Home',
      portfolio: 'Projects',
      blog: 'Blog',
      contact: 'Contact',
      admin: 'Admin',
    },
    hero: {
      role: 'Frontend Developer',
      subtitle:
        'Web developer with experience building sites for clients around the world, specialized in JavaScript, React, WordPress and PHP.',
      discover: 'View projects',
      contact: "Let's talk",
    },
    about: {
      title: 'About me',
      body: "I'm a front-end developer with over 7 years of experience building websites for people all over the world, using the latest technologies. My goal is to craft high-quality products that are user-friendly, with clean code that is simple to read and reuse.",
      cardName: 'Lucas Arrejoria',
      cardRole: 'Frontend Developer',
      cardLocation: 'Buenos Aires, Argentina',
      experienceTitle: 'Experience',
    },
    skills: {
      title: 'What I know',
      body: 'Throughout my career as a web developer I have gained strong knowledge across various technologies and tools. I am committed to excellence and always strive to improve to deliver high-quality solutions. These are some of the technologies I specialize in.',
      columns: {
        skills: 'Skills',
        frameworks: 'Frameworks',
        learning: 'Learning',
      },
    },
    portfolio: {
      title: 'Projects',
      subtitle:
        'A selection of work where I combined design, clean code and best practices.',
      visit: 'Visit',
      code: 'Code',
      viewAll: 'View all projects',
    },
    blog: {
      title: 'Blog',
      subtitle:
        'Notes on web development, learnings and experiments with new technologies.',
      readMore: 'Read more',
      empty: 'No posts yet. Check back soon.',
      back: 'Back to blog',
      publishedOn: 'Published on',
      minRead: 'min read',
      viewAll: 'View all posts',
    },
    contact: {
      title: "Let's talk",
      subtitle:
        'Have a project in mind or want to collaborate? Send me a message and I will get back to you soon.',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send message',
      sending: 'Sending...',
      success: 'Thanks! Your message was sent.',
      error: 'Something went wrong. Please try again.',
      or: 'Or find me on',
    },
    footer: {
      rights: 'All rights reserved.',
      builtWith: 'Designed and developed by Lucas Arrejoria.',
    },
    admin: {
      title: 'Admin panel',
      subtitle: 'Manage your blog posts.',
      newPost: 'New post',
      signOut: 'Sign out',
      edit: 'Edit',
      delete: 'Delete',
      noPosts: "You haven't created any posts yet.",
      form: {
        title: 'Title',
        slug: 'Slug (URL)',
        excerpt: 'Excerpt',
        content: 'Content (Markdown)',
        coverImage: 'Cover image URL',
        published: 'Published',
        save: 'Save',
        saving: 'Saving...',
        cancel: 'Cancel',
      },
    },
  },
} as const

type Widen<T> = { readonly [K in keyof T]: T[K] extends string ? string : Widen<T[K]> }

export type Dictionary = Widen<(typeof dictionary)['es']>
