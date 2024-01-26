import { useParams } from "react-router-dom";
import FoodLog from "../components/FeaturePage/Food/FoodLog";
import SideNav from "../components/dashboard/sidebar/SideNav";

function FoodPage(){
    const { id } = useParams()

    return (
        <div className="App">
            <FoodLog />
            <SideNav />
        </div>
    )
}

export default FoodPage