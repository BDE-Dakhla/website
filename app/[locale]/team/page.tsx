'use client'

import {
  BookPlus,
  CalendarCheck2,
  CheckCheck,
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
import { useTranslations } from 'next-intl'
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
          "Porte la vision du Bureau Des Étudiants, représente l'association auprès de l'administration et des partenaires, arbitre les grandes décisions",
        specs: [
          {
            name: "Assurer le pilotage de l'association et la coordination des pôles",
            icon: CheckCheck,
          },
          {
            name: 'Gestion des partenariats et des partenaires',
            icon: UserStar,
          },
        ],
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
        name: 'Anas ELMARRABI',
        poste: 'Conseiller',
        icon: HandHelping,
        styles: { backgroundPositionY: '20%', backgroundSize: '120%' },
        description:
          "Apporte une vision externe, conseille sur la stratégie et l'amélioration continue",
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
    ],
  },
  {
    name: 'communication',
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
            name: 'Maintenir le développement globale du site et du Syllabus',
          },
        ],
      },
      {
        name: 'Safa ALI OMAR',
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
    name: 'evenementiel',
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
        name: 'Zouheir YOUSSEFI',
        poste: 'Responsable Divertissement',
        icon: PartyPopper,
        styles: { backgroundPosition: '50% 0%', backgroundSize: '170%' },
        description:
          'Conçoit des animations ludiques et créatives pour renforcer la cohésion étudiante',
      },
    ],
  },
  {
    name: 'formation',
    description: "Aider les étudiants à grandir, apprendre et s'épanouir",
    members: [
      {
        name: 'Nasser Allah MAHBOUBY',
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
  const t = useTranslations('team')

  return (
    <section
      aria-label='team-members'
      className='@container/main mx-auto max-w-[1440px] space-y-10'>
      {categories.map((category) => (
        <ul key={category.name}>
          <div className='my-14 grid select-none place-items-center rounded-lg border border-black bg-gradient-to-t from-[#e6e6e6] via-[#f7f7f7] to-white py-5 font-semibold text-xl uppercase tracking-widest shadow-[0_6px_0_0_rgb(0,0,0)] transition-all hover:translate-y-1.5 hover:shadow-none'>
            {t(`categories.${category.name}`)}
          </div>
          <ul className='flex flex-wrap justify-center gap-x-20 gap-y-12'>
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
