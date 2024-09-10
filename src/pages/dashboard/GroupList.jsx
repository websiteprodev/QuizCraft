import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import GroupTeacherManagement from "@/pages/dashboard/GroupTeacherManagement";

function GroupList() {
    return (
        <div className="p-6 dark:bg-gray-900">
            <Typography variant="h4" className="mb-4 text-blue-700 dark:text-yellow-300 font-bold">
                Groups
            </Typography>

            <Card className="p-6 mb-6 bg-blue-100 dark:bg-gray-800 shadow-lg rounded-lg">
                <Typography variant="h6" className="mb-2 text-green-700 dark:text-green-300 font-semibold">
                    Group 1
                </Typography>
                <Typography variant="paragraph" className="text-gray-700 dark:text-gray-300">
                    Description: This is group 1.
                </Typography>
                <hr className="my-4 border-gray-300 dark:border-gray-600" />

                {/* Adding teacher management for Group 1 */}
                <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <GroupTeacherManagement groupId="group1-id" />
                </div>
            </Card>

            <Card className="p-6 mb-6 bg-yellow-100 dark:bg-gray-800 shadow-lg rounded-lg">
                <Typography variant="h6" className="mb-2 text-blue-700 dark:text-blue-300 font-semibold">
                    Group 2
                </Typography>
                <Typography variant="paragraph" className="text-gray-700 dark:text-gray-300">
                    Description: This is group 2.
                </Typography>
                <hr className="my-4 border-gray-300 dark:border-gray-600" />

                {/* Adding teacher management for Group 2 */}
                <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <GroupTeacherManagement groupId="group2-id" />
                </div>
            </Card>
        </div>
    );
}

export default GroupList;
