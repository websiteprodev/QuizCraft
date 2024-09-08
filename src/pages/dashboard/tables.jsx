import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { fetchUsersWithScores } from "@/services/quizService";

export function Tables() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const userData = await fetchUsersWithScores();
            console.log("Fetched Users:", userData); 
            setUsers(userData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    fetchUsers();
}, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="dark:bg-gray-800">
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 dark:bg-gray-700">
          <Typography variant="h6" color="white" className="dark:text-gray-100">User Table</Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {["Name", "Rank", "Points"].map((header) => (
                  <th key={header} className="border-b border-blue-gray-50 py-3 px-5 dark:border-gray-600">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400 dark:text-gray-300">
                      {header}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map((user) => (
                <tr key={user.id} className="dark:bg-gray-800">
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                      {user.firstName} {user.lastName} 
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-300">
                      {user.rank}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-300">
                      {user.points}  
                    </Typography>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="py-3 px-5 text-center dark:text-gray-300">
                    No users available.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
