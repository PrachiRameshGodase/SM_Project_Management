"use client";
import { OtherIcons } from "@/assests/icons";
import { motion } from "framer-motion";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import AttachmentPreview from "../Attachments/AttachmentPreview";
import { formatDate } from "../Helper/Helper";
import TruncatedTooltipText from "../TruncatedTooltipText/TruncatedTooltipText";

const DrawerCampaign = ({
    isOpen,
    setIsDrawerOpen,
    details,
    itemId,
    setSelectedStatus,
}) => {
    const router = useRouter();
    const drawerRef = useRef(null)
    const documents = details?.media_upload ? JSON.parse(details?.media_upload) : []

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
        router.push(`/project/add-campaigns?id=${id}`)
    }

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

                                <TruncatedTooltipText text={details?.campaign_name || ""} maxLength={20} onClick={() => { }} section="project" />

                            </p>
                            <p className="text-xs text-gray-500">
                                {details?.campaign_type || ""}
                            </p>
                        </div>
                        <div className="flex flex-row">
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
                            <span onClick={() => handleEdit(details?.id)} className="ml-2 hover:cursor-pointer bg-white border border-gray-400 rounded px-2 py-0.5 hover:bg-gray-100" title="edit campaign">
                                {OtherIcons?.edit_svg}
                            </span>
                        </div>
                    </div>

                </div>

                {/* Project Details Section */}
                <div className="mb-4 mt-4 ml-[5px]">
                    <p className="text-xl leading-6">Campaign Details</p>
                    <ul className=" h-[22px] mt-[20px] ">
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Campaign ID
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.campaign_id || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Start Date
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.start_date ? formatDate(details?.start_date) : "" || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                End Date
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.end_date ? formatDate(details?.end_date) : "" || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">Team</span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">{details?.team_names?.map((item) => item?.name).join(", ") || ""}</span>
                        </li>


                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Campaign Goal
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.campaign_goal || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Distribution Area
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.distribution_area || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Distribution method
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.distribution_method || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Total quantity printed                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.total_quantity_printed || ""}
                            </span>
                        </li>



                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Total quantity Distributed
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.total_quantity_distributed || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Target Audience
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.target_audience || ""}
                            </span>
                        </li>

                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Budget
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.budget || ""}
                            </span>
                        </li>
                        <li className="flex mb-2 gap-4">
                            <span className="text-gray-400 w-[120px] text-[14px]">
                                Notes
                            </span>
                            <h4>:</h4>
                            <span className="text-gray-700 w-[200px] text-[14px]">
                                {details?.notes || ""}
                            </span>
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

export default DrawerCampaign;