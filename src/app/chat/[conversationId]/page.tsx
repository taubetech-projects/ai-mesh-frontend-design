"use client";
import { ChatInterface } from "@/features/chat/components/chat-interface";
import { ImageGenerationInterface } from "@/features/chat/image-chat/components/image-generation-interface";
import { useGetConversationById } from "@/features/conversation/hooks/conversationHook";
import { setSelectedConvId } from "@/features/conversation/store/conversation-slice";
import store, { RootState } from "@/lib/store/store";
import ProtectedRoute from "@/shared/components/protected-route";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveInterface as setGlobalActiveInterface } from "@/features/chat/store/ui-slice"; // Renamed import
import {
  CONVERSATION_TYPES,
  INTERFACE_TYPES,
} from "@/shared/constants/constants";
import { toast } from "sonner";


function HomeContent2() {
  const { activeInterface } = useSelector((state: RootState) => state.ui);
  return (
    <div className="flex h-screen bg-background relative">
      {/* <Sidebar activeInterface={activeInterface} /> */}
      {activeInterface === "CHAT" ? (
        <ChatInterface />
      ) : (
        <ImageGenerationInterface />
      )}
    </div>
  );
}

export default function ConversationPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const conversationId = params.conversationId as string;
  const { data, isLoading, error } = useGetConversationById(conversationId);
  console.log("Error on conversation loading: ", error?.message);

  useEffect(() => {
    if (data) {
      if (data.convoType === "IMAGE") {
        dispatch(setGlobalActiveInterface(CONVERSATION_TYPES.IMAGE));
      } else {
        dispatch(setGlobalActiveInterface(CONVERSATION_TYPES.CHAT));
      }
      dispatch(setSelectedConvId(data.id));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error, dispatch]);

  return (
    <ProtectedRoute>
      <HomeContent2 />
    </ProtectedRoute>
  );
}
