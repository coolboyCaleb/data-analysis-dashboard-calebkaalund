import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Bot, User, Send } from 'lucide-react';

const MockAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
   const getMockResponse = async (question) => {
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

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    try {
      const aiResponse = await getMockResponse(currentInput);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "Sorry, I'm having trouble processing your request right now. Please try again!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Data Assistant (Mock)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {}
      </CardContent>
    </Card>
  );
};

export default MockAIChat;