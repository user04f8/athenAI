// FeedbackDisplay.jsx

import { ScrollArea } from "./ui/scrollarea";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { FeedbackItem } from './types';

interface FeedbackDisplayProps {
  feedback: FeedbackItem[];
}

export default function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  return (
    <Card className="bg-white rounded-lg shadow-2xl border border-purple-200 mr-7">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Feedback</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="max-h-[80vh] overflow-y-auto pr-4">
          {feedback.map((item, index) => (
            <div
              key={item.id}
              className={`mb-4 p-3 rounded-lg shadow-sm border border-purple-100 ${
                index % 2 === 0 ? 'bg-purple-50' : 'bg-blue-50'
              }`}
            >
              <p className="text-sm text-gray-700">{item.text}</p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
