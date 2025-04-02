"use client";
import {
    updateProjectStatus,
    updateStatus
} from "@/app/store/projectSlice";
import { motion } from "framer-motion";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import useUserData from "../Helper/useUserData";

const DrawerSEO = ({
    isOpen,
    setIsDrawerOpen,
    details,
    itemId,
    setSelectedStatus,
}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const userData = useUserData()
    const documents = details?.attachments ? JSON.parse(details?.media_upload) : []
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
                            <p className="font-bold">{details?.influencer_name || ""}</p>

                        </div>
                        <span
                            className={`px-3 py-1 border rounded-md inline-block text-[12px] h-[25px]
        ${details?.status === "To Do"
                                    ? "text-[#6C757D] border-[#6C757D]"
                                    : details?.status === "In progress"
                                        ? "text-[#CA9700] border-[#CA9700]"
                                        : details?.status === "Completed"
                                            ? "text-[#008053] border-[#008053]"
                                            : "text-[#0D4FA7] border-[#0D4FA7]"
                                }`}
                        >
                            {details?.status}
                        </span>
                    </div>
                    {/* <div>
                        <button className="w-[100px] h-[35px] rounded-[4px] py-[4px] bg-black text-white text-[16px] mb-2 p-4 mt-4">
                            Edit
                        </button>
                    </div> */}
                </div>

                {/* Project Details Section */}
                <div className="mb-4 mt-4 ml-[5px]">
                    <p className="text-xl leading-6">Influencer Details</p>
                    <ul className=" h-[22px] mt-[20px] ">
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                SEO ID
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.seo_id || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                            Date
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.date}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                            Email ID
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.email || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                            Email ID
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.email || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Followers
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.search_volume || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                            Engagement Rate
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.traffic || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">Content Type</span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">{details?.pages_per_session}</span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                            Content posting frequency
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.conversion_rate || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                            Pricing Model
                            </span>
                            <h4>:</h4>
                            {details?.session_duration}

                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                            Collaboration  
                            </span>
                            <h4>:</h4>
                            {details?.search_volume}

                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                            Assigned Team Member
                            </span>
                            <h4>:</h4>
                            {details?.bounce_rate}

                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                            Notes
                            </span>
                            <h4>:</h4>
                            {details?.notes}

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

export default DrawerSEO;