/**
 * Dictionnaire FRANÇAIS — source de vérité de la structure.
 * Le dictionnaire anglais (en.ts) est typé sur celui-ci : toute clé
 * manquante provoque une erreur de compilation.
 */
export const fr = {
  meta: {
    title: 'Mirado Rakotoniaina — Étudiant Data & IA / Développeur',
    description:
      'Portfolio de Mirado Rakotoniaina, étudiant en Master 1 Data & Intelligence Artificielle à l’EMIT Fianarantsoa (Madagascar). Machine learning, NLP, RAG et développement full-stack.',
  },
  a11y: {
    skip: 'Aller au contenu',
    mainNav: 'Navigation principale',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    language: 'Langue',
    switchToDark: 'Passer au thème sombre',
    switchToLight: 'Passer au thème clair',
    externalLink: '(ouvre un nouvel onglet)',
    backToTop: 'Retour en haut',
    closeDialog: 'Fermer la fiche projet',
    adminLogin: 'Connexion administrateur',
    adminEdit: 'Activer ou désactiver le mode édition',
    prevProject: 'Projet précédent',
    nextProject: 'Projet suivant',
  },
  gate: {
    kicker: 'Bienvenue',
    title: 'Prêt à entrer ?',
    intro: 'Faites glisser le curseur vers la droite pour ouvrir le portfolio.',
    slide: 'Glisser pour entrer',
    slideAria: 'Faire glisser vers la droite, ou appuyer sur Entrée, pour ouvrir le portfolio',
    skip: 'Entrer directement',
  },
  nav: {
    home: 'Accueil',
    about: 'À propos',
    journey: 'Parcours',
    skills: 'Compétences',
    projects: 'Projets',
    contact: 'Contact',
  },
  hero: {
    issue: 'Portfolio — Édition 2026',
    role: 'Étudiant Data & IA / Développeur',
    titleA: 'Transformer les données en intelligence.',
    titleB: 'Donner vie aux idées.',
    intro:
      'Étudiant en Master 1 Data & Intelligence Artificielle, je conçois des modèles, des assistants à base de RAG et des applications web full-stack qui transforment des idées en solutions concrètes.',
    location: 'Fianarantsoa, Madagascar',
    status: 'Ouvert aux stages & collaborations',
    ctaProjects: 'Découvrir mes projets',
    ctaCv: 'Télécharger mon CV',
    scroll: 'Défiler',
    badge: 'Data · IA · Web · ',
  },
  about: {
    kicker: 'À propos',
    title: 'Un profil à la croisée de la donnée et du code.',
    p1: 'Étudiant en Master 1 Data & Intelligence Artificielle à l’EMIT Fianarantsoa, je m’appuie sur une formation en informatique et sur une base en économétrie et en statistiques appliquées.',
    p2: 'Machine learning, deep learning, NLP, assistants RAG : j’aime comprendre un problème en profondeur avant de coder, puis le mener jusqu’à une application utilisable — de la préparation des données à l’interface web.',
    p3: 'Mon objectif : concevoir des solutions utiles et innovantes, et devenir Data Scientist.',
    quote: 'Comprendre d’abord, construire ensuite.',
    factsTitle: 'En bref',
    facts: [
      { label: 'Formation', value: 'Master Informatique — Data & IA (M1)' },
      { label: 'École', value: 'EMIT Fianarantsoa' },
      { label: 'Base', value: 'Licence en Informatique · économétrie & statistiques appliquées' },
      { label: 'Recherche', value: 'Stage · poste de Data Scientist' },
    ],
    outside: 'En dehors du code',
    interests: ['Guitare', 'Basket-ball', 'Chant', 'Musculation'],
  },
  journey: {
    kicker: 'Parcours',
    title: 'Formations & expériences.',
    subtitle: 'Du stage d’observation aux projets concrets en Data & IA.',
    filterLabel: 'Filtrer le parcours',
    filters: { all: 'Tout', work: 'Expériences', training: 'Formations' },
    ongoing: 'En cours',
    items: {
      armp: {
        period: 'En cours',
        title: 'Stage projet',
        org: 'ARMP — Autorité de Régulation des Marchés Publics',
        desc: 'Mise en place d’un assistant de réglementation (RAG, LLM) et d’un chatbot d’aide à l’utilisation des plateformes e-GP et SIGMP. L’ARMP est sous tutelle du Ministère de l’Économie et des Finances.',
      },
      devops: {
        period: '2026',
        title: 'Formation DevOps',
        org: 'Orange Digital Center',
        desc: 'Formation en DevOps et déploiement automatique des applications.',
      },
      ideathon: {
        period: '2026',
        title: 'Ideathon / Data Challenge inter-universitaire',
        org: 'Orange Digital Center & Ingedata',
        desc: 'Participation à un data challenge axé sur l’analyse de données et l’intelligence artificielle appliquée au marketing.',
      },
      master: {
        period: '2025 — en cours',
        title: 'Master en Informatique, parcours Data & IA',
        org: 'EMIT Fianarantsoa',
        desc: 'École de Management et d’Innovation Technologique — M1 en cours.',
      },
      pixelvault: {
        period: '2024 — 2025',
        title: 'Stage de fin d’études',
        org: 'PixelVault',
        desc: 'Conception de Clientelia : un système de traitement des demandes clients avec analyse de satisfaction (React, Django, Tailwind, MySQL).',
      },
      licence: {
        period: '2022 — 2025',
        title: 'Licence en Informatique',
        org: 'Université FJKM Ravelojaona Ampandrana',
        desc: 'Licence en informatique générale.',
      },
      ministere: {
        period: '2022 — 2023',
        title: 'Stage d’immersion professionnelle',
        org: 'Ministère de la Jeunesse et du Sport',
        desc: 'Premier stage d’immersion dans le monde professionnel.',
      },
      mairie: {
        period: '2021 — 2022',
        title: 'Stage d’observation',
        org: 'Hôtel de Ville d’Analakely',
        desc: 'Département informatique (DDNSI).',
      },
      bac: {
        period: '2021 — 2022',
        title: 'Baccalauréat série D',
        org: 'Lycée Saint François Xavier Antanimena',
        desc: '',
      },
    },
  },
  skills: {
    kicker: 'Compétences',
    title: 'Les outils que j’utilise.',
    subtitle: 'Regroupés par domaine, sans barres de progression artificielles : ce que je pratique dans mes projets.',
    categories: {
      data: 'Data Science & Analytics',
      ai: 'Intelligence Artificielle',
      web: 'Développement Web',
      tools: 'Bases de données & Outils',
    },
    caption: 'Technologies utilisées dans mes projets et stages',
  },
  projects: {
    kicker: 'Projets',
    title: 'Études de cas.',
    subtitle: 'Six projets mis en avant, présentés comme de vraies études de cas.',
    open: 'Voir l’étude de cas',
    problem: 'Problématique',
    solution: 'Solution développée',
    features: 'Fonctionnalités principales',
    stack: 'Technologies',
    code: 'Code source',
    demo: 'Démo',
    role: 'Rôle',
    year: 'Période',
    status: { ongoing: 'En cours', done: 'Réalisé' },
    noScreenshot: 'Pas de capture publique pour l’instant',
    galleryTitle: 'Autres réalisations',
    gallerySubtitle: 'Applications web, logiciel de bureau, jeu et premiers essais.',
    items: {
      armp: {
        tagline: 'Un assistant qui rend la réglementation des marchés publics accessible.',
        role: 'Data / IA — stage projet',
        year: 'En cours',
        problem:
          'Les textes qui encadrent les marchés publics sont nombreux et difficiles à parcourir ; les usagers ont aussi besoin d’aide pour utiliser les plateformes e-GP et SIGMP.',
        solution:
          'Un assistant basé sur le RAG et un LLM, appuyé par un traitement NLP des documents, qui répond à partir des textes de réglementation et de la documentation e-GP et SIGMP.',
        features: [
          'Recherche documentaire intelligente dans les textes réglementaires',
          'Réponses contextualisées à partir de la documentation e-GP et SIGMP',
          'Traitement NLP des documents sources',
        ],
      },
      clientelia: {
        tagline: 'Gérer les demandes clients et mesurer leur satisfaction.',
        role: 'Full-stack — stage de fin d’études',
        year: '2024 — 2025',
        problem:
          'Centraliser les demandes des clients, suivre leur traitement et savoir si les clients sont satisfaits.',
        solution:
          'Une plateforme web avec une interface React et une API Django REST Framework sur MySQL, dont l’accès est sécurisé par une authentification JWT.',
        features: [
          'Gestion et suivi des demandes clients',
          'Analyse de satisfaction intégrée',
          'Authentification sécurisée par JWT',
        ],
      },
      rice: {
        tagline: 'Détecter les maladies du riz à partir d’images de feuilles.',
        role: 'Computer vision — projet d’équipe',
        year: '2024',
        problem:
          'Reconnaître automatiquement les maladies du riz à partir d’images, une application concrète du deep learning à l’agriculture.',
        solution:
          'Un modèle de vision par ordinateur entraîné avec PyTorch, testable facilement grâce à une interface Gradio.',
        features: [
          'Classification des maladies du riz par vision artificielle',
          'Modèle de deep learning entraîné avec PyTorch',
          'Interface Gradio pour tester le modèle',
        ],
      },
      air: {
        tagline: 'Analyser et présenter la qualité de l’air à Fianarantsoa.',
        role: 'Data science',
        year: '2024',
        problem:
          'Rendre lisibles les données de qualité de l’air de Fianarantsoa pour les décideurs ou le grand public.',
        solution:
          'Un pipeline Python (Pandas, NumPy, Matplotlib) pour l’analyse exploratoire, et une interface Streamlit pour présenter les indicateurs de façon interactive.',
        features: [
          'Analyse exploratoire des données',
          'Visualisations des indicateurs',
          'Interface Streamlit interactive',
        ],
      },
      ecommerce: {
        tagline: 'Un comptoir de vente qui peut accueillir plusieurs types de marché.',
        role: 'Full-stack',
        year: '2025',
        problem:
          'Disposer d’une boutique en ligne polyvalente, capable de s’adapter à différents types de marchés.',
        solution:
          'Une application React (Tailwind, Vite) adossée à une API FastAPI et à PostgreSQL, avec une authentification JWT.',
        features: ['Catalogue de produits', 'Parcours d’achat', 'Authentification JWT'],
      },
      rezerveo: {
        tagline: 'Réserver des lieux pour tout type d’événement.',
        role: 'Développement web back-end',
        year: '2023',
        problem: 'Faciliter la réservation de salles et de lieux d’événements.',
        solution:
          'Une application web en PHP, MySQL et Bootstrap, orientée vers la simplicité et l’efficacité.',
        features: [
          'Gestion des disponibilités',
          'Gestion des réservations',
          'Affichage des espaces',
        ],
      },
    },
    gallery: {
      chatbot: {
        title: 'Chatbot IA — ARMP',
        desc: 'Un chatbot pour aider à utiliser les sites de l’ARMP et à effectuer les démarches d’inscription (Python, TensorFlow, NLP).',
        meta: 'En cours',
      },
      gymgest: {
        title: 'GymGest',
        desc: 'Logiciel de bureau pour le suivi d’une salle de sport : adhérents et activités, packagé avec Inno Setup pour Windows.',
        meta: '2023',
      },
      aktifitifitra: {
        title: 'Aktifitifitra',
        desc: 'Jeu 2D rétro entièrement développé en Python, avec persistance SQLite.',
        meta: '2023',
      },
      portfolio: {
        title: 'Premier portfolio',
        desc: 'Ma première version de portfolio en React, Tailwind et Vite — le point de départ de celle-ci.',
        meta: '2024',
      },
    },
  },
  services: {
    kicker: 'Ce que je fais',
    title: 'Cinq terrains de jeu.',
    items: {
      analysis: {
        title: 'Data Analysis',
        desc: 'Explorer, nettoyer et visualiser les données pour en faire ressortir des décisions.',
      },
      ml: {
        title: 'Machine Learning',
        desc: 'Concevoir et évaluer des modèles de machine learning et de deep learning.',
      },
      aiapps: {
        title: 'AI Application Development',
        desc: 'Intégrer l’IA dans de vraies applications, du modèle jusqu’à l’interface.',
      },
      rag: {
        title: 'RAG & Intelligent Assistants',
        desc: 'Construire des assistants qui répondent à partir de documents de référence.',
      },
      fullstack: {
        title: 'Full-Stack Web Development',
        desc: 'Développer des applications web complètes avec React, Django et FastAPI.',
      },
    },
  },
  contact: {
    kicker: 'Contact',
    title: 'Une idée ? Construisons quelque chose d’utile.',
    subtitle: 'Ouvert aux stages, aux collaborations et aux projets en Data & IA.',
    email: 'E-mail',
    phone: 'Téléphone',
    location: 'Localisation',
    locationValue: 'Madagascar',
    copy: 'Copier',
    copied: 'Copié',
    copyLabel: 'Copier l’adresse e-mail',
    channelsLabel: 'Mode de contact',
    channelMessage: 'Message',
    channelGoogle: 'Formulaire Google',
    channelWhatsapp: 'WhatsApp',
    formTitle: 'Envoyer un message',
    formNoteMailto:
      'Le formulaire ouvre votre application e-mail avec le message prérempli ; vous validez l’envoi depuis votre boîte.',
    formNoteDirect: 'Votre message est envoyé directement.',
    name: 'Nom',
    emailField: 'E-mail',
    subject: 'Sujet',
    message: 'Message',
    send: 'Envoyer le message',
    sending: 'Envoi…',
    openMail: 'Ouvrir mon application e-mail',
    sentDirect: 'Merci ! Votre message a bien été envoyé.',
    sentMailto: 'Application e-mail ouverte : cliquez sur Envoyer pour finaliser.',
    error:
      'Impossible d’envoyer le message. Écrivez-moi directement à l’adresse ci-contre.',
    defaultSubject: 'Contact depuis le portfolio',
    required: 'Ce champ est obligatoire.',
    invalidEmail: 'Adresse e-mail invalide.',
    googleTitle: 'Formulaire Google',
    googleNote: 'Remplissez le formulaire ci-dessous ; vos réponses sont enregistrées dans Google Forms.',
    googleOpen: 'Ouvrir le formulaire',
    whatsappTitle: 'Contacter sur WhatsApp',
    whatsappNote: 'Discutez directement avec Mirado sur WhatsApp.',
    whatsappCta: 'WhatsApp',
    whatsappPrefill: 'Bonjour Mirado, je vous contacte via votre portfolio.',
  },
  footer: {
    built: 'Conçu et développé par Mirado Rakotoniaina',
    rights: 'Tous droits réservés',
  },
} as const;
