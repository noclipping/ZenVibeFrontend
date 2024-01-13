// WeightGoal.jsx
import { useParams } from 'react-router-dom';
import WeightLog from '../components/FeaturePage/WeightLog/WeightLog';
import SideNav from '../components/dashboard/sidebar/SideNav';
import UserProfile from '../components/dashboard/UserProfile/UserProfile';

function WeightGoal() {
  const { id: userId } = useParams();

  return (
    <div className="App">
      <WeightLog showInputs={true} />
      <SideNav userId={userId} />
      <UserProfile />
    </div>
  );
}

export default WeightGoal;
