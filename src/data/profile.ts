/**
 * Données personnelles et liens — un seul endroit à modifier.
 * Le texte traduisible vit dans src/i18n.
 */
export const profile = {
  name: 'Mirado Rakotoniaina',
  firstName: 'Mirado',
  lastName: 'Rakotoniaina',
  email: 'miradorakoto111@gmail.com',
  phone: '+261 34 57 344 84',
  /** Numéro WhatsApp au format international sans + ni espaces (ex. 261345734484). */
  whatsapp: '261345734484',
  github: 'https://github.com/M1rad0-rkt',
  linkedin: 'https://www.linkedin.com/in/mirado-rakotoniaina-978523346',
  /**
   * CV à télécharger (placé dans /public/cv). Le CV actuel est une image JPG ;
   * pour un PDF, déposez-le dans public/cv/ puis changez ces deux valeurs.
   */
  cv: { href: '/cv/Mirado_Rakotoniaina_CV.jpg', filename: 'Mirado_Rakotoniaina_CV.jpg' },
  /**
   * Formulaire : si VITE_FORM_ENDPOINT (ex. https://formspree.io/f/xxxx) est défini
   * à la build, le message est envoyé directement ; sinon le formulaire ouvre le
   * client e-mail (mailto:).
   */
  formEndpoint: (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) ?? '',
  /**
   * Lien du formulaire Google (partage → « Copier le lien » ou lien d’intégration).
   * Surcharge possible via VITE_GOOGLE_FORM_URL.
   * Laissez vide pour masquer l’onglet Google Form.
   */
  googleFormUrl:
    (import.meta.env.VITE_GOOGLE_FORM_URL as string | undefined) ??
    '',
  siteUrl: 'https://rakotoniaina-mirado.vercel.app',
} as const;

/** Lien wa.me prêt à l’emploi, avec message prérempli optionnel. */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${profile.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
