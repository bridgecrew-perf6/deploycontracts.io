export default function SecondaryButton({ children }: { children: any }) {
  return (
    <button className='secondary-button-gradient px-12 py-4 font-space-grotesk font-bold text-[#FD0F9E] hover:text-white active:text-white rounded-2xl hover:bg-[linear-gradient(122.48deg,#671BC9_-52.99%,#FD0F9E_97.26%)] hover:shadow-[0px_2px_40px_rgba(253,15,158,0.7)] active:bg-[linear-gradient(122.48deg,#671BC9_-52.99%,#FD0F9E_97.26%)] transition-all duration-100 ease-out tracking-widest'>
      {children}
    </button>
  )
}