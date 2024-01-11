//log and edit activities
//on dashboard can have a report on all activity over the past week (total counts, exercise)
//

import ActivityLog from "../components/FeaturePage/Activity/ActivityLog"
import SideNav from "../components/dashboard/sidebar/SideNav"

function Activity(){
    return (
        <div className="App">
            <ActivityLog />
            <SideNav />
        </div>
    )
}

export default Activity