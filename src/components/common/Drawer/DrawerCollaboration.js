"use client";
import {
    updateProjectStatus,
    updateStatus
} from "@/app/store/projectSlice";
import { motion } from "framer-motion";
import { Check, CircleX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import useUserData from "../Helper/useUserData";
import TruncatedTooltipText from "../TruncatedTooltipText/TruncatedTooltipText";
import { formatDate } from "../Helper/Helper";
import { OtherIcons } from "@/assests/icons";
import { updateUserStatus } from "@/app/store/userSlice";

const DrawerCollaboration = ({
    isOpen,
    setIsDrawerOpen,
    details,
    itemId,
    setSelectedStatus,
}) => {
    const router = useRouter();
    const drawerRef = useRef(null)
    const dispatch=useDispatch()
    const documents = details?.media_upload ? JSON.parse(details?.media_upload) : []
    const [isActive, setIsActive] = useState(details?.availability_status || "");
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                setIsDrawerOpen(false); // Close drawer if clicked outside
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleEdit = (id) => {
        router.push(`/project/add-collaborations?id=${id}`)
    }
    useEffect(() => {
        if (details?.availability_status !== undefined) {
          setIsActive(details.availability_status);
        }
      }, [details]);
    

    const handleToggleStatus = async (event) => {
        const newStatus = isActive ? "Available" : "Unavailable"; // Toggle logic: Active (0) → Inactive (1), Inactive (1) → Active (0)
    
        const result = await Swal.fire({
          text: `Do you want to ${newStatus === "Unavailable" ? "Unavailable" : "Available"
            } this Influncer?`,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
    
        if (result.isConfirmed && itemId) {
          setIsActive(!isActive); // Update local state immediately
    
          // Dispatch updateUserStatus with the new status
          dispatch(updateUserStatus({ id: itemId, availability_status: newStatus, router }));
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
                            <p className="font-bold">

                                <TruncatedTooltipText text={details?.influencer_name || ""} maxLength={20} onClick={() => { }} section="project" />
                            </p>


                        </div>

                        <div className="flex flex-row">

                            <span onClick={() => handleEdit(details?.id)} className="ml-2 hover:cursor-pointer bg-white border border-gray-400 rounded px-2 py-0.5 hover:bg-gray-100" title="edit campaign">
                                {OtherIcons?.edit_svg}
                            </span>
                        </div>
                    </div>
                    <div> <label className="flex items-center cursor-pointer mt-4 ml-2">
                       

                        <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only"
                                defaultChecked={isActive}
                                onChange={handleToggleStatus}
                            />

                            <div
                                className={`w-[60px] h-[32px] rounded-full shadow- transition duration-300 ease-in-out bg-[#ECE4FF]`}
                            >

                            </div>
                            <div
                                className={`absolute w-[26px] h-[24px] rounded-full shadow-md top-[4px] left-[4px] transition-transform duration-300 ease-in-out ${isActive == "Available" ? 'translate-x-7 bg-[#048339]' : 'bg-[#E23703]'
                                    }`}
                            >
                                {isActive == "Available" && (
                                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                                        <Check size={16} />
                                    </span>
                                )}
                                {isActive == "Unavailable" && (
                                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                                        <X size={16} />
                                    </span>
                                )}
                            </div>
                        </div>
                    </label></div>
                </div>

                {/* Project Details Section */}
                <div className="mb-4 mt-4 ml-[5px]">
                    <p className="text-xl leading-6">Influencer Details</p>
                    <ul className=" h-[22px] mt-[20px] ">
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Collaboration ID
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.collbration_id || ""}
                            </span>
                        </li>

                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Username
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.social_media_username || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Followers
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.follower_count || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Engagement Rate
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.engagement_rate || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Payment
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.payment || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Payment Status
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.payment_status || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">Content Type</span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">{details?.content_type}</span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Content posting frequency
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.content_posting_frequency || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Pricing Model
                            </span>
                            <h4>:</h4>
                            {details?.pricing_model}

                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Collaboration Type
                            </span>
                            <h4>:</h4>
                            {details?.collaboration_type}

                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Assigned Team Member
                            </span>
                            <h4>:</h4>
                            {/* {details?.assigned_team_member?.map((item) => item?.name)} */}

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

export default DrawerCollaboration;