"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, CircleX, X } from "lucide-react";
import { OtherIcons } from "@/assests/icons";
import AttachmentPreview from "../Attachments/AttachmentPreview";
import DropdownStatus01 from "../Dropdown/DropdownStatus01";
import CommentBox from "../CommentBox/CommentBox";
import { formatDate, getPlatformIcons, statusProject } from "../Helper/Helper";
import {
  fetchProjectTaskDetails,
  updateProjectStatus,
  updateProjectTaskStatus,
  updateStatus,
  updateTaskStatus,
} from "@/app/store/projectSlice";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import useUserData from "../Helper/useUserData";

const DrawerSM = ({
  isOpen,
  setIsDrawerOpen,
  details,
  itemId,
  setSelectedStatus,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useUserData()
  const documents = details?.media_upload ? JSON.parse(details?.media_upload) : []
  const [isActive, setIsActive] = useState(details?.project_status || "");
  const [isActive2, setIsActive2] = useState(details?.status || "");

  useEffect(() => {
    if (details?.project_status !== undefined) {
      setIsActive(details?.project_status);
    }
  }, [details]);
  useEffect(() => {
    if (details?.status !== undefined) {
      setIsActive2(details?.status);
    }
  }, [details]);

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

  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-[456px] bg-white shadow-lg z-50 drawer-scrollbar">
      <div className="p-2 flex justify-end items-center">
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="text-gray-700 hover:text-black">
          <CircleX size={30} strokeWidth={1.5} />
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-full ">
        <div className="flex justify-between">
          <div className="w-full h-[69px] flex items-center justify-between ">
            <div className="text-xl text-gray-700 ">
              <p className="font-bold">{details?.brand_name || ""}</p>
              <p className="text-xs text-gray-500">
                {details?.post_type || ""}
              </p>
            </div>
            <span
              className={`px-3 py-1 border rounded-md inline-block text-[12px] h-[25px]
        ${details?.approval_status === "To Do"
                  ? "text-[#6C757D] border-[#6C757D]"
                  : details?.approval_status === "In progress"
                    ? "text-[#CA9700] border-[#CA9700]"
                    : details?.approval_status === "Completed"
                      ? "text-[#008053] border-[#008053]"
                      : "text-[#0D4FA7] border-[#0D4FA7]"
                }`}
            >
              {details?.approval_status}
            </span>
          </div>
          {/* <div>
                        <button className="w-[100px] h-[35px] rounded-[4px] py-[4px] bg-black text-white text-[16px] mb-2 p-4 mt-4">
                            Edit
                        </button>
                    </div> */}
        </div>
        {/* <div className="flex justify-end">
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
                <div
                  className={`w-[70px] h-[40px] rounded-full shadow- transition duration-300 ease-in-out bg-[#ECE4FF]`}
                >

                </div>
                <div
                  className={`absolute w-[33px] h-[33px] rounded-full shadow-md top-[4px] left-[4px] transition-transform duration-300 ease-in-out ${isActive ? 'translate-x-7 bg-[#048339]' : 'bg-[#E23703]'
                    }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                      <Check size={16} />
                    </span>
                  )}
                  {!isActive && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                      <X size={16} />
                    </span>
                  )}
                </div>
              </div>
            </label>
          </div>
        </div> */}
        {/* Project Details Section */}
        <div className="mb-4 mt-4 ml-[5px]">
          <p className="text-xl leading-6">Post Details</p>
          <ul className=" h-[22px] mt-[20px] ">
            <li className="flex mb-2 gap-4">
              <span className="text-gray-400 w-[120px] text-[14px]">
                Post ID
              </span>
              <h4>:</h4>
              <span className="text-gray-700 w-[200px] text-[14px]">
                {details?.post_id || ""}
              </span>
            </li>
            <li className="flex mb-2 gap-4">
              <span className="text-gray-400 w-[120px] text-[14px]">
                Platform
              </span>
              <h4>:</h4>
              <span className="text-gray-700 w-[200px] text-[14px] flex flex-row ">
                {getPlatformIcons(details?.platform)}

              </span>
            </li>
            <li className="flex mb-2 gap-4">
              <span className="text-gray-400 w-[120px] text-[14px]">
                Post Type
              </span>
              <h4>:</h4>
              <span className="text-gray-700 w-[200px] text-[14px]">
                {details?.post_type || ""}
              </span>
            </li>
            <li className="flex mb-2 gap-4">
              <span className="text-gray-400 w-[120px] text-[14px]">
                Scheduled Date
              </span>
              <h4>:</h4>
              <span className="text-gray-700 w-[200px] text-[14px]">
                                        {details?.scheduled_date ? formatDate(details?.scheduled_date) :"" || ""}
                
              </span>
            </li>
            {/* <li className="flex mb-2 gap-4">
              <span className="text-gray-400 w-[120px] text-[14px]">
                Created By
              </span>
              <h4>:</h4>
              <span className="text-gray-700 w-[200px] text-[14px]">
                {details?.created_by || ""}
              </span>
            </li> */}
            <li className="flex mb-2 gap-4">
              <span className="text-gray-400 w-[120px] text-[14px]">
                Approval Status
              </span>
              <h4>:</h4>
              <span className="text-gray-700 w-[200px] text-[14px]">
                {details?.approval_status || ""}
              </span>
            </li>
            <li className="flex mb-2 gap-4">
              <span className="text-gray-400 w-[120px] text-[14px]">Team</span>
              <h4>:</h4>
              <span className="text-gray-700 w-[200px] text-[14px]">{details?.team_members?.map((item) => item?.first_name + " " + item?.last_name).join(", ") || ""}</span>
            </li>
            <li className="flex mb-2 gap-4">
              <span className="text-gray-400 w-[120px] text-[14px]">
                Post Caption
              </span>
              <h4>:</h4>
              <span className="text-gray-700 w-[200px] text-[14px]">
                {details?.post_caption || ""}
              </span>
            </li>
            <li className="flex mb-2 gap-4">
              <span className="text-gray-400 w-[120px] text-[14px]">
                Post URL
              </span>
              <h4>:</h4>
              {details?.post_url ? (
                <a
                  href={details?.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 w-[200px] text-[14px] underline cursor-pointer"
                >
                  {details?.post_url}
                </a>
              ) : (
                <span className="text-gray-700 w-[200px] text-[14px]"></span>
              )}

            </li>
            <li className="flex mb-2 gap-4">
              <span className="text-gray-400 w-[120px] text-[14px]">
                Attachments
              </span>
              <h4>:</h4>
              <span className="text-gray-700 w-[200px]">
                <AttachmentPreview files={documents} />
              </span>
            </li>
          </ul>
          .
        </div>

        {/* Comment Section */}
        <div className="mt-[390px] mb-[20px]">
          {/* <CommentBox projectId={itemId} taskId="" /> */}
        </div>
      </div>
    </motion.div>
  );
};

export default DrawerSM;