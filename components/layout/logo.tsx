import Image from 'next/image'

export function Logo() {
  return (
    <Image
      alt='Logo'
      className='select-none'
      draggable={false}
      height={32}
      src='/icons/logo.png'
      width={100}
    />
  )
}
