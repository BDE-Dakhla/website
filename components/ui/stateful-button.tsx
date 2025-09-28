'use client'

import { motion, useAnimate } from 'motion/react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
}

export const Button = ({ className, children, ...props }: ButtonProps) => {
  const [scope, animate] = useAnimate()

  const animateLoading = async () => {
    await animate(
      '.loader',
      { width: '20px', scale: 1, display: 'block' },
      { duration: 0.2 },
    )
  }

  const animateSuccess = async () => {
    await animate(
      '.loader',
      { width: '0px', scale: 0, display: 'none' },
      { duration: 0.2 },
    )
    await animate(
      '.check',
      { width: '20px', scale: 1, display: 'block' },
      { duration: 0.2 },
    )

    await animate(
      '.check',
      { width: '0px', scale: 0, display: 'none' },
      { delay: 2, duration: 0.2 },
    )
  }

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await animateLoading()
    await props.onClick?.(event)
    await animateSuccess()
  }

  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onAnimationStart,
    onAnimationEnd,
    ...buttonProps
  } = props

  return (
    <motion.button
      className={cn(
        'flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-full bg-green-500 px-4 py-2 font-medium text-white ring-offset-2 transition duration-200 hover:ring-2 hover:ring-green-500 dark:ring-offset-black',
        className,
      )}
      layout
      layoutId='button'
      ref={scope}
      {...buttonProps}
      onClick={handleClick}>
      <motion.div className='flex items-center gap-2' layout>
        <Loader />
        <CheckIcon />
        <motion.span layout>{children}</motion.span>
      </motion.div>
    </motion.button>
  )
}

const Loader = () => {
  return (
    <motion.svg
      animate={{ rotate: [0, 360] }}
      className='loader text-white'
      fill='none'
      height='24'
      initial={{ scale: 0, width: 0, display: 'none' }}
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      style={{ scale: 0.5, display: 'none' }}
      transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }}
      viewBox='0 0 24 24'
      width='24'
      xmlns='http://www.w3.org/2000/svg'>
      <path d='M0 0h24v24H0z' fill='none' stroke='none' />
      <path d='M12 3a9 9 0 1 0 9 9' />
    </motion.svg>
  )
}

const CheckIcon = () => {
  return (
    <motion.svg
      className='check text-white'
      fill='none'
      height='24'
      initial={{ scale: 0, width: 0, display: 'none' }}
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      style={{ scale: 0.5, display: 'none' }}
      viewBox='0 0 24 24'
      width='24'
      xmlns='http://www.w3.org/2000/svg'>
      <path d='M0 0h24v24H0z' fill='none' stroke='none' />
      <path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' />
      <path d='M9 12l2 2l4 -4' />
    </motion.svg>
  )
}
