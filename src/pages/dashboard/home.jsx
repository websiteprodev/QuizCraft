import React, { useEffect, useState } from "react";
import { Typography, Card, CardHeader, CardBody, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/configs/firebase";
import { onAuthStateChanged } from "firebase/auth";
import statisticsCardsData from "@/data/statistics-cards-data";
import { ScaleIcon } from "@heroicons/react/24/solid";

export function Home() {
  const [localStatsData, setLocalStatsData] = useState(statisticsCardsData);
  const [quizzes, setQuizzes] = useState([]);
  const [quizzesCount, setQuizzesCount] = useState(0);
  const [myQuizzesCount, setMyQuizzesCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
      const quizzesList = quizzesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setQuizzes(quizzesList);
      setQuizzesCount(quizzesList.length); 
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersCount = usersSnapshot.size;

      setTotalUsers(usersCount);
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchMyQuizzesCount = async (uid) => {
      const quizzesRef = collection(db, "quizzes");
      const q = query(quizzesRef, where("createdBy", "==", uid));
      const querySnapshot = await getDocs(q);
      setMyQuizzesCount(querySnapshot.size); 
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMyQuizzesCount(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updatedStats = localStatsData.map((card) => {
      if (card.title === "Total Quizzes") {
        return { ...card, value: quizzesCount.toString() };
      } else if (card.title === "My quizzes") {
        return { ...card, value: myQuizzesCount.toString() };
      } else if (card.title ==="Total Users"){
        return { ...card, value: totalUsers.toString()}
      }
      return card;
    });

    setLocalStatsData(updatedStats);
  }, [quizzesCount, myQuizzesCount, totalUsers]);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {localStatsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              footer && (
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={footer.color}>{footer.value}</strong>
                  &nbsp;{footer.label}
                </Typography>
              )
            }
          />
        ))}
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Quizzes
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>{quizzes.length} new</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Quizzes", "Category", "Total Questions", "Date"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-6 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td className="border-b border-blue-gray-50 py-3 px-6">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {quiz.title}
                      </Typography>
                    </td>
                    <td className="border-b border-blue-gray-50 py-3 px-6">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {quiz.category}
                      </Typography>
                    </td>
                    <td className="border-b border-blue-gray-50 py-3 px-6">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {quiz.numberOfQuestions}
                      </Typography>
                    </td>
                    <td className="border-b border-blue-gray-50 py-3 px-6">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {new Date(quiz.createdAt.seconds * 1000).toLocaleDateString()}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Leaderboard
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ScaleIcon
                strokeWidth={2}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>Your ranking is:</strong> user.ranking
            </Typography>
          </CardHeader>
          
        </Card>
      </div>
    </div>
  );
}

export default Home;