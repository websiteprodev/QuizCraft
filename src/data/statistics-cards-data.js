import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
  CheckCircleIcon,
  QueueListIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: UsersIcon,
    title: "Total Users",
    value: "53",
    footer: {
      color: "text-green-500",
      value: "3",
      label: "new users today",
    },
  },
  {
    color: "gray",
    icon: CheckCircleIcon,
    title: "Online Users",
    value: "7",
    footer: {
     
    },
  },
  {
    color: "gray",
    icon: QueueListIcon,
    title: "Total Quizzes",
    value: "",
    footer: {
      color: "text-green-500",
      value: "2",
      label: "new quizzes",
    },
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    title: "My quizzes",
    value: "",
    footer: {
      color: "text-green-500",
      value: "40",
      label: "points.",
    },
  },
];

export default statisticsCardsData;
