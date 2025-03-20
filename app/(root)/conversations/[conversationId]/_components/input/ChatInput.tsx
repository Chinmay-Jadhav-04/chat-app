"use client";

import { z } from 'zod';
import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { useConversation } from '@/hooks/useConversation';
import { api } from '@/convex/_generated/api';
import { useMutationState } from '@/hooks/UseMutationState';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';
import {Form, FormControl, FormField, FormItem} from '@/components/ui/form';



const chatMessageSchema = z.object({
  content: z.string().min(1,{message: "This field can't be empty."}),
})

const ChatInput = () => {

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const {conversationId} = useConversation();

  const {mutate: createMessage, pending} = useMutationState(api.message.create);

  const form = useForm <z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) =>{
    createMessage({
      conversationId,
      type: "text",
      content: [values.content]
    }).then(() => {
      form.reset();
    }).catch(error => {
      toast.error(error instanceof ConvexError ? error.data : "Unexpected errror occurred.")
    })
  }

  return <Card className="w-full p-2 rounded-lg relative">
    <div className="flex gap-2 items-end w-full">
      <Form {...form}>,
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2 items-end w-full">
          <FormField control={form.control} name="content" render={({field}) => {
            <FormItem className="h-full w-full">
              <FormControl>
                
              </FormControl>
            </FormItem>
          }}></FormField>
        </form>
      </Form>
    </div>
  </Card>
}

export default ChatInput 