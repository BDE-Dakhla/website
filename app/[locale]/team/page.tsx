'use client'

/**
 * TODO: Full Internationalization
 * 
 * Currently, only category names are translated via i18n JSON files.
 * To fully internationalize this page, the following hardcoded French content
 * should be moved to the i18n locale files:
 * 
 * 1. Category descriptions (e.g., "Cette cellule assure la vision globale...")
 * 2. Member roles/positions (e.g., "Président", "Vice-Président")
 * 3. Member descriptions
 * 4. Member specifications (specs.name fields)
 * 
 * Recommended structure in locale JSON files:
 * "team": {
 *   "categories": {...},
 *   "members": {
 *     "[memberName]": {
 *       "poste": "...",
 *       "description": "...",
 *       "specs": ["...", "...", "..."]
 *     }
 *   }
 * }
 */

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
import TeamCard, { type TeamCardProps } from '@/components/common/team-card'

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
          {
            name: "Représenter le BDE auprès de l'administration et des instances",
            icon: Crown,
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
        specs: [
          {
            name: 'Coordonner les différents pôles et assurer leur synergie',
            icon: Handshake,
          },
          {
            name: 'Suivre l\'avancement des projets et résoudre les blocages',
            icon: SquareChartGantt,
          },
          {
            name: 'Suppléer le président en cas d\'absence ou de besoin',
            icon: Crown,
          },
        ],
      },
      {
        name: 'Anas ELMARRABI',
        poste: 'Conseiller',
        icon: HandHelping,
        styles: { backgroundPositionY: '20%', backgroundSize: '120%' },
        description:
          "Apporte une vision externe, conseille sur la stratégie et l'amélioration continue",
        specs: [
          {
            name: 'Conseiller le bureau sur les orientations stratégiques',
            icon: HandHelping,
          },
          {
            name: 'Proposer des axes d\'amélioration et d\'innovation',
            icon: CheckCheck,
          },
          {
            name: 'Apporter un regard externe et faciliter la prise de décision',
            icon: Handshake,
          },
        ],
      },
      {
        name: 'Wissal EL HAZAL',
        poste: 'Secrétaire Générale',
        icon: Scroll,
        styles: { backgroundPosition: '60%', backgroundSize: '150%' },
        description:
          'Assure la rédaction, le suivi administratif et juridique, garde la mémoire du BDE (compte-rendus, convocations, dossiers)',
        specs: [
          {
            name: 'Rédiger les comptes-rendus et convoquer les réunions',
            icon: Scroll,
          },
          {
            name: 'Gérer les dossiers administratifs et archives du BDE',
            icon: BookPlus,
          },
          {
            name: 'Assurer la conformité juridique et le suivi des obligations',
            icon: CheckCheck,
          },
        ],
      },
      {
        name: 'Abdelilah IDADAR',
        poste: 'Trésorier',
        icon: Tickets,
        styles: { backgroundPosition: '26% 64%', backgroundSize: '200%' },
        description:
          'Supervise les finances (budget, subventions, bilans), garantit la transparence etla bonne gestion des ressources',
        specs: [
          {
            name: 'Élaborer et suivre le budget annuel du BDE',
            icon: Tickets,
          },
          {
            name: 'Gérer les subventions et produire les bilans financiers',
            icon: CheckCheck,
          },
          {
            name: 'Garantir la transparence financière auprès des membres',
            icon: UserStar,
          },
        ],
      },
      {
        name: 'Kawtar EL ARBAOUI',
        poste: 'Responsable RH',
        icon: UserStar,
        styles: { backgroundPosition: '46% 33%', backgroundSize: '350%' },
        description:
          "Encadre les membres, gère le recrutement interne, le suivi des compétences etla dynamique d'équipe",
        specs: [
          {
            name: 'Organiser le recrutement et l\'intégration des nouveaux membres',
            icon: UserStar,
          },
          {
            name: 'Développer les compétences et maintenir la cohésion d\'équipe',
            icon: HandHeart,
          },
          {
            name: 'Gérer les conflits et favoriser le bien-être des membres',
            icon: Handshake,
          },
        ],
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
            icon: RadioTower,
            name: 'Définir et piloter la stratégie de communication globale',
          },
          {
            icon: GraduationCap,
            name: 'Maintenir le développement globale du site et du Syllabus',
          },
          {
            icon: Megaphone,
            name: 'Coordonner les relations presse et la visibilité médiatique',
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
        specs: [
          {
            name: 'Produire les contenus de communication (articles, vidéos, podcasts)',
            icon: Podcast,
          },
          {
            name: 'Gérer les relations avec l\'administration et les partenaires',
            icon: Handshake,
          },
          {
            name: 'Planifier et mettre en œuvre les campagnes de communication',
            icon: CalendarCheck2,
          },
        ],
      },
      {
        name: 'Mohamed MRIHI',
        poste: 'Community Manager',
        icon: Megaphone,
        styles: { backgroundPosition: '60% 52.5%', backgroundSize: '240%' },
        description:
          'Anime les réseaux sociaux, crée du lien en ligne avec la communauté',
        specs: [
          {
            name: 'Animer les réseaux sociaux et interagir avec la communauté',
            icon: Megaphone,
          },
          {
            name: 'Créer et publier des contenus engageants et viraux',
            icon: RadioTower,
          },
          {
            name: 'Analyser les statistiques et optimiser la portée des publications',
            icon: SquareChartGantt,
          },
        ],
      },
      {
        name: 'Hamza RAMZI',
        styles: { backgroundPositionY: '20%', backgroundSize: '190%' },
        poste: 'Infographiste',
        description: "Assure l'identité visuelle et la créativité graphique",
        icon: Palette,
        specs: [
          {
            name: 'Concevoir l\'identité visuelle et la charte graphique',
            icon: Palette,
          },
          {
            name: 'Créer les supports graphiques pour les événements et campagnes',
            icon: CalendarCheck2,
          },
          {
            name: 'Assurer la cohérence visuelle sur tous les supports',
            icon: CheckCheck,
          },
        ],
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
        specs: [
          {
            name: 'Planifier et coordonner le calendrier des événements',
            icon: CalendarCheck2,
          },
          {
            name: 'Gérer la logistique, les prestataires et la sécurité',
            icon: SquareChartGantt,
          },
          {
            name: 'Assurer le respect du budget et des normes de sécurité',
            icon: CheckCheck,
          },
        ],
      },
      {
        name: 'Paul Smith MASDIRTH',
        poste: 'Chargé Événementiel',
        icon: SquareChartGantt,
        styles: { backgroundPosition: '40% 40%', backgroundSize: '110%' },
        description:
          'Soutient la préparation et le bon déroulement des activités (concerts, galas, forums)',
        specs: [
          {
            name: 'Assister la préparation des événements majeurs',
            icon: SquareChartGantt,
          },
          {
            name: 'Superviser le jour J et coordonner les équipes terrain',
            icon: CheckCheck,
          },
          {
            name: 'Gérer les imprévus et garantir le bon déroulement',
            icon: HandHelping,
          },
        ],
      },
      {
        name: 'Zouheir YOUSSEFI',
        poste: 'Responsable Divertissement',
        icon: PartyPopper,
        styles: { backgroundPosition: '50% 0%', backgroundSize: '170%' },
        description:
          'Conçoit des animations ludiques et créatives pour renforcer la cohésion étudiante',
        specs: [
          {
            name: 'Concevoir des animations originales et ludiques',
            icon: PartyPopper,
          },
          {
            name: 'Organiser des activités de team building et de cohésion',
            icon: HandHeart,
          },
          {
            name: 'Créer des moments conviviaux et renforcer l\'esprit étudiant',
            icon: Tickets,
          },
        ],
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
        specs: [
          {
            name: 'Concevoir et organiser des ateliers de formation',
            icon: BookPlus,
          },
          {
            name: 'Piloter les programmes de mentorat et de développement',
            icon: GraduationCap,
          },
          {
            name: 'Identifier les besoins en compétences et créer des partenariats',
            icon: Handshake,
          },
        ],
      },
      {
        name: 'Ez-Zouine Chaimae',
        poste: 'Chargée Formation',
        styles: { backgroundPosition: '45% 5%', backgroundSize: '275%' },
        icon: HandHeart,
        description:
          'Développe les contenus pédagogiques, coordonne les ateliers pratiques et accompagne les étudiants dans leur montée en compétences',
        specs: [
          {
            name: 'Créer les contenus pédagogiques des formations',
            icon: BookPlus,
          },
          {
            name: 'Accompagner individuellement les étudiants dans leur parcours',
            icon: HandHeart,
          },
          {
            name: 'Évaluer l\'impact des formations et collecter les retours',
            icon: CheckCheck,
          },
        ],
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
          <div className='my-14 grid select-none place-items-center rounded-lg border border-black bg-gradient-to-t from-[#e6e6e6] via-[#f7f7f7] to-white py-5 font-semibold text-xl uppercase tracking-widest shadow-[0_6px_0_0_rgb(0,0,0)] transition-all hover:translate-y-1.5 hover:shadow-none dark:border-white dark:from-[#3d3d3d] dark:via-[#000] dark:to-black dark:shadow-[0_6px_0_0_rgb(255,255,255)] dark:hover:shadow-none'>
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
