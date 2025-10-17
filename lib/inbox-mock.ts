// Mock inbox emails for development/demonstration
export interface InboxEmail {
  id: string
  from: string
  to: string
  subject: string
  body: string
  receivedAt: string
  isRead: boolean
  isImportant: boolean
  labels: string[]
  attachments?: Array<{
    name: string
    size: number
    type: string
  }>
}

const sampleEmails: InboxEmail[] = [
  {
    id: '1',
    from: 'contact@encg-dakhla.ma',
    to: 'newsletter@bde-dakhla.com',
    subject: 'Demande de partenariat - Événement cultural',
    body: `Bonjour,

J'espère que ce message vous trouve en bonne santé.

Je vous écris au nom de l'École Nationale de Commerce et de Gestion de Dakhla pour explorer une opportunité de partenariat pour notre prochain événement culturel qui aura lieu le 15 novembre.

Nous serions ravis de discuter des modalités de collaboration et des avantages mutuels que cette association pourrait apporter.

Cordialement,
Dr. Sarah Bennani
Directrice des Relations Externes
ENCG Dakhla`,
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isImportant: true,
    labels: ['partenariat', 'événement'],
  },
  {
    id: '2',
    from: 'president@aeb-maroc.ma',
    to: 'newsletter@bde-dakhla.com',
    subject: 'Invitation - Conférence Entrepreneurship 2025',
    body: `Chers étudiants,

L'Association des Étudiants en Business vous invite à participer à notre conférence annuelle sur l'entrepreneurship qui se déroulera les 20-21 janvier 2025 à Casablanca.

Cette année, nous accueillons des intervenants de renommée internationale :
- M. Ahmed Boutaleb, CEO de TechVentures
- Mme. Fatima El Mansouri, Fondatrice de GreenStart
- Dr. Youssef Alami, Expert en Innovation Digitale

Inscription gratuite mais limitée à 200 places.

Merci de confirmer votre présence avant le 15 décembre.

Cordialement,
Omar Kettani
Président AEB Maroc`,
    receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isImportant: false,
    labels: ['événement', 'conférence'],
  },
  {
    id: '3',
    from: 'marie.dubois@student.univ-lyon.fr',
    to: 'newsletter@bde-dakhla.com',
    subject: "Échange universitaire - Demande d'information",
    body: `Bonjour,

Je suis étudiante en Master Management à l'Université de Lyon et je souhaiterais obtenir des informations sur les possibilités d'échange universitaire avec votre établissement.

Pourriez-vous me renseigner sur :
- Les programmes d'échange disponibles
- Les conditions d'admission  
- Les démarches à effectuer
- Les dates limites d'inscription

Je vous remercie par avance pour votre réponse.

Cordialement,
Marie Dubois
Master 1 Management International
Université de Lyon`,
    receivedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isImportant: false,
    labels: ['échange', 'international'],
  },
  {
    id: '4',
    from: 'support@mailchimp.com',
    to: 'newsletter@bde-dakhla.com',
    subject: 'Notification de désabonnement - newsletter@bde-dakhla.com',
    body: `Bonjour,

Nous vous informons qu'un utilisateur s'est désabonné de votre liste de diffusion.

Détails :
- Email : user123@gmail.com
- Date : ${new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()}
- Raison : "Plus intéressé par le contenu"

Cordialement,
L'équipe Mailchimp`,
    receivedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isImportant: false,
    labels: ['notification', 'désabonnement'],
  },
  {
    id: '5',
    from: 'admin@bde-dakhla.com',
    to: 'newsletter@bde-dakhla.com',
    subject: 'Rapport mensuel - Statistiques newsletter octobre',
    body: `Rapport automatique - Newsletter BDE Dakhla

📊 STATISTIQUES DU MOIS D'OCTOBRE 2025

Abonnés :
- Nouveaux abonnés : 127
- Total abonnés actifs : 1,240
- Taux de désabonnement : 1.2%

Campagnes envoyées : 4
- Taux d'ouverture moyen : 32%
- Taux de clic moyen : 5.8%
- Meilleure campagne : "Semaine d'accueil 2025" (45% d'ouverture)

Engagement :
- Emails les plus populaires : Événements étudiants
- Horaire optimal : Mardi 14h-16h

Ce rapport est généré automatiquement le 1er de chaque mois.`,
    receivedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isImportant: true,
    labels: ['rapport', 'statistiques'],
    attachments: [
      {
        name: 'rapport-octobre-2025.pdf',
        size: 245760,
        type: 'application/pdf',
      },
    ],
  },
]

export function getMockInboxEmails(): InboxEmail[] {
  return sampleEmails.map((email) => ({
    ...email,
    // Add some randomness to received times for more realistic data
    receivedAt: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  }))
}

export function markEmailAsRead(emailId: string): boolean {
  const email = sampleEmails.find((e) => e.id === emailId)
  if (email) {
    email.isRead = true
    return true
  }
  return false
}

export function toggleEmailImportant(emailId: string): boolean {
  const email = sampleEmails.find((e) => e.id === emailId)
  if (email) {
    email.isImportant = !email.isImportant
    return email.isImportant
  }
  return false
}
