import type { Kysely } from 'kysely'
import type { Database, NewSponsor } from '../../../types/schema'

export async function seed(db: Kysely<Database>) {
  const admin = await db
    .selectFrom('User')
    .select(['id'])
    .where('email', '=', process.env.SEED_ADMIN_EMAIL as string)
    .executeTakeFirst()

  const approvedBy = admin?.id ?? null
  const now = new Date()

  const sponsors = [
    {
      name: 'Cih Bank',
      slug: 'cihbank',
      logo_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP5k2lsEMLapvNEOM_gVk3H-wpJNo2jPyUZw&s',
      website_url: 'https://www.cihbank.ma/',
      description: 'Bande des jeunes débutants',
      is_featured: true,
      priority: 10,
    },
    {
      name: 'Société Générale',
      slug: 'sg',
      logo_url:
        'https://www.societegenerale.com/sites/default/files/styles/rte_affichage_defaut_desktop/public/image/2023-04/logo-societe-generale.png?itok=9tsodGw3',
      website_url: 'https://www.societegenerale.com/',
      description: "Banque des séniors qui sont flingés d'argent",
      is_featured: false,
      priority: 50,
    },
    {
      name: 'Initech',
      slug: 'initech',
      logo_url: 'https://placehold.co/240x100?text=Initech',
      website_url: 'https://initech.example',
      description: 'Enterprise-grade TPS reports.',
      is_featured: true,
      priority: 20,
    },
  ] satisfies NewSponsor[]

  for (const s of sponsors) {
    await db
      .insertInto('sponsors')
      .values({
        name: s.name,
        slug: s.slug,
        logo_url: s.logo_url,
        website_url: s.website_url,
        description: s.description,
        is_featured: s.is_featured,
        priority: s.priority,
        approved: true,
        approved_at: now,
        approved_by: approvedBy,
      })
      .onConflict((oc) =>
        oc.column('slug').doUpdateSet({
          name: s.name,
          logo_url: s.logo_url,
          website_url: s.website_url,
          description: s.description,
          is_featured: s.is_featured,
          priority: s.priority,
          approved: true,
          approved_at: now,
          approved_by: approvedBy,
        }),
      )
      .execute()
  }
}
