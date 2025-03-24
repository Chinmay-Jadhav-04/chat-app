"use client";

import ConversationContainer from '@/components/shared/conversation/ConversationContainer';
import { api } from '@/convex/_generated/api';
import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { Id } from '@/convex/_generated/dataModel';
import { Loader2 } from 'lucide-react';
import Header from './_components/Header';
import Body from './_components/body/Body';
import ChatInput from './_components/input/ChatInput';
import RemoveFriendDialog from './_components/dialogs/RemoveFriendDialog';
import DeleteGroupDialog from './_components/dialogs/DeleteGroupDialog';
import LeaveGroupDialog from './_components/dialogs/LeaveGroupDialog';

// Define Props type
type Props = {
  params: {
    conversationId: Id<"conversations">;
  };
};

const ConversationPage = ({ params: { conversationId } }: Props) => {
  const conversation = useQuery(api.conversation.get, { id: conversationId });
  const [removeFriendDialogueOpen, setRemoveFriendDialogueOpen] = useState(false);
  const [deleteGroupDialogueOpen, setDeleteGroupDialogueOpen] = useState(false);
  const [leaveGroupDialogueOpen, setLeaveGroupDialogueOpen] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

  // Define dialog options outside JSX for better readability
  const groupOptions = [
    { label: "Leave group", destructive: false, onClick: () => setLeaveGroupDialogueOpen(true) },
    { label: "Delete group", destructive: true, onClick: () => setDeleteGroupDialogueOpen(true) },
  ];

  const friendOptions = [
    { label: "Remove friend", destructive: true, onClick: () => setRemoveFriendDialogueOpen(true) },
  ];

  return conversation === undefined ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ) : conversation === null ? (
    <p className="w-full h-full flex items-center justify-center">
      Conversation not found
    </p>
  ) : (
    <ConversationContainer>
      <RemoveFriendDialog
        conversationId={conversationId}
        open={removeFriendDialogueOpen}
        setOpen={setRemoveFriendDialogueOpen}
      />
        <LeaveGroupDialog
        conversationId={conversationId}
        open={leaveGroupDialogueOpen}
        setOpen={setLeaveGroupDialogueOpen}
      />
      <DeleteGroupDialog
        conversationId={conversationId}
        open={deleteGroupDialogueOpen}
        setOpen={setDeleteGroupDialogueOpen}
      />
      <Header
        name={(conversation.isGroup ? conversation.name : conversation.otherMember?.username) || ""}
        imageUrl={conversation.isGroup ? undefined : conversation.otherMember?.imageUrl}
        options={conversation.isGroup ? groupOptions : friendOptions}
      />
      <Body 
        members={
          conversation.isGroup 
            ? []  // Group conversations don't have members in the current schema
            : (conversation.otherMember ? [conversation.otherMember] : [])
        } 
      />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationPage;
