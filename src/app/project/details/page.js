"use client";
import {
  fetchProjectDetails,
  updateProjectStatus,
  updateStatus
} from "@/app/store/projectSlice";
import Drawer01 from "@/components/common/Drawer/Drawer01";
import DropdownStatus01 from "@/components/common/Dropdown/DropdownStatus01";
import {
  getStatusDetails,
  statusProject
} from "@/components/common/Helper/Helper";
import useUserData from "@/components/common/Helper/useUserData";
import Loader from "@/components/common/Loader/Loader";
import UserAvatar from "@/components/common/UserAvatar/UserAvatar";
import LayOut from "@/components/LayOut";
import Campaigns from "@/components/pages/Campaigns";
import Collaborations from "@/components/pages/Collaborations";
import SEO from "@/components/pages/SEO";
import SMManagement from "@/components/pages/SMManagement";
import Tasks from "@/components/pages/Tasks";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const TaskList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useUserData()
  const [itemId, setItemId] = useState(null);

  const projectLoading = useSelector((state) => state.project);
  const projectDetailData = useSelector((state) => state?.project?.projectDetails?.data);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setItemId(params.get("id"));
    }
  }, []);

  useEffect(() => {
    if (itemId) {
      dispatch(fetchProjectDetails(itemId));
    }
  }, [dispatch, itemId]);

  const user = {
    name: projectDetailData?.project_name || "",
    isActive: true,
    // image: "",
  };

  const [selectedStatus, setSelectedStatus] = useState("");
  const handleStatusChange = async (value) => {
    const result = await Swal.fire({
      text: `Do you want to update the status of this Project?`,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed && itemId) {
      setSelectedStatus(value);

      // Dispatch updateUserStatus with the new status
      dispatch(updateProjectStatus({ id: itemId, status: value, router }));
    }
  };

  const [selectedSort, setSelectedSort] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  const [isActive, setIsActive] = useState(
    projectDetailData?.project_status || ""
  );


  useEffect(() => {
    if (projectDetailData?.project_status !== undefined) {
      setIsActive(projectDetailData?.project_status);
    }
  }, [projectDetailData]);



  const statusDetails = getStatusDetails(projectDetailData?.status);
  const handleToggleStatus = async (event) => {
    const newStatus = !isActive ? 1 : 0; // Toggle logic: Active (0) → Inactive (1), Inactive (1) → Active (0)

    const result = await Swal.fire({
      text: `Do you want to ${newStatus === 1 ? "Active" : "Inactive"
        } this Project?`,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed && itemId) {
      setIsActive(!isActive); // Update local state immediately

      // Dispatch updateUserStatus with the new status
      dispatch(updateStatus({ id: itemId, project_status: newStatus, router }));
    }
  };

  const isActive2 = projectDetailData?.project_status == 1 ? true : false

  const [active, setActive] = useState(0);

  const categories = [
    "Tasks",
    "Social Media Management",
    "Campaigns",
    "SEO",
    "Collaborations",
  ];
console.log("itemId", itemId)
  const renderComponent = () => {
    switch (active) {
      case 0:
        return <Tasks itemId={itemId}/>;
      case 1:
        return <SMManagement itemId={itemId} />;
      case 2:
        return <Campaigns itemId={itemId} />;
      case 3:
        return <SEO itemId={itemId} />;
      case 4:
        return <Collaborations itemId={itemId} />;
      default:
        return <Tasks itemId={itemId} />; // Fallback
    }
  };
  return (
    <>
      {projectLoading?.loading ? (
        <Loader />
      ) : (
        <LayOut>
          <div className="w-full  h-full mx-auto px-1  sm:px-4  ml-[5px]  ">
            <div className=" min-[1250px]:flex   justify-between mt-[10px] sm:p-4 w-full">
              {/* Avatar Section */}
              <div className="  sm:w-full h-[69px] flex items-center gap-[12.21px] ">
                <UserAvatar name={projectDetailData?.project_name} size={54} isActive={isActive2} />

                <div className="text-xl text-gray-700">
                  <p className="font-bold text-[14px] sm:text-[18px]">
                    {projectDetailData?.project_name || ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {projectDetailData?.client?.name || ""}
                  </p>
                </div>
                {/* <p className={`font-[400] text-[12px] leading-[16.8px] border rounded flex items-center justify-center ${projectDetailData?.status === 'To Do'
                ? 'text-[#6C757D] border-[#6C757D]  w-[50px] h-[20px]'
                : projectDetailData?.status === 'In Progress' ?
                  'text-[#CA9700] border-[#CA9700]  w-[90px] h-[20px]' : projectDetailData?.status === 'Completed' ? 'text-[#008053] border-[#008053]  w-[90px] h-[20px]' : 'text-[#0D4FA7] border-[#0D4FA7]  w-[90px] h-[20px]'
                }`}>
                {projectDetailData?.status}
              </p> */}
                <DropdownStatus01
                  options={statusProject}
                  selectedValue={projectDetailData?.status}
                  onSelect={(value) => handleStatusChange(value)}
                  label="Status"
                  className="w-[150px]"
                />
              </div>
              <div className="flex max-[850px]:flex-col justify-between gap-5 md:gap-10 lg:gap-4 max-[1250px]:mt-4">


                <div className="sm:flex items-center gap-2">
                  <div className="flex items-center mr-2">
                    <label className="flex items-center cursor-pointer">
                      <span className="ml-2 text-[15px] mr-2">
                        {!isActive ? "Inactive" : "Active"}
                      </span>

                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          defaultChecked={isActive}
                          onChange={userData?.is_client === 0 ? handleToggleStatus : undefined}
                        />
                        {/* Track */}
                        <div
                          className={`w-[70px] h-[40px] rounded-full shadow- transition duration-300 ease-in-out bg-[#ECE4FF]`}></div>
                        <div
                          className={`absolute w-[33px] h-[33px] rounded-full shadow-md top-[4px] left-[4px] transition-transform duration-300 ease-in-out ${isActive
                            ? "translate-x-7 bg-[#048339]"
                            : "bg-[#E23703]"
                            }`}>
                          {isActive == "0" && (
                            <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                              <Check size={16} />
                            </span>
                          )}
                          {isActive == "1" && (
                            <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                              <X size={16} />
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                  <button
                    className="w-[140px] mt-3 sm:mt-0 h-[35px] text-[10px] rounded-[4px] py-[4px] border border-gray-400 text-black text-lg mr-[10px] mb-2 hover:bg-black hover:text-white"
                    onClick={() => setIsDrawerOpen(true)}>
                    See All Details
                  </button>
                  <button
                    onClick={() => router.push(`/project/add?id=${itemId}`)}
                    className="w-[80px] h-[35px] rounded-[4px] py-[4px] bg-black text-white text-lg mr-[10px] mb-2">
                    Edit
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-[570px] h-[50px]  border rounded-lg px-4 py-2 border-gray-100 shadow-sm">
              {categories.map((category, index) => (
                <p
                  key={index}
                  className={` flex items-center justify-center  cursor-pointer 
          ${active === index
                      ? "bg-blue-50 text-gray-800 border-blue-400 px-4 py-4 rounded-[10px] "
                      : "text-gray-500"
                    }`}
                  onClick={() => setActive(index)}
                >
                  {category}
                </p>
              ))}
            </div>
            {renderComponent()}
          </div>
          <Drawer01
            isOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            details={projectDetailData}
            itemId={itemId}
            setSelectedStatus={setSelectedStatus}
          />

        </LayOut>
      )}
    </>
  );
};

export default TaskList;
