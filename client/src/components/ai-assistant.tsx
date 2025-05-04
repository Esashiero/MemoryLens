import { useState } from "react";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function AiAssistant() {
  const [question, setQuestion] = useState("");
  const queryClient = new QueryClient();

  const { data: conversation, isLoading } = useQuery<AiMessage[]>({
    queryKey: ['/api/ai/conversation'],
  });

  const mutation = useMutation({
    mutationFn: async (question: string) => {
      return await apiRequest("POST", "/api/ai/question", { question });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/conversation'] });
      setQuestion("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      mutation.mutate(question);
    }
  };

  const suggestionQuestions = [
    "What files did I work on yesterday?",
    "Show my browser history from Monday",
    "Summarize my activities this week"
  ];

  const handleSuggestion = (suggestion: string) => {
    setQuestion(suggestion);
    mutation.mutate(suggestion);
  };

  return (
    <Card className="border-none shadow-md mb-8">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center text-white mr-4">
            <span className="material-icons">psychology</span>
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-secondary-900 dark:text-white">AI Assistant</h2>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Ask specific questions about your activities and get personalized insights.
            </p>
          </div>
        </div>
        
        <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4 mb-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-secondary-200 dark:bg-secondary-700 mr-3 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-20 mb-2"></div>
                  <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-full"></div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-secondary-200 dark:bg-secondary-700 mr-3 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-5/6 mb-2"></div>
                  <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          ) : conversation && conversation.length > 0 ? (
            conversation.map((message, index) => (
              <div key={index} className="flex items-start mt-4 first:mt-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-secondary-300 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300' 
                    : 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                }`}>
                  <span className="material-icons text-sm">
                    {message.role === 'user' ? 'person' : 'psychology'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-secondary-900 dark:text-white font-medium mb-1">
                    {message.role === 'user' ? 'You' : 'MemoryAI'}
                  </p>
                  <div className="text-sm text-secondary-700 dark:text-secondary-300 space-y-2">
                    {message.content.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                  
                  {message.role === 'assistant' && message.actions && (
                    <div className="flex mt-3 space-x-2">
                      {message.actions.map((action, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="inline-flex items-center rounded-lg text-xs font-medium bg-white dark:bg-secondary-800"
                        >
                          <span className="material-icons text-xs mr-1">{action.icon}</span>
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center p-4 text-secondary-500 dark:text-secondary-400">
              <span>Ask me anything about your digital activities</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask something about your activities, files, or browsing history..."
              className="w-full pl-4 pr-12 py-6 border-secondary-200 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white rounded-lg"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={mutation.isPending}
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 disabled:opacity-50"
              disabled={mutation.isPending || !question.trim()}
            >
              <span className="material-icons">send</span>
            </button>
          </div>
        </form>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestionQuestions.map((suggestion, index) => (
            <Button
              key={index}
              type="button"
              variant="outline"
              size="sm"
              className={`inline-flex items-center rounded-lg text-xs font-medium ${
                index === 0 
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                  : 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300'
              }`}
              onClick={() => handleSuggestion(suggestion)}
              disabled={mutation.isPending}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
