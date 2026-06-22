import { cn } from '@/lib/utils'
import { motion } from "framer-motion"

interface LinesPatternCardProps {
  children: React.ReactNode
  className?: string
  patternClassName?: string
  gradientClassName?: string
}

export function LinesPatternCard({
  children,
  className,
  patternClassName,
  gradientClassName
}: LinesPatternCardProps) {
  return (
    <motion.div
      className={cn(
        "border w-full rounded-xl overflow-hidden",
        "bg-foundry-dark",
        "border-foundry-border",
        "p-[2px]",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={cn(
        "size-full bg-repeat bg-[length:30px_30px] rounded-xl",
        "bg-lines-pattern",
        patternClassName
      )}>
        <div className={cn(
          "size-full bg-gradient-to-tr rounded-xl",
          "from-foundry-dark/95 via-foundry-dark/60 to-foundry-dark/20",
          gradientClassName
        )}>
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export function LinesPatternCardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-left p-5", className)}
      {...props}
    />
  )
}
