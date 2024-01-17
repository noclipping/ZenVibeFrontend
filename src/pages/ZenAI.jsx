import SideNav from '../components/dashboard/sidebar/SideNav';
import { useParams } from 'react-router-dom';
import Chatbot from '../components/FeaturePage/Chatbot/chatbot';
import UserProfile from '../components/dashboard/UserProfile/UserProfile';

function ZenAI() {
    const { id: userId } = useParams();


  return (
    <div className="ZenAIPage">
      <SideNav userId={userId}/>
      <div className="ChatbotContainer">
        <Chatbot/> {/* Include your chatbot component here */}
        <UserProfile/>
      </div>
    </div>
  );
}

export default ZenAI;
