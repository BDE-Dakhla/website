import PublicLayout from '@/components/layout/public-layout'

export default function Layout({ children }: React.PropsWithChildren) {
  return <PublicLayout>{children}</PublicLayout>
}
