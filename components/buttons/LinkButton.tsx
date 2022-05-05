import Link from 'next/link'

type LinkProps = {
  href: string
  children: any
}

export default function LinkButton({ href, children }: LinkProps) {
  return (
    <button className='link-button relative font-space-grotesk bg-clip-text text-transparent bg-[linear-gradient(115.82deg,#671BC9_5.15%,#FD0F9E_108.88%)] hover:bg-[linear-gradient(98.98deg,#671BC9_-83.86%,#FD0F9E_85.88%)] active:bg-[linear-gradient(115.82deg,#671BC9_5.15%,#FD0F9E_108.88%)] tracking-widest'>
      <Link href={href}>
        <a className=' leading-6'>{children}</a>
      </Link>
    </button>
  )
}