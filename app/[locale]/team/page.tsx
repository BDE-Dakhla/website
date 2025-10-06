'use client'

import {
  BookPlus,
  CalendarCheck2,
  Crown,
  GraduationCap,
  HandHeart,
  HandHelping,
  Handshake,
  Megaphone,
  Palette,
  PartyPopper,
  Podcast,
  RadioTower,
  Scroll,
  SquareChartGantt,
  Tickets,
  UserStar,
} from 'lucide-react'
import TeamCard, { type TeamCardProps } from '@/components/team-card'

const categories = [
  {
    name: 'pilotage',
    description:
      'Cette cellule assure la vision globale, la cohérence et la gestion stratégique',
    members: [
      {
        name: 'Abdellatif SEHTOUT',
        poste: 'Président',
        icon: Crown,
        styles: { backgroundPosition: '45% 10%', backgroundSize: '150%' },
        description:
          "Porte la vision du Bureau Des Étudiants, représente l'association auprès de l'administration etdes partenaires, arbitre les grandes décisions",
      },
      {
        name: 'Abdenour BOUGHZA',
        poste: 'Vice-Président',
        icon: Handshake,
        styles: { backgroundPosition: '43% 18%', backgroundSize: '260%' },
        description:
          'Bras droit du président, garant de la coordination entre pôles, suivi des projets en cours',
      },
      {
        name: 'Wissal EL HAZAL',
        poste: 'Secrétaire Générale',
        icon: Scroll,
        styles: { backgroundPosition: '60%', backgroundSize: '150%' },
        description:
          'Assure la rédaction, le suivi administratif et juridique, garde la mémoire du BDE (compte-rendus, convocations, dossiers)',
      },
      {
        name: 'Abdelilah IDADAR',
        poste: 'Trésorier',
        icon: Tickets,
        styles: { backgroundPosition: '26% 64%', backgroundSize: '200%' },
        description:
          'Supervise les finances (budget, subventions, bilans), garantit la transparence etla bonne gestion des ressources',
      },
      {
        name: 'Kawtar EL ARBAOUI',
        poste: 'Responsable RH',
        icon: UserStar,
        styles: { backgroundPosition: '46% 33%', backgroundSize: '350%' },
        description:
          "Encadre les membres, gère le recrutement interne, le suivi des compétences etla dynamique d'équipe",
      },
      {
        name: 'Anas ELMARRABI',
        poste: 'Conseiller',
        icon: HandHelping,
        styles: { backgroundPositionY: '20%', backgroundSize: '120%' },
        description:
          "Apporte une vision externe, conseille sur la stratégie et l'amélioration continue",
      },
    ],
  },
  {
    name: 'communication', // Communication & Rayonnement
    description:
      'Faire briller Apollo 9.0 et toucher efficacement la communauté étudiante',
    members: [
      {
        name: 'Walid Korchi',
        isCreator: true,
        poste: 'Responsable Communication',
        icon: RadioTower,
        styles: { backgroundPosition: '50% 100%', backgroundSize: '135%' },
        description:
          'Supervise la stratégie de communication et les relations presse',
        specs: [
          {
            icon: GraduationCap,
            name: 'Maintenir le développement globale du site et du Syllabus'
          },
        ],
      },
      {
        name: 'Safaa ALI OMAR',
        poste: 'Chargée Communication',
        icon: Podcast,
        styles: { backgroundPositionY: '25%', backgroundSize: '200%' },
        description:
          "Porte la vision du Bureau Des Étudiants, représente l'association auprès de l'administration etdes partenaires, arbitre les grandes décisions",
      },
      {
        name: 'Mohamed MRIHI',
        poste: 'Community Manager',
        icon: Megaphone,
        styles: { backgroundPosition: '60% 52.5%', backgroundSize: '240%' },
        description:
          'Anime les réseaux sociaux, crée du lien en ligne avec la communauté',
      },
      {
        name: 'Hamza RAMZI',
        styles: { backgroundPositionY: '20%', backgroundSize: '190%' },
        poste: 'Infographiste',
        description: "Assure l'identité visuelle et la créativité graphique",
        icon: Palette,
      },
    ],
  },
  {
    name: 'evenementiel', // Événementiel & Vie Etudiante
    description:
      'Créer des expériences inoubliables et responsables pour les étudiants',
    members: [
      {
        name: 'Hajar SIOURE',
        poste: 'Responsable Événementiel',
        styles: { backgroundPositionY: '10%' },
        icon: CalendarCheck2,
        description:
          'Coordonne la programmation, la logistique et la sécurité des événements',
      },
      {
        name: 'Paul Smith MASDIRTH',
        poste: 'Chargé Événementiel',
        icon: SquareChartGantt,
        styles: { backgroundPosition: '40% 40%', backgroundSize: '110%' },
        description:
          'Soutient la préparation et le bon déroulement des activités (concerts, galas, forums)',
      },
      {
        name: 'Zouhair YOUSSEFI',
        poste: 'Responsable Divertissement',
        icon: PartyPopper,
        styles: { backgroundPosition: '50% 0%', backgroundSize: '170%' },
        description:
          'Conçoit des animations ludiques et créatives pour renforcer la cohésion étudiante',
      },
    ],
  },
  {
    name: 'formation', // Formation & Développement
    description: "Aider les étudiants à grandir, apprendre et s'épanouir",
    members: [
      {
        name: 'Nasserallah MAHBOUBY',
        poste: 'Responsable Formation',
        icon: BookPlus,
        styles: { backgroundPosition: '62.5% 35%', backgroundSize: '200%' },
        description:
          'Met en place des ateliers, formations soft skills et programmes de mentorat',
      },
      {
        name: 'Ez-Zouine Chaimae',
        poste: 'Chargée Formation',
        styles: { backgroundPosition: '45% 5%', backgroundSize: '275%' },
        icon: HandHeart,
        description:
          'Développe les contenus pédagogiques, coordonne les ateliers pratiques et accompagne les étudiants dans leur montée en compétences',
      },
    ],
  },
] satisfies ReadonlyArray<
  Readonly<{
    name: string
    description: string
    members: ReadonlyArray<Readonly<TeamCardProps>>
  }>
>

export default function Page() {
  return (
    <section
      aria-label='team-members'
      className='@container/main mx-auto mt-10 max-w-[1440px] space-y-10'>
      {categories.map((category) => (
        <ul key={category.name}>
          <h1 className='mb-6 px-6'>{category.name}</h1>
          <ul className='grid grid-cols-4 place-items-center gap-y-16'>
            {category.members.map((member) => (
              <TeamCard
                key={member.name}
                {...member}
                category={category.name}
              />
            ))}
          </ul>
        </ul>
      ))}
    </section>
  )
}
