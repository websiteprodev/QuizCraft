import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { authorsTableData } from "@/data";

export function Tables() {
  const navigate = useNavigate();

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Authors Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {["Author", "Function", "Status", "Employed", ""].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
  {authorsTableData && authorsTableData.length > 0 ? (
    authorsTableData.map(
      ({ id, img, name, email, job, online, date }, index) => {
        const isLast = index === authorsTableData.length - 1;
        const className = `py-3 px-5 ${!isLast ? "border-b border-blue-gray-50" : ""}`;

        return (
          <tr key={id || index}>
            <td className={className}>
              <div className="flex items-center gap-4">
                <Avatar src={img} alt={name} size="sm" variant="rounded" />
                <div>
                  <Typography variant="small" color="blue-gray" className="font-semibold">
                    {name}
                  </Typography>
                  <Typography className="text-xs font-normal text-blue-gray-500">
                    {email}
                  </Typography>
                </div>
              </div>
            </td>
            <td className={className}>
              <Typography className="text-xs font-semibold text-blue-gray-600">
                {job[0]}
              </Typography>
              <Typography className="text-xs font-normal text-blue-gray-500">
                {job[1]}
              </Typography>
            </td>
            <td className={className}>
              <Chip
                variant="gradient"
                color={online ? "green" : "blue-gray"}
                value={online ? "Online" : "Offline"}
                className="py-0.5 px-2 text-[11px] font-medium w-fit"
              />
            </td>
            <td className={className}>
              <Typography className="text-xs font-semibold text-blue-gray-600">
                {date}
              </Typography>
            </td>
            <td className={className}>
              <Typography
                as="a"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/admin/test-management/edit/${id}`);
                }}
                className="text-xs font-semibold text-blue-500 hover:underline"
              >
                Edit
              </Typography>
            </td>
          </tr>
        );
      }
    )
  ) : (
    <tr>
      <td colSpan="5" className="py-3 px-5 text-center">
        No data available.
      </td>
    </tr>
  )}
</tbody>

          </table>
        </CardBody>
      </Card>
      {/* Можете да добавите други таблици тук */}
    </div>
  );
}

export default Tables;
