/**
 * Données personnelles et liens — un seul endroit à modifier.
 * Le texte traduisible vit dans src/i18n.
 */
export const profile = {
  name: 'Mirado Rakotoniaina',
  firstName: 'Mirado',
  lastName: 'Rakotoniaina',
  email: 'miradorakoto111@gmail.com',
  github: 'https://github.com/M1rad0-rkt',
  linkedin: 'https://www.linkedin.com/in/mirado-rakotoniaina-978523346',
  /**
   * CV à télécharger (placé dans /public/cv). Le CV actuel est une image JPG ;
   * pour un PDF, déposez-le dans public/cv/ puis changez ces deux valeurs.
   */
  cv: { href: '/cv/Mirado_Rakotoniaina_CV.jpg', filename: 'Mirado_Rakotoniaina_CV.jpg' },
  siteUrl: 'https://rakotoniaina-mirado.vercel.app',
} as const;
