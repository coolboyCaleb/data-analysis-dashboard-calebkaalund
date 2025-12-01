import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DataRow } from '@/types/data';
import { getDataSummary } from '@/utils/dataAnalysis';

interface ChatInterfaceProps {
  data: DataRow[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const ChatInterface = ({ data }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const getMockResponse = async (question: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('average') || lowerQ.includes('mean')) {
      return "Based on your data, the average value appears to be in the mid-range. This suggests a balanced distribution with most values clustering around the center.";
    }
    if (lowerQ.includes('trend') || lowerQ.includes('pattern')) {
      return "I can see an interesting upward trend in your data! There appears to be consistent growth in the later periods, which could indicate improving performance or seasonal effects.";
    }
    if (lowerQ.includes('highest') || lowerQ.includes('maximum') || lowerQ.includes('peak')) {
      return "The highest value in your dataset represents a peak performance period. This could indicate optimal conditions or a particularly successful time period worth studying further.";
    }
    if (lowerQ.includes('lowest') || lowerQ.includes('minimum')) {
      return "The minimum value might represent a challenging period or starting point. Understanding what caused this low point could provide valuable insights for improvement.";
    }
    if (lowerQ.includes('why') || lowerQ.includes('reason')) {
      return "While I can see the patterns in your numbers, determining the 'why' requires domain knowledge. Consider external factors like seasonality, market conditions, or operational changes during those periods.";
    }
    return "That's an interesting question about your data! The patterns I see suggest there are meaningful insights to explore. Could you be more specific about what aspect interests you most?";
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const aiContent = await getMockResponse(currentInput);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble processing your request right now.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col shadow-md">
      <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Data Analysis Assistant
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask questions about your data, request insights, or get help understanding patterns
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages Container - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <p className="font-medium text-lg text-gray-700">Ready to analyze your data!</p>
              <p className="text-sm mt-2 text-gray-500">Try asking:</p>
              <div className="mt-6 space-y-2 text-left max-w-xs mx-auto">
                <button 
                  onClick={() => setInput("Give me a summary of this dataset")}
                  className="w-full text-left bg-white p-3 rounded-lg border hover:border-blue-300 hover:shadow-sm transition-all text-sm text-gray-700"
                >
                  "Give me a summary of this dataset"
                </button>
                <button 
                  onClick={() => setInput("What patterns do you see?")}
                  className="w-full text-left bg-white p-3 rounded-lg border hover:border-blue-300 hover:shadow-sm transition-all text-sm text-gray-700"
                >
                  "What patterns do you see?"
                </button>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                    message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-blue-600'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-2xl p-4 shadow-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white border text-gray-800 rounded-tl-none'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    <div className={`text-[10px] mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border flex items-center justify-center shadow-sm">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-white border text-gray-800 rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">Analyzing data...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your data..."
              className="flex-1 min-h-[50px] max-h-[120px] resize-none focus-visible:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              className="self-end h-[50px] w-[50px] rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
