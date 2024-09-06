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
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">User Table</Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {["Name", "Rank", "Points"].map((header) => (
                  <th key={header} className="border-b border-blue-gray-50 py-3 px-5">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {header}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map((user) => (
                <tr key={user.id}>
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      {user.firstName} {user.lastName}  // Correctly mapping the 'firstName' and 'lastName'
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                      {user.rank}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                      {user.points}
                    </Typography>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="py-3 px-5 text-center">
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
