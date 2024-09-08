import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import GroupTeacherManagement from "@/pages/dashboard/GroupTeacherManagement";

function GroupList() {
    return (
        <div className="p-6 dark:bg-gray-900">
            <Typography variant="h4" className="mb-4 dark:text-gray-100">Groups</Typography>

            <Card className="p-6 mb-6 dark:bg-gray-800 dark:text-gray-100 dark:shadow-none">
                <Typography variant="h6" className="mb-2 dark:text-gray-100">Group 1</Typography>
                <Typography variant="paragraph" className="dark:text-gray-300">
                    Description: This is group 1.
                </Typography>
                <hr className="my-4 dark:border-gray-600" />

                {/* Adding teacher management for Group 1 */}
                <div className="dark:bg-gray-700 p-4 rounded-lg">
                    <GroupTeacherManagement groupId="group1-id" />
                </div>
            </Card>

            <Card className="p-6 mb-6 dark:bg-gray-800 dark:text-gray-100 dark:shadow-none">
                <Typography variant="h6" className="mb-2 dark:text-gray-100">Group 2</Typography>
                <Typography variant="paragraph" className="dark:text-gray-300">
                    Description: This is group 2.
                </Typography>
                <hr className="my-4 dark:border-gray-600" />

                {/* Adding teacher management for Group 2 */}
                <div className="dark:bg-gray-700 p-4 rounded-lg">
                    <GroupTeacherManagement groupId="group2-id" />
                </div>
            </Card>
        </div>
    );
}

export default GroupList;
