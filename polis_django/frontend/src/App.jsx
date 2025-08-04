import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import TopicList from "./TopicList";
import TopicDetail from "./TopicDetail";
import CreateTopicForm from "./CreateTopicForm";
import AddStatementPage from "./AddStatementPage";
import AddStatementsBulkPage from "./AddStatementsBulkPage ";
import ResultsPage from "./ResultsPage";

// cookie for anonymous voting
import Cookies from "js-cookie";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // install with `npm install uuid`
import Vote from './Vote';

function App() {

  // cookie for anonymous voting
  useEffect(() => {
    let userId = Cookies.get("userId");
    if (!userId) {
      userId = uuidv4(); // Zufällige ID generieren
      Cookies.set("userId", userId, { expires: 365 }); // 1 Jahr gültig
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topics" element={<TopicList />} />
        <Route path="/topics/create" element={<CreateTopicForm />} />
        <Route path="/topics/:id" element={<TopicDetail />} />
        <Route path="/topics/:topicId/add-statement" element={<AddStatementPage />} />
        <Route path="/topics/:topicId/statements/bulk" element={<AddStatementsBulkPage />} />
        <Route path="/topics/:topicId/vote" element={<Vote />} />
        <Route path="/topics/:topicId/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
