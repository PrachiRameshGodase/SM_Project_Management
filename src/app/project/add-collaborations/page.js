"use client"
import { addcollabration } from '@/app/store/collabrationSlice'
import { addProjectTask, fetchProjectTaskDetails } from '@/app/store/projectSlice'
import { fetchUsers } from '@/app/store/userSlice'
import { OtherIcons } from '@/assests/icons'
import FileUpload from '@/components/common/Attachments/FileUpload'
import CustomDatePicker from '@/components/common/DatePicker/CustomDatePicker'
import { Dropdown001 } from '@/components/common/Dropdown/Dropdown01'
import { Dropdown002, Dropdown02 } from '@/components/common/Dropdown/Dropdown02'
import { collabrationType, contentPostingFrq, contentType, departmentOptions, paymentStatus, postPlatform, pricingModel, projectPriority, taskType, taskVisibility } from '@/components/common/Helper/Helper'
import LayOut from '@/components/LayOut'
import { CircleX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'

const AddCollaborations = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const usersList = useSelector((state) => state.user?.employeeList?.data);
    const addCollabrationLoading = useSelector((state) => state.collabration);
    const collabrationDetailData = useSelector((state) => state.collabration?.collabrationDetails?.data);
    const [itemId2, setStoredValue] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedId = localStorage.getItem("itemId");
            if (storedId) {
                setStoredValue(storedId); // Update itemId2
            }
        }
    }, []);


    const [itemId, setItemId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            setItemId(params.get("id"));
            setIsEditMode(params.get("edit") === "true"); // Convert string to boolean
        }
    }, []);
    
    useEffect(() => {
        if (itemId) {
            dispatch(fetchProjectTaskDetails(itemId));
        }
    }, [dispatch, itemId]);

    const [searchTrigger, setSearchTrigger] = useState(0);

    useEffect(() => {
        const sendData = { is_employee: 1, };
        dispatch(fetchUsers(sendData));
    }, [searchTrigger, dispatch,]);

    const [formData, setFormData] = useState({
        project_id: "",
        influencer_name: "",
        profile_picture: "",
        platform: "",
        social_media_username: "",
        profile_url: "",
        follower_count: "",
        engagement_rate: "",
        content_type: "",
        content_posting_frequency: "",
        pricing_model: "",
        collaboration_type: "",
        availability_status: "",
        assigned_team_member: "",
        notes: "",
        payment_status: "",
        payment: null,



    })
    console.log("formData", formData)
    const [errors, setErrors] = useState({
        influencer_name: false,

    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
        setErrors((prevData) => ({
            ...prevData,
            [name]: false,
        }));
    }
    const handleDropdownChange = (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value
        }))
    }

    useEffect(() => {
        if (itemId2) {
            setFormData(prev => ({ ...prev, project_id: itemId2 }));
        }
    }, [itemId2]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {
            influencer_name: formData?.influencer_name ? false : true,

        }
        setErrors(newErrors);
        const hasAnyError = Object.values(newErrors).some(
            (value) => value === true
        );
        if (hasAnyError) {
            await Swal.fire({
                text: "Please fill all the required fields.",
                confirmButtonText: "OK",
            });
            return;
        } else {
            try {
                const sendData = {
                    ...formData,
                    profile_picture: formData?.profile_picture ? JSON.stringify(formData?.profile_picture) : "",
                    assigned_team_member: formData?.assigned_team_member ? JSON.stringify(formData?.assigned_team_member) : "",
                }
                dispatch(addcollabration({ projectData: sendData, router, itemId, itemId2 }));
            } catch (error) {
                console.error("Error updating user:", error);
            }
        }
    };

    const handleClose = () => {
        router.push(`/project/details?id=${itemId2}`)
        localStorage.removeItem("itemId", itemId2)
    }

    useEffect(() => {
        if (collabrationDetailData && itemId) {
            setFormData({
                id: collabrationDetailData?.id,
                project_id: collabrationDetailData?.project_id,
                influencer_name: collabrationDetailData?.influencer_name,
                platform: collabrationDetailData?.platform,
                social_media_username: collabrationDetailData?.social_media_username,
                follower_count: collabrationDetailData?.follower_count,
                engagement_rate: collabrationDetailData?.engagement_rate,
                content_type: collabrationDetailData?.content_type,
                content_posting_frequency: collabrationDetailData?.content_posting_frequency,
                pricing_model: collabrationDetailData?.pricing_model,
                collaboration_type: collabrationDetailData?.collaboration_type,
                availability_status: collabrationDetailData?.availability_status,
                payment: collabrationDetailData?.payment,
                notes: collabrationDetailData?.notes,
                payment_status: collabrationDetailData?.payment_status,
                profile_picture: collabrationDetailData?.profile_picture ? JSON.parse(collabrationDetailData?.profile_picture) : [],
                assigned_team_member: collabrationDetailData?.team?.map((item) => item?.id)
            });
        }
    }, [collabrationDetailData, itemId]);

    return (
        <LayOut>
            <div className="sm:flex mx-auto sm:mx-0  flex-col items-center justify-center">
                <div className="text-2xl tracking-tight ml-4 sm:ml-[7px] text-[32px]  w-full ">{itemId ? "Update Collaborations" : "Add New Collaborations"}</div>

                <div className="sm:flex justify-center items-center h-screen mx-auto sm:-mt-16 xl:lg:-mt-18">
                    <form className="w-full sm:w-[750px] mb-4 h-[656px] bg-white p-8 rounded-lg space-y-6" onSubmit={handleSubmit}>
                        <div className="sm:flex flex-col sm:flex-row justify-between">
                            <label className="block text-[20px]">Influencer Name<span className="text-red-600">*</span></label>
                            <div className="flex flex-col">
                                <input
                                    className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-[#0000004D] rounded-lg p-2 text-m sm:ml-7 placeholder:text-gray-400"
                                    type='text'
                                    placeholder='Enter Influencer Name'
                                    value={formData?.influencer_name}
                                    onChange={handleChange}
                                    name='influencer_name'
                                />
                                {errors?.influencer_name && (
                                    <p className="text-red-500 text-sm flex items-center mt-1 sm:ml-7">
                                        {OtherIcons.error_svg} <span className="ml-1">Please Enter Add New Influencer</span>
                                    </p>
                                )}
                            </div>
                        </div>


                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Profile Picture</label>
                            <FileUpload onFilesChange={(files) => { setFormData((prev) => ({ ...prev, profile_picture: files, })) }} initialFiles={formData.profile_picture} />

                        </div>

                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Platform</label>
                            <Dropdown001
                                options={postPlatform}
                                selectedValue={formData?.platform}
                                onSelect={(value) => handleDropdownChange("platform", value)}
                                label="Select Paltform"
                            />
                        </div>

                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Social Media Username</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Social Media Username' value={formData?.social_media_username} name='social_media_username' onChange={handleChange} />


                        </div>

                        <div className="flex justify-between">
                            <label className="block text-[20px]">Profile URL</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Profile URL' value={formData?.profile_url} name='profile_url' onChange={handleChange} />
                        </div>

                        <div className="flex justify-between">
                            <label className="block text-[20px]">Follower Count</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Follower' value={formData?.follower_count} name='follower_count' onChange={handleChange} />
                        </div>

                        <div className="flex justify-between">
                            <label className="block text-[20px]">Engagement Rate</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Engagement Rate' value={formData?.engagement_rate} name='engagement_rate' onChange={handleChange} />
                        </div>

                        <div className="flex justify-between">
                            <label className="block text-[20px]">Content Type</label>
                            <Dropdown001
                                options={contentType}
                                selectedValue={formData?.content_type}
                                onSelect={(value) => handleDropdownChange("content_type", value)}
                                label="Select Content Type"
                            />
                        </div>
                        <div className="flex justify-between">
                            <label className="block text-[20px]">Content Posting Frequency</label>
                            <Dropdown001
                                options={contentPostingFrq}
                                selectedValue={formData?.content_posting_frequency}
                                onSelect={(value) => handleDropdownChange("content_posting_frequency", value)}
                                label="Select Content Frequency"
                            />
                        </div>
                        <div className="flex justify-between">
                            <label className="block text-[20px]">Pricing Model</label>
                            <Dropdown001
                                options={pricingModel}
                                selectedValue={formData?.pricing_model}
                                onSelect={(value) => handleDropdownChange("pricing_model", value)}
                                label="Select Pricing Model"
                            />
                        </div>
                        <div className="flex justify-between">
                            <label className="block text-[20px]">Collaboration Type</label>
                            <Dropdown001
                                options={collabrationType}
                                selectedValue={formData?.collaboration_type}
                                onSelect={(value) => handleDropdownChange("collaboration_type", value)}
                                label="Select Collabration Type"
                            />
                        </div>
                        <div className="flex justify-between">
                            <label className="block text-[20px]">Payment </label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='number' placeholder='Enter Payment' value={formData?.payment} name='payment' onChange={handleChange} />
                        </div>

                        <div className="flex justify-between">
                            <label className="block text-[20px]">Payment Status</label>
                            <Dropdown001
                                options={paymentStatus}
                                selectedValue={formData?.payment_status}
                                onSelect={(value) => handleDropdownChange("payment_status", value)}
                                label="Select Payment Status"
                            />
                        </div>

                        <div className="flex justify-between">
                            <label className="block text-[20px]">Assigned Team Member</label>
                            <Dropdown002
                                options={usersList}
                                selectedValue={formData?.assigned_team_member}
                                onSelect={(value) => handleDropdownChange("assigned_team_member", value)}
                                label="Select Team"
                            />
                        </div>








                        <div className="flex justify-between">
                            <label className="block text-[20px]">Notes</label>
                            <textarea className="w-[310px] sm:w-[350px] md:w-[400px] h-40 border border-gray-300 rounded-lg p-2 text-m ml-[35px] placeholder:text-gray-400" type='text' placeholder='Enter Notes' value={formData?.notes} name='notes' onChange={handleChange} />
                        </div>

                        <div className='sm:flex w-full justify-end'>
                            <button
                                type="submit"
                                className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-[#0000004D] rounded-lg p-2 text-m bg-black text-gray-100 flex items-center justify-center"
                                disabled={addCollabrationLoading?.loading}
                            >
                                {addCollabrationLoading?.loading ? (
                                    <div className="w-5 h-5 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    itemId ? "Update" : "Submit"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                {/* <div className=" flex justify-end ">
                    <button
                        onClick={handleClose}
                        className="text-gray-700 hover:text-black">
                        <CircleX size={30} strokeWidth={1.5} />
                    </button>
                </div> */}
            </div>
        </LayOut>
    )
}

export default AddCollaborations
