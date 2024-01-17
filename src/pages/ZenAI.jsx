import SideNav from '../components/dashboard/sidebar/SideNav';
import { useParams } from 'react-router-dom';
import Chatbot from '../components/FeaturePage/Chatbot/chatbot';

function ZenAI() {
    const { id: userId } = useParams();


  return (
    <div className="ZenAIPage">
      <SideNav userId={userId}/>
      <div className="ChatbotContainer">
        <Chatbot/> {/* Include your chatbot component here */}
      </div>
    </div>
  );
}

export default ZenAI;
