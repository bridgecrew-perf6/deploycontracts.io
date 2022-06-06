export default function Container({ children, className }: { children: any; className?: string }) {
  return <div className={`max-w-xl mx-auto px-6 md:px-0 ${className}`}>{children}</div>
}
