import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Leaf, Globe, Heart, Send, Bot } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const DEMO_USER_ID = "demo-user-1";

type AgentType = "career" | "lifestyle" | "travel" | "wellness";

interface Agent {
  id: AgentType;
  name: string;
  description: string;
  icon: any;
  gradient: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function AIAgents() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("career");
  const [messageInput, setMessageInput] = useState("");
  const { user } = useAuth();

  const queryClient = useQueryClient();
  
  // Use authenticated user ID instead of demo user
  const userId = user?.id || "demo-user-1";

  const agents: Agent[] = [
    {
      id: "career",
      name: i18n.t("aiAgents.careerNavigator"),
      description: i18n.t("aiAgents.professionalDevelopment"),
      icon: Briefcase,
      gradient: "gradient-primary",
    },
    {
      id: "lifestyle",
      name: i18n.t("aiAgents.lifestyleGuide"),
      description: i18n.t("aiAgents.ethicalConsumption"),
      icon: Leaf,
      gradient: "gradient-accent",
    },
    {
      id: "travel",
      name: i18n.t("aiAgents.travelCurator"),
      description: i18n.t("aiAgents.culturalExperiences"),
      icon: Globe,
      gradient: "gradient-secondary",
    },
    {
      id: "wellness",
      name: i18n.t("aiAgents.wellnessCoach"),
      description: i18n.t("aiAgents.holisticWellbeing"),
      icon: Heart,
      gradient: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
  ];

  const { data: chatData, isLoading } = useQuery({
    queryKey: ["/api/chat", userId, selectedAgent],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!chatData?.session?.id) {
        throw new Error("No chat session available");
      }
      
      const response = await fetch(`/api/chat/${chatData.session.id}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/chat", userId, selectedAgent], data);
      setMessageInput("");
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessageMutation.mutate(messageInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeAgent = agents.find(agent => agent.id === selectedAgent);
  const messages = chatData?.session?.messages || [];

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--cultural-dark)] mb-4">
            {i18n.t("aiAgents.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {i18n.t("aiAgents.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Agent Selection */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[var(--cultural-dark)] mb-4">
                {i18n.t("aiAgents.chooseAgent")}
              </h3>
              
              <div className="space-y-3">
                {agents.map((agent) => (
                  <Button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    variant={selectedAgent === agent.id ? "default" : "outline"}
                    className={`w-full text-left p-4 h-auto ${
                      selectedAgent === agent.id 
                        ? "border-2 border-[var(--cultural-primary)] shadow-sm" 
                        : "border border-gray-200 hover:border-[var(--cultural-accent)]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${agent.gradient} rounded-lg flex items-center justify-center`}>
                        <agent.icon className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[var(--cultural-dark)]">
                          {agent.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border border-gray-200 h-96 flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${activeAgent?.gradient} rounded-lg flex items-center justify-center`}>
                    {activeAgent?.icon && <activeAgent.icon className="text-white" size={20} />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--cultural-dark)]">
                      {activeAgent?.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {i18n.t("aiAgents.specializesIn")} {activeAgent?.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--cultural-accent)] rounded-full"></div>
                  <span className="text-xs text-gray-600">{i18n.t("aiAgents.online")}</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {isLoading ? (
                  <div className="text-center text-gray-500">Loading chat...</div>
                ) : (
                  messages.map((message: Message, index: number) => (
                    <div key={index} className={`flex items-start space-x-3 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}>
                      {message.role === "assistant" && (
                        <div className={`w-8 h-8 ${activeAgent?.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Bot className="text-white" size={16} />
                        </div>
                      )}
                      
                      <div className={`max-w-md p-4 rounded-2xl ${
                        message.role === "user"
                          ? "bg-[var(--cultural-primary)] text-white rounded-tr-sm"
                          : "bg-gray-100 rounded-tl-sm"
                      }`}>
                        <p className={message.role === "user" ? "text-white" : "text-[var(--cultural-dark)]"}>
                          {message.content}
                        </p>
                        <p className={`text-xs mt-2 ${
                          message.role === "user" ? "text-blue-200" : "text-gray-500"
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>

                      {message.role === "user" && (
                        <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">You</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <Input
                    placeholder={`Ask about ${activeAgent?.description}, skill development, or opportunities...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sendMessageMutation.isPending || !messageInput.trim()}
                    className="bg-[var(--cultural-primary)] text-white hover:bg-[var(--cultural-primary)]/90"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
