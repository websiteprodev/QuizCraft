import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/configs/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import statisticsCardsData from "@/data/statistics-cards-data";
import {
  ArrowDownRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ScaleIcon,
} from "@heroicons/react/24/solid";
import RankProgress from "@/components/RankProgress";
import { useAuth } from "@/pages/auth/AuthContext";
import { fetchQuizzes, fetchUserRankAndProgress, fetchUserScores } from "@/services/quizService";
export function Home() {
  const { user } = useAuth();
  const [localStatsData, setLocalStatsData] = useState(statisticsCardsData);
  const [quizzes, setQuizzes] = useState([]);
  const [quizzesCount, setQuizzesCount] = useState(0);
  const [myQuizzesCount, setMyQuizzesCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 6;
  const navigate = useNavigate();
  const [quizzesTaken, setQuizzesTaken] = useState([]);
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
      const quizzesList = quizzesSnapshot.docs.map((doc) => ({
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
      } else if (card.title === "Total Users") {
        return { ...card, value: totalUsers.toString() };
      }
      return card;
    });

    setLocalStatsData(updatedStats);
  }, [quizzesCount, myQuizzesCount, totalUsers]);

  useEffect(() => {
    const fetchMyResults = async () => {
      if (user && user.uid) {
        const scores = await fetchUserScores(user.uid); // Assuming you have a function to fetch user scores
        setQuizzesTaken(scores);
        const progress = await fetchUserRankAndProgress(user.username);
        setUserProgress(progress);
      }
    };
    fetchMyResults();
  }, [user]);

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

  const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
            <Typography className="font-normal text-blue-gray-600 dark:text-gray-300">
              <strong className={footer.color}>{footer.value}</strong>
              &nbsp;{footer.label}
            </Typography>
          )
        }
      />
    ))}
  </div>
  <div className="mb-12">
    <RankProgress />
  </div>

  {/* Main Grid for Quizzes and My Results */}
  <div className="grid grid-cols-[2fr,1fr] gap-6">
    {/* Quizzes Section */}
    <Card className="border border-blue-gray-100 dark:border-gray-700 shadow-sm dark:bg-gray-800">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 flex items-center justify-between p-6 dark:bg-gray-800 dark:text-gray-100"
      >
        <div>
          <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-gray-100">
            Quizzes
          </Typography>
          <Typography
            variant="small"
            className="flex items-center gap-1 font-normal text-blue-gray-600 dark:text-gray-300"
          >
            <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200 dark:text-gray-400" />
            <strong>{quizzes.length} new</strong> this month
          </Typography>
        </div>
        <Menu placement="left-start">
          <MenuHandler>
            <IconButton size="sm" variant="text" color="blue-gray">
              <EllipsisVerticalIcon
                strokeWidth={3}
                fill="currenColor"
                className="h-6 w-6 dark:text-gray-100"
              />
            </IconButton>
          </MenuHandler>
          <MenuList className="dark:bg-gray-800 dark:text-gray-100">
            <MenuItem>Action</MenuItem>
            <MenuItem>Another Action</MenuItem>
            <MenuItem>Something else here</MenuItem>
          </MenuList>
        </Menu>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 dark:bg-gray-800">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {["Quizzes", "Category", "Total Questions", "Date", "Action"].map((el) => (
                <th key={el} className="border-b border-blue-gray-50 dark:border-gray-700 py-3 px-6 text-left">
                  <Typography
                    variant="small"
                    className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400"
                  >
                    {el}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentQuizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td className="border-b border-blue-gray-50 dark:border-gray-700 py-3 px-6">
                  <Typography
                    variant="small"
                    color="gray"
                    className="font-medium dark:text-blue-200"
                  >
                    {quiz.title}
                  </Typography>
                </td>
                <td className="border-b border-blue-gray-50 dark:border-gray-700 py-3 px-6">
                  <Typography
                    variant="small"
                    color="gray"
                    className="font-medium dark:text-blue-200"
                  >
                    {quiz.category}
                  </Typography>
                </td>
                <td className="border-b border-blue-gray-50 dark:border-gray-700 py-3 px-6">
                  <Typography
                    variant="small"
                    color="gray"
                    className="font-medium dark:text-blue-200"
                  >
                    {quiz.numberOfQuestions}
                  </Typography>
                </td>
                <td className="border-b border-blue-gray-50 dark:border-gray-700 py-3 px-6">
                  <Typography
                    variant="small"
                    color="gray"
                    className="font-medium dark:text-blue-200"
                  >
                    {new Date(quiz.createdAt.seconds * 1000).toLocaleDateString()}
                  </Typography>
                </td>
                <td className="border-b border-blue-gray-50 dark:border-gray-700 py-3 px-6">
                  <Button
                    variant="gradient"
                    color="green"
                    onClick={() => navigate(`/dashboard/quiz/${quiz.id}`)}
                  >
                    <PlayIcon
                      stroke="white"
                      fill="white"
                      strokeWidth={2}
                      className="h-3 w-3"
                    />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4 dark:bg-gray-800">
          <Button
            variant="text"
            color="blue-gray"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4 text-black-500 dark:text-gray-300" />
          </Button>
          <Typography variant="small" className="dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="text"
            color="blue-gray"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4 text-black-500 dark:text-gray-300" />
          </Button>
        </div>
      </CardBody>
    </Card>

    {/* My Results Section */}
    <Card className="border border-blue-gray-100 dark:border-gray-700 shadow-sm dark:bg-gray-800">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 flex items-center justify-between p-6 dark:bg-gray-800 dark:text-gray-100"
      >
        <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-gray-100">
          My Results
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 dark:bg-gray-800">
        {quizzesTaken.length > 0 ? (
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Quiz Title", "Score", "Total Points"].map((header) => (
                  <th key={header} className="border-b border-blue-gray-50 dark:border-gray-700 py-3 px-6 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400"
                    >
                      {header}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quizzesTaken.map((quiz) => (
                <tr key={quiz.quizId}>
                  <td className="border-b border-blue-gray-50 dark:border-gray-700 py-3 px-6">
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-medium dark:text-blue-200"
                    >
                      {quiz.title}
                    </Typography>
                  </td>
                  <td className="border-b border-blue-gray-50 dark:border-gray-700 py-3 px-6">
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-medium dark:text-blue-200"
                    >
                      {quiz.score}
                    </Typography>
                  </td>
                  <td className="border-b border-blue-gray-50 dark:border-gray-700 py-3 px-6">
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-medium dark:text-blue-200"
                    >
                      {quiz.totalPoints}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Typography variant="paragraph" className="text-gray-600 dark:text-gray-400">
            No quizzes taken yet.
          </Typography>
        )}
      </CardBody>
    </Card>
  </div>
</div>

  );
}

export default Home;
