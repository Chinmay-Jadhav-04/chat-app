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

const LeaveGroupDialog= ({conversationId, open, setOpen}: Props) => {
    const {mutate: leaveGroup, pending} = useMutationState(api.conversation.leaveGroup);

    const handleLeaveGroup = async() => {
        leaveGroup({conversationId}).then(() => {toast.success("Group left")}).catch((error) => {toast.error(error instanceof ConvexError ? error.data : "Unexpected error occured.")})

    }

  return <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>
                Are you sure you want to remove this friend?
            </AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. You will not be able to see previous messages or send new messages to this group
            </AlertDialogDescription>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={pending}>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction disabled={pending} onClick={handleLeaveGroup}>
                    Leave
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogHeader>
    </AlertDialogContent>
  </AlertDialog>
}

export default LeaveGroupDialog
