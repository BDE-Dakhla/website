'use client'

import { Calendar, Plus, Send, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function CampaignsPage() {
  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='font-bold text-3xl'>🚀 Campagnes Newsletter</h1>
          <p className='mt-2 text-gray-600'>
            Créez et gérez vos campagnes d'email marketing
          </p>
        </div>
        <Button>
          <Plus className='mr-1 h-4 w-4' />
          Nouvelle Campagne
        </Button>
      </div>

      {/* Coming Soon Message */}
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-16'>
          <Send className='mb-6 h-20 w-20 text-blue-500' />
          <h2 className='mb-4 font-semibold text-2xl'>Gestion des Campagnes</h2>
          <p className='mb-6 max-w-md text-center text-gray-600'>
            La gestion complète des campagnes newsletter sera bientôt
            disponible. En attendant, vous pouvez utiliser l'API pour créer des
            campagnes.
          </p>

          <div className='mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-3'>
            <Card className='text-center'>
              <CardContent className='p-4'>
                <Calendar className='mx-auto mb-2 h-8 w-8 text-blue-500' />
                <h3 className='font-semibold'>Programmation</h3>
                <p className='text-gray-600 text-sm'>Planifiez vos envois</p>
              </CardContent>
            </Card>
            <Card className='text-center'>
              <CardContent className='p-4'>
                <Users className='mx-auto mb-2 h-8 w-8 text-green-500' />
                <h3 className='font-semibold'>Segmentation</h3>
                <p className='text-gray-600 text-sm'>Ciblez vos audiences</p>
              </CardContent>
            </Card>
            <Card className='text-center'>
              <CardContent className='p-4'>
                <Send className='mx-auto mb-2 h-8 w-8 text-purple-500' />
                <h3 className='font-semibold'>Envoi en Lot</h3>
                <p className='text-gray-600 text-sm'>Envois automatisés</p>
              </CardContent>
            </Card>
          </div>

          <div className='mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4'>
            <p className='text-blue-800 text-sm'>
              <strong>API disponible :</strong> Vous pouvez déjà créer des
              campagnes via
              <code className='mx-1 rounded bg-blue-100 px-2 py-1'>
                POST /api/newsletter/campaigns
              </code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
