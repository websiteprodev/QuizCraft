import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { fetchUsersWithScores } from "@/services/quizService";

const ScoreRangeEnum = {
  BEGINNER: 1000,
  FLEDGLING: 2000,
  APPRENTICE: 3000,
  SCHOLAR: 4000,
  VETERAN: 5000,
  PROPHET: 6000,
  EXPERT: 7000,
  GRAND_EXPERT: 8000,
  MASTER: 9000,
  GRAND_MASTER: 10000,
};
const RankTitleEnum = {
  BEGINNER: "Beginner",
  FLEDGLING: "Fledgling",
  APPRENTICE: "Apprentice",
  SCHOLAR: "Scholar",
  VETERAN: "Veteran",
  PROPHET: "Prophet",
  EXPERT: "Expert",
  GRAND_EXPERT: "Grand Expert",
  MASTER: "Master",
  GRAND_MASTER: "Grand Master",
  LEGEND: "Legend",
};

const getRankByPoints = (points) => {
  switch (true) {
    case points <= ScoreRangeEnum.BEGINNER:
      return RankTitleEnum.BEGINNER;
    case points <= ScoreRangeEnum.FLEDGLING:
      return RankTitleEnum.FLEDGLING;
    case points <= ScoreRangeEnum.APPRENTICE:
      return RankTitleEnum.APPRENTICE;
    case points <= ScoreRangeEnum.SCHOLAR:
      return RankTitleEnum.SCHOLAR;
    case points <= ScoreRangeEnum.VETERAN:
      return RankTitleEnum.VETERAN;
    case points <= ScoreRangeEnum.PROPHET:
      return RankTitleEnum.PROPHET;
    case points <= ScoreRangeEnum.EXPERT:
      return RankTitleEnum.EXPERT;
    case points <= ScoreRangeEnum.GRAND_EXPERT:
      return RankTitleEnum.GRAND_EXPERT;
    case points <= ScoreRangeEnum.MASTER:
      return RankTitleEnum.MASTER;
    case points <= ScoreRangeEnum.GRAND_MASTER:
      return RankTitleEnum.GRAND_MASTER;
    default:
      return RankTitleEnum.LEGEND;
  }
};

export function Tables() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await fetchUsersWithScores();
        const sortedUsers = userData.sort((a, b) => b.points - a.points);
        const rankedUsers = sortedUsers.map((user) => ({
          ...user,
          rank: getRankByPoints(user.points),
        }));

        setUsers(rankedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 p-4">
      <Card className="bg-blue-100 dark:bg-gray-800 shadow-lg rounded-lg border border-blue-500">
        <CardHeader
          variant="gradient"
          color="blue"
          className="p-6 bg-gradient-to-r from-blue-500 to-blue-300 dark:bg-gray-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-400 rounded-t-lg"
        >
          <Typography
            variant="h4"
            color="white"
            className="text-3xl font-bold"
          >
            Top Scorers
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr className="bg-blue-300 dark:bg-gray-600 border-b-4 border-blue-500">
                {["Name", "Rank", "Points"].map((header) => (
                  <th
                    key={header}
                    className="py-4 px-6 text-center text-xl font-bold text-gray-800 dark:text-gray-200"
                  >
                    <Typography
                      variant="small"
                      className="uppercase"
                    >
                      {header}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className={`hover:bg-blue-100 dark:hover:bg-gray-500 transition-colors`}>
                    <td className="py-4 px-6">
                      <Typography
                        variant="small"
                        className="text-lg font-semibold text-gray-800 dark:text-gray-300"
                      >
                        {user.firstName} {user.lastName}
                      </Typography>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Typography className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {user.rank}
                      </Typography>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Typography className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {user.points}
                      </Typography>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 px-6 text-center text-gray-500 dark:text-gray-300">
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
