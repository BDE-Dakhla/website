import { Calendar, Globe, Lock, Mail, Shield, User, Users } from 'lucide-react'

export default function Component() {
  return (
    <div className='flex min-h-[100dvh] flex-col bg-background'>
      <header className='bg-primary px-4 py-6 text-primary-foreground md:px-8'>
        <div className='container mx-auto max-w-5xl'>
          <h1 className='font-bold text-3xl'>Privacy Policy</h1>
          <p className='mt-2 text-lg text-primary-foreground/80'>
            Protecting your data is our top priority.
          </p>
        </div>
      </header>
      <main className='flex-1 px-4 py-12 md:px-8'>
        <div className='container mx-auto max-w-5xl space-y-12'>
          <section>
            <div className='mb-6 flex items-center gap-4'>
              <Lock className='h-8 w-8 text-primary' />
              <h2 className='font-bold text-2xl'>Data Collection</h2>
            </div>
            <div className='grid gap-8 md:grid-cols-2'>
              <div>
                <h3 className='font-semibold text-lg'>What we collect</h3>
                <p className='mt-2 text-muted-foreground'>
                  We collect the following information from you:
                </p>
                <ul className='mt-4 list-disc space-y-2 pl-6'>
                  <li>Name and email address</li>
                  <li>Usage data and device information</li>
                  <li>Payment information (if applicable)</li>
                </ul>
              </div>
              <div>
                <h3 className='font-semibold text-lg'>How we use it</h3>
                <p className='mt-2 text-muted-foreground'>
                  We use your data to:
                </p>
                <ul className='mt-4 list-disc space-y-2 pl-6'>
                  <li>Provide and improve our services</li>
                  <li>Communicate with you</li>
                  <li>Analyze usage and trends</li>
                </ul>
              </div>
            </div>
          </section>
          <section>
            <div className='mb-6 flex items-center gap-4'>
              <Shield className='h-8 w-8 text-primary' />
              <h2 className='font-bold text-2xl'>Data Security</h2>
            </div>
            <div className='grid gap-8 md:grid-cols-2'>
              <div>
                <h3 className='font-semibold text-lg'>Encryption</h3>
                <p className='mt-2 text-muted-foreground'>
                  All data is encrypted in transit and at rest using
                  industry-standard encryption protocols.
                </p>
              </div>
              <div>
                <h3 className='font-semibold text-lg'>Access Controls</h3>
                <p className='mt-2 text-muted-foreground'>
                  Access to your data is restricted to authorized personnel
                  only. We have strict access controls and audit logging in
                  place.
                </p>
              </div>
            </div>
          </section>
          <section>
            <div className='mb-6 flex items-center gap-4'>
              <Users className='h-8 w-8 text-primary' />
              <h2 className='font-bold text-2xl'>Data Sharing</h2>
            </div>
            <div className='grid gap-8 md:grid-cols-2'>
              <div>
                <h3 className='font-semibold text-lg'>Third-Party Providers</h3>
                <p className='mt-2 text-muted-foreground'>
                  We may share your data with trusted third-party providers who
                  assist us in operating our services. These providers are
                  subject to strict confidentiality and security requirements.
                </p>
              </div>
              <div>
                <h3 className='font-semibold text-lg'>Legal Requests</h3>
                <p className='mt-2 text-muted-foreground'>
                  We may disclose your data if required to do so by law or in
                  the good-faith belief that such action is necessary to comply
                  with legal processes.
                </p>
              </div>
            </div>
          </section>
          <section>
            <div className='mb-6 flex items-center gap-4'>
              <User className='h-8 w-8 text-primary' />
              <h2 className='font-bold text-2xl'>Your Rights</h2>
            </div>
            <div className='grid gap-8 md:grid-cols-2'>
              <div>
                <h3 className='font-semibold text-lg'>Access and Correction</h3>
                <p className='mt-2 text-muted-foreground'>
                  You have the right to access, review, and correct the personal
                  information we have on file for you.
                </p>
              </div>
              <div>
                <h3 className='font-semibold text-lg'>Deletion</h3>
                <p className='mt-2 text-muted-foreground'>
                  You may request that we delete your personal information at
                  any time, subject to certain exceptions.
                </p>
              </div>
            </div>
          </section>
          <section>
            <div className='mb-6 flex items-center gap-4'>
              <Globe className='h-8 w-8 text-primary' />
              <h2 className='font-bold text-2xl'>
                International Data Transfers
              </h2>
            </div>
            <p className='text-muted-foreground'>
              We may transfer your personal data to countries outside of your
              home country, including to countries that may not provide the same
              level of data protection as your home country. In such cases, we
              will ensure that appropriate safeguards are in place to protect
              your data.
            </p>
          </section>
          <section>
            <div className='mb-6 flex items-center gap-4'>
              <Calendar className='h-8 w-8 text-primary' />
              <h2 className='font-bold text-2xl'>Updates and Changes</h2>
            </div>
            <p className='text-muted-foreground'>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on our
              website. We encourage you to review this policy periodically for
              the latest information on our privacy practices.
            </p>
          </section>
          <section>
            <div className='mb-6 flex items-center gap-4'>
              <Mail className='h-8 w-8 text-primary' />
              <h2 className='font-bold text-2xl'>Contact Us</h2>
            </div>
            <p className='text-muted-foreground'>
              If you have any questions or concerns about our Privacy Policy or
              the way we handle your data, please don't hesitate to contact us
              at:
            </p>
            <div className='mt-4 space-y-2'>
              <p>privacy@example.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
