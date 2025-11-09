import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./FeedbackDisplay.css";

export default function FeedbackDisplay({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="feedback-display">
      <h2 className="feedback-title">🤖 AI 사고 피드백</h2>

      <div className="feedback-markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {feedback}
        </ReactMarkdown>
      </div>
    </div>
  );
}
