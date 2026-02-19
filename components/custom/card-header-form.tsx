import React from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { LucideIcon, Plus } from 'lucide-react'

interface CardHeaderFormProps {
    title: string
    description?: string
    buttonLabel?: string
    onClick?: () => void
    showButton?: boolean
    className?: string
    Icon?: LucideIcon  | undefined
}

const CardHeaderForm = ({title,description,buttonLabel,onClick,showButton,className,Icon: Icon = Plus}: CardHeaderFormProps) => {
    return (
        <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    <p className="text-muted-foreground text-sm">{description}</p>
                </div>
                {showButton && (
                    <Button
                    size="lg"
                    onClick={onClick}
                    className={className}>
                        <Icon/>
                        <span className="hidden lg:inline">
                        {buttonLabel}
                        </span>
                    </Button>
                )}
            </div>
        </Card>
    )
}

export default CardHeaderForm