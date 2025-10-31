import type { Kysely } from 'kysely'
import type { Database } from '@/types/schema'

export async function seed(db: Kysely<Database>): Promise<void> {
  await db
    .insertInto('clubs')
    .values([
      {
        name: 'Club de Football',
        description:
          'Le club de football rassemble les passionnés de sport pour des matchs amicaux et compétitions.',
        category: 'sports',
        hasInternationalGroup: false,
        memberCount: 25,
      },
      {
        name: 'Club de Musique',
        description:
          'Découvrez et partagez votre passion pour la musique avec des concerts et ateliers.',
        category: 'culture',
        hasInternationalGroup: true,
        memberCount: 18,
      },
      {
        name: 'Club Informatique',
        description:
          'Apprenez la programmation, développez des projets et participez à des hackathons.',
        category: 'academique',
        hasInternationalGroup: false,
        memberCount: 32,
      },
      {
        name: 'Club Erasmus',
        description:
          'Échangez avec des étudiants internationaux et organisez des événements culturels.',
        category: 'international',
        hasInternationalGroup: true,
        memberCount: 15,
      },
      {
        name: 'Club de Basket',
        description:
          'Rejoignez les équipes de basket pour des entraînements et tournois.',
        category: 'sports',
        hasInternationalGroup: false,
        memberCount: 22,
      },
      {
        name: 'Club Théâtre',
        description:
          'Exprimez-vous sur scène avec des pièces de théâtre et improvisations.',
        category: 'culture',
        hasInternationalGroup: true,
        memberCount: 20,
      },
      {
        name: 'Club Mathématiques',
        description:
          'Résolvez des problèmes complexes et participez à des compétitions mathématiques.',
        category: 'academique',
        hasInternationalGroup: false,
        memberCount: 14,
      },
      {
        name: 'Club Environnement',
        description:
          'Agissez pour la planète avec des projets écologiques et sensibilisation.',
        category: 'autre',
        hasInternationalGroup: true,
        memberCount: 28,
      },
    ])
    .execute()
}
