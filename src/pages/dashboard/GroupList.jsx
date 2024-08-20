import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import GroupTeacherManagement from "@/pages/dashboard/GroupTeacherManagement";

function GroupList() {
    return (
        <div className="p-6">
            <Typography variant="h4" className="mb-4">Groups</Typography>

            <Card className="p-6 mb-6">
                <Typography variant="h6" className="mb-2">Group 1</Typography>
                <Typography variant="paragraph">Description: This is group 1.</Typography>
                <hr className="my-4" />

                {/* Adding teacher management for Group 1 */}
                <GroupTeacherManagement groupId="group1-id" />
            </Card>

            <Card className="p-6 mb-6">
                <Typography variant="h6" className="mb-2">Group 2</Typography>
                <Typography variant="paragraph">Description: This is group 2.</Typography>
                <hr className="my-4" />

                {/* Adding teacher management for Group 2 */}
                <GroupTeacherManagement groupId="group2-id" />
            </Card>
        </div>
    );
}

export default GroupList;
