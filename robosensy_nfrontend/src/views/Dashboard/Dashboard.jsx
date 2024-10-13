import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../component/dashboard/Card";
import { dashboardThunk } from "../../redux/thunk/dashboard.js";
import BarGraph from "../../component/dashboard/BarGraph";
import DonutChart from "../../component/dashboard/DonutChart.jsx";
import { Option, Select } from "@material-tailwind/react";

const Dashboard = () => {
  const [filterDashboard, setFilterDashboard] = useState("Daily");

  const dispatch = useDispatch();
  const dashboardData = useSelector((state) => state.dashboardSlice?.dashboardData?.data?.dashboardData);
  useEffect(() => {
    dispatch(dashboardThunk(filterDashboard.toLocaleLowerCase()));
  }, [filterDashboard]);

  return (
    <div className="relative w-full px-6  py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Appointments</h2>
        <div className=" bg-white w-full sm:w-auto mt-4 sm:mt-0">
          <Select label="Filter" color="blue" name="Filter" value={filterDashboard}>
            <Option onClick={() => setFilterDashboard("Daily")} value="Daily">
              Daily
            </Option>
            <Option onClick={() => setFilterDashboard("Weekly")} value="Weekly">
              Weekly
            </Option>
            <Option onClick={() => setFilterDashboard("Monthly")} value="Monthly">
              Monthly
            </Option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2  lg:grid-cols-4 gap-4 p-4">
        {dashboardData &&
          dashboardData.cardData.map((data, i) => {
            return <Card key={i} title={data.title} value={data?.value || 0} className="min-w-0" />;
          })}
      </div>
      <div className="mt-10 flex flex-col  lg:flex-row md:flex-col justify-between h-full">
        <div className="w-full lg:w-2/3 box-border m-auto pl-0 lg:pl-10">
          <BarGraph dashboardData={dashboardData && dashboardData?.barData} />
        </div>
        <div className="w-full lg:w-1/3 box-border m-auto mt-10  pl-0 lg:pl-10">{dashboardData && dashboardData.chartData && <DonutChart dashboardData={dashboardData && dashboardData.chartData} />}</div>
      </div>
    </div>
  );
};

export default Dashboard;
