"use client";

import { api } from '@/convex/_generated/api';
import { useQuery, useMutation } from 'convex/react';
import React, { useMemo } from 'react';
import { z } from 'zod';
import { useMutationState } from '@/hooks/UseMutationState';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { CirclePlus, X } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';


interface Friend {
    _id: string;
    username: string;
    imageUrl: string;
    email: string;
}

const createGroupFormSchema = z.object({
    name: z.string().min(1, { message: "This field can't be empty." }),
    members: z
        .string()
        .array()
        .min(1, { message: "You must select at least 1 friend" }),
});

const CreateGroupDialog = () => {
    const friends = useQuery(api.friends.get) as Friend[] | undefined;

    // Fix the mutation path to match your API
    const { mutate: createGroup, pending } = useMutationState(api.conversation.createGroup);

    const form = useForm<z.infer<typeof createGroupFormSchema>>({
        resolver: zodResolver(createGroupFormSchema),
        defaultValues: {
            name: "",
            members: [],
        },
    });

    const members = form.watch("members", []);

    const unselectedFriends = useMemo(() => {
        return friends ? friends.filter((friend) => !members.includes(friend._id)) : [];
    }, [members.length, friends?.length]);


    const handleSubmit = async (values: z.infer<typeof createGroupFormSchema>) => {
        await createGroup({name: values.name, members: values.members}).then(() => {
            form.reset()
            toast.success("Group created!");
        }).catch((error) => {
            error instanceof ConvexError ? error.data : "Unexpected error occccured"
        })
    }

    return <Dialog>
        <Tooltip>
            <TooltipTrigger>
             <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <CirclePlus />
         </Button>
        </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
                <p>Create Group</p>
            </TooltipContent>
        </Tooltip>

        <DialogContent className="block">
            <DialogHeader>
                <DialogTitle>
                    Create Group
                </DialogTitle>
                <DialogDescription>
                    Add your friends to gget started!
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit (handleSubmit)} className="space-y-8">
                    <FormField control={form.control} name="name" render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Group name..." {...field}>
                                    </Input>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }} />

                    <FormField control={form.control} name="members" render={() => {
                        return (
                            <FormItem>
                                <FormLabel>
                                    Friends
                                </FormLabel>
                                <FormControl>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild disabled={unselectedFriends.length === 0}>
                                            <Button className="w-full" variant="outline">
                                                Select
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full">
                                            {
                                                unselectedFriends.map(friend => {
                                                    return <DropdownMenuCheckboxItem key ={friend._id} className="flex items-center gap-2 w-fulll p-2" onCheckedChange={checked => {
                                                        if(checked) {
                                                            form.setValue("members", [...members, friend._id])
                                                        }
                                                    }}>
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarImage src={friend.imageUrl} />
                                                            <AvatarFallback>
                                                                {friend.username.substring(0,1)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <h4 className="truncate">
                                                            {friend.username}
                                                        </h4>
                                                    </DropdownMenuCheckboxItem>
                                                })
                                            }
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FormControl>
                            </FormItem>
                        )
                    }} 
                    
                    />
                    {
                        members &&  members.length ? <Card className="flex items-center gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar">
                            {friends?.filter(friend => members.includes(friend._id)).map(friend => {
                                return <div key={friend._id} className="flex flex-col items-center gap-1">
                                    <div className="relative">
                                        <Avatar>
                                        <AvatarImage src={friend.imageUrl} />
                                             <AvatarFallback>
                                                 {friend.username.substring(0,1)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <X className="text-muted-foreground w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointed" onClick={() => form.setValue("members", members.filter(id => id !== friend._id))}/>
                                    </div>
                                    <p className="truncate text-sm">
                                        {friend.username.split(" ")[0]}
                                    </p>
                                </div>
                            })}
                        </Card> : null
                    }
                    <DialogFooter>
                        <Button disabled={pending} type="submit">
                            Create
                        </Button>
                    </DialogFooter>

                </form>
            </Form>
        </DialogContent>
    </Dialog>
};

export default CreateGroupDialog;
