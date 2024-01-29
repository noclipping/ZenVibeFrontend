import { useParams } from "react-router-dom";
import FoodLog from "../components/FeaturePage/Food/FoodLog";
import SideNav from "../components/dashboard/sidebar/SideNav";

function FoodPage(){
    const { id: userId } = useParams()

    return (
        <div className="App">
            <FoodLog showInputs={true} />
            <SideNav userId={userId}  />
        </div>
    )
}

export default FoodPage