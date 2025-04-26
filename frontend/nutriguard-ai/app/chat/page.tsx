"use client";

import { useState } from "react";
import { getUserId } from "@/lib/auth";
import { queryMealInsights, ingestMealData } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, Globe } from "lucide-react";

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
  source: string | null;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your NutriGuard AI assistant. Ask me anything about your meals, ingredients, or dietary habits.",
      source: "knowledge-base",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userId = getUserId();
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-muted-foreground">
              You need to be logged in to use the Nutrition Assistant Chat.
              Please log in from the Journal tab.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const popularTopics = [
    "What were my highest protein meals this week?",
    "How can I improve my fiber intake based on my meals?",
    "Which meals had the most calories?",
    "Am I eating enough healthy fats?",
    "What patterns can you find in my breakfast choices?",
  ];

  const healthTrends = [
    "Mediterranean Diet",
    "Low Carb",
    "High Protein",
    "Plant-Based",
    "Intermittent Fasting",
    "DASH Diet",
    "Keto-Friendly",
    "Anti-Inflammatory Foods",
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userId = getUserId();
    if (!userId) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: input, source: null },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      await ingestMealData(userId);
      const res = await queryMealInsights(userId, input);
      const answer =
        (res.data as { results?: { answer?: string } })?.results?.answer ??
        "No response received.";

      setMessages([
        ...newMessages,
        { role: "assistant", content: answer, source: "knowledge-base" },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Sorry, I wasn't able to answer that based on your meals. Try rephrasing or ask something else!",
          source: "web-search",
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div className="bg-accent/30 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary">
            Nutrition Assistant Chat
          </h1>
          <p className="text-muted-foreground">
            Ask questions about your logged meals, ingredients, or nutrients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <span className="font-medium">AI</span>
                  </div>
                  <div>
                    <h2 className="font-medium">AI Nutritionist</h2>
                    <p className="text-xs text-muted-foreground">
                      Powered by NutriGuard AI
                    </p>
                  </div>
                </div>
                <p className="text-sm">
                  I'm here to answer your nutrition questions and provide
                  personalized advice based on your meal logs and data.
                </p>
              </CardContent>
            </Card>

            <div className="bg-background rounded-lg border shadow-sm p-4 mb-4 h-[500px] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.source && (
                      <div className="mt-1 flex items-center text-xs text-muted-foreground">
                        {message.source === "knowledge-base" ? (
                          <>
                            <Bot className="mr-1 h-3 w-3" />
                            <span>
                              From NutriGuard Meal Tracking Knowledge Base
                            </span>
                          </>
                        ) : (
                          <>
                            <Globe className="mr-1 h-3 w-3" />
                            <span>From web search</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-secondary text-secondary-foreground">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Type your nutrition question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground mt-2 text-center">
              The AI provides general nutrition insights and is not a substitute
              for professional medical advice.
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">📌 Popular Topics</h3>
                <div className="space-y-2">
                  {popularTopics.map((topic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-2 px-3 font-normal whitespace-normal break-words"
                      onClick={() => setInput(topic)}
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Health Trends</h3>
                  <Button variant="link" className="text-xs p-0 h-auto">
                    Explore
                  </Button>
                </div>
                <div className="space-y-2">
                  {healthTrends.map((trend, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-2 px-3 font-normal"
                      onClick={() =>
                        setInput(`What does the ${trend} mean for my meals?`)
                      }
                    >
                      {trend}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
