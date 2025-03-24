import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CircleArrowLeft, Settings } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { cn } from '@/lib/utils';

type Props = {
    imageUrl?: string;
    name: string;
    options?: {
        label: string;
        destructive: boolean;
        onClick: () => void;
    }[]
}

const Header = ({imageUrl, name, options}: Props) => {
  return (
    <Card className='w-full flex items-center p-2'>
        <div className="flex items-center gap-2 w-full">
            <Link href="/conversations" className="block lg:hidden p-2">
                <CircleArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={imageUrl} />
                    <AvatarFallback>
                        {name.substring(0,1)}
                    </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold">{name}</h2>
            </div>
            <div className="ml-auto">
                {options && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button size="icon" variant="secondary">
                                <Settings />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {options.map((option, id) => (
                                <DropdownMenuItem
                                    key={id}
                                    onClick={option.onClick}
                                    className={cn("font-semibold", { "text-destructive": option.destructive })}
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    </Card>
  )
}

export default Header
