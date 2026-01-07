"use client";
import { ChatInterface } from "@/features/chat/components/chat-interface";
import { ImageGenerationInterface } from "@/features/chat/image-chat/components/image-generation-interface";
import { useGetConversationById } from "@/features/chat/conversation/hooks/conversationHook";
import { setSelectedConvId } from "@/features/chat/conversation/store/conversation-slice";
import store, { RootState } from "@/lib/store/store";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveInterface as setGlobalActiveInterface } from "@/features/chat/store/ui-slice"; // Renamed import
import { setSelectedModels } from "@/features/chat/store/chat-interface-slice";

import {
  CONVERSATION_TYPES,
  INTERFACE_TYPES,
} from "@/shared/constants/constants";
import { toast } from "sonner";
import { useModelPreferences } from "@/features/chat/settings/model-preferences/hooks/modelPreferencesHook";
import ChatProtectedRoute from "@/features/chat/auth/components/ChatProtectedRoute";

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
  const { selectedModels } = useSelector((store: any) => store.chatInterface);
  const conversationId = params.conversationId as string;
  const { data, isLoading, error } = useGetConversationById(conversationId);
  const { data: modelPreferences } = useModelPreferences();
  console.log("Error on conversation loading: ", error?.message);

  if (!selectedModels || selectedModels.length === 0) {
    if (modelPreferences && modelPreferences.length > 0) {
      const activePreferences = modelPreferences
        .filter((p: any) => p.isActive)
        .map((p: any) => ({ provider: p.provider, model: p.modelId }));

      if (activePreferences.length > 0) {
        dispatch(setSelectedModels(activePreferences));
      }
    }
  }

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
    <ChatProtectedRoute>
      <HomeContent2 />
    </ChatProtectedRoute>
  );
}
