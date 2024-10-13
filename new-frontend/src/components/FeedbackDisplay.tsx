// FeedbackDisplay.jsx

import React from 'react';
import { ScrollArea } from "./ui/scrollarea";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface FeedbackItem {
  id: number;
  text: string;
}

interface FeedbackDisplayProps {
  feedback?: FeedbackItem[];
}

const exampleFeedback: FeedbackItem[] = [
  { id: 1, text: "Your introduction is strong and engaging. Consider adding a thesis statement to clearly outline your main points." },
  { id: 2, text: "The second paragraph could use more specific examples to support your argument." },
  { id: 3, text: "Your conclusion effectively summarizes your main points, but consider adding a call to action or future implications." },
  { id: 4, text: "Pay attention to your use of transition words between paragraphs to improve the flow of your essay." },
  { id: 5, text: "The language used in the fourth paragraph is particularly vivid and descriptive. Great job!" }
];

export default function FeedbackDisplay({ feedback = exampleFeedback }: FeedbackDisplayProps) {
return (
    <Card className="bg-white rounded-lg shadow-2xl border border-purple-200">
    <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Feedback</CardTitle>
    </CardHeader>
    <CardContent className="p-4">
        <ScrollArea className="max-h-[80vh] overflow-y-auto pr-4">
        {feedback.map((item) => (
            <div key={item.id} className="mb-4 p-3 bg-purple-50 rounded-lg shadow-sm border border-purple-100">
            <p className="text-sm text-gray-700">{item.text}</p>
            </div>
        ))}
        </ScrollArea>
    </CardContent>
    </Card>
);
}
