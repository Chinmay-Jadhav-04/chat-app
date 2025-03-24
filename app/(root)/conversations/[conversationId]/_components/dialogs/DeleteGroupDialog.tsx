"use client";

import React, { Dispatch, SetStateAction } from 'react'
import { Id } from '@/convex/_generated/dataModel';
import { useMutationState } from '@/hooks/UseMutationState';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


type Props = {
    conversationId: Id<"conversations">;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}

const DeleteGroupDialog= ({conversationId, open, setOpen}: Props) => {
    const {mutate: deleteGroup, pending} = useMutationState(api.conversation.deleteGroup);

    const handleDeleteGroup = async() => {
        deleteGroup({conversationId}).then(() => {toast.success("Group deleted")}).catch((error) => {toast.error(error instanceof ConvexError ? error.data : "Unexpected error occured.")})

    }

  return <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>
                Are you sure you want to remove this friend?
            </AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. All messages will be deleted and you will not be able to message this group.
            </AlertDialogDescription>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={pending}>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction disabled={pending} onClick={handleDeleteGroup}>
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogHeader>
    </AlertDialogContent>
  </AlertDialog>
}

export default DeleteGroupDialog
