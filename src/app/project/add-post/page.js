"use client"
import { addProjectTask, fetchProjectTaskDetails } from '@/app/store/projectSlice'
import { addPost } from '@/app/store/smmangementSlice'
import { fetchUsers } from '@/app/store/userSlice'
import { OtherIcons } from '@/assests/icons'
import FileUpload from '@/components/common/Attachments/FileUpload'
import CustomDatePicker from '@/components/common/DatePicker/CustomDatePicker'
import { Dropdown001 } from '@/components/common/Dropdown/Dropdown01'
import { Dropdown002, Dropdown02 } from '@/components/common/Dropdown/Dropdown02'
import { departmentOptions, postPlatform, postType, projectPriority, taskType, taskVisibility } from '@/components/common/Helper/Helper'
import LayOut from '@/components/LayOut'
import { CircleX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'

const AddPost = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const usersList = useSelector((state) => state.user?.employeeList?.data);
    const addPostLoading = useSelector((state) => state.post);

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
    const taskDetailsData = useSelector((state) => state.project?.projectTaskDetails?.data);
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
        brand_name: "",
        platform: "",
        post_type: "",
        post_caption: "",
        post_url: "",
        media_upload: "",
        team: "",
        description: "",
        // post_status: 0,
        scheduled_date: "",
        // approval_status: 0

    })
    // console.log("formData", formData)
    const [errors, setErrors] = useState({
        brand_name: false,

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
    const handleSubmit = async (e, status) => {
        e.preventDefault();
        let newErrors = {
            brand_name: formData?.brand_name ? false : true,

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
                const updatedFormData = {
                    ...formData,
                    post_status: status,
                    platform:JSON.stringify(formData?.platform),
                    media_upload: JSON.stringify(formData.media_upload || []), // Ensure JSON string format
                    team: JSON.stringify(formData.team || []), // Ensure JSON string format
                };
                dispatch(addPost({ projectData: updatedFormData, router, itemId2 }));
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
        if (taskDetailsData && itemId) {
            setFormData({
                id: taskDetailsData?.id,
                project_id: taskDetailsData?.project_id,
                task_title: taskDetailsData?.task_title,
                task_type: taskDetailsData?.task_type,
                due_date: taskDetailsData?.due_date,
                priority: taskDetailsData?.priority,
                department: taskDetailsData?.department,
                link: taskDetailsData?.link,
                visibility: taskDetailsData?.visibility,
                description: taskDetailsData?.description,
                attachment: taskDetailsData?.attachments ? JSON.parse(taskDetailsData?.attachments) : [],
                team: taskDetailsData?.team?.map((item) => item?.id)
            });
        }
    }, [taskDetailsData, itemId]);

    return (
        <LayOut>
            <div className="sm:flex mx-auto sm:mx-0  flex-col items-center justify-center">
                <div className="text-2xl tracking-tight ml-4 sm:ml-[7px] text-[32px]  w-full ">{itemId ? "Update Post" : "Add New Post"}</div>

                <div className="sm:flex justify-center items-center h-screen mx-auto sm:-mt-16 xl:lg:-mt-18">
                    <form className="w-full sm:w-[650px] mb-4 h-[656px] bg-white p-8 rounded-lg space-y-6" >
                        <div className="sm:flex flex-col sm:flex-row justify-between">
                            <label className="block text-[20px]">Brand Name<span className="text-red-600">*</span></label>
                            <div className="flex flex-col">
                                <input
                                    className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-[#0000004D] rounded-lg p-2 text-m sm:ml-7 placeholder:text-gray-400"
                                    type='text'
                                    placeholder='Enter Brand Name'
                                    value={formData?.brand_name}
                                    onChange={handleChange}
                                    name='brand_name'
                                />
                                {errors?.brand_name && (
                                    <p className="text-red-500 text-sm flex items-center mt-1 sm:ml-7">
                                        {OtherIcons.error_svg} <span className="ml-1">Please Enter Brand Name</span>
                                    </p>
                                )}
                            </div>
                        </div>


                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Platform</label>
                            <Dropdown02
                                options={postPlatform}
                                selectedValue={formData?.platform}
                                onSelect={(value) => handleDropdownChange("platform", value)}
                                label="Select Platform"
                            />
                        </div>

                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Post Type</label>
                            <Dropdown001
                                options={postType}
                                selectedValue={formData?.post_type}
                                onSelect={(value) => handleDropdownChange("post_type", value)}
                                label="Select Post Type"
                            />
                        </div>

                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Post Caption</label>
                            <textarea className="w-[310px] sm:w-[350px] md:w-[400px] h-40 border border-gray-300 rounded-lg p-2 text-m ml-[35px] placeholder:text-gray-400" type='text' placeholder='Post Caption' value={formData?.post_caption} name='post_caption' onChange={handleChange} />

                        </div>

                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Media Upload</label>
                            <FileUpload onFilesChange={(files) => { setFormData((prev) => ({ ...prev, media_upload: files, })) }} initialFiles={formData.attachment} />
                        </div>



                        <div className="flex justify-between">
                            <label className="block text-[20px]">Link</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Link' value={formData?.post_url} name='post_url' onChange={handleChange} />
                        </div>

                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Team</label>
                            <Dropdown002
                                options={usersList}
                                selectedValue={formData?.team}
                                onSelect={(value) => handleDropdownChange("team", value)}
                                label="Select Team"
                            />
                        </div>

                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Scheduled Date</label>


                            <CustomDatePicker
                                selectedDate={formData?.scheduled_date}
                                onChange={(date) => handleDropdownChange("scheduled_date", date)} />
                        </div>
                        <div className="flex justify-between">
                            <label className="block text-[20px]">Description</label>
                            <textarea className="w-[310px] sm:w-[350px] md:w-[400px] h-40 border border-gray-300 rounded-lg p-2 text-m ml-[35px] placeholder:text-gray-400" type='text' placeholder='Enter Description' value={formData?.description} name='description' onChange={handleChange} />
                        </div>

                        <div className="sm:flex w-full justify-end gap-4">
                            <button
                                type="button"
                                className="w-[110px] sm:w-[145px] md:w-[190px] h-10 border border-gray-50 rounded-lg p-2 text-m bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-black hover:text-gray-200"
                                onClick={(e) => handleSubmit(e, 0)}
                                disabled={addPostLoading?.loading}
                            >
                                Save As Draft
                            </button>
                            <button
                                type="submit"
                                className="w-[110px] sm:w-[145px] md:w-[190px] h-10 border border-[#0000004D] rounded-lg p-2 text-m bg-black text-gray-100 flex items-center justify-center"
                                onClick={(e) => handleSubmit(e, 1)}
                                disabled={addPostLoading?.loading}
                            >
                                {addPostLoading?.loading ? (
                                    <div className="w-3 h-5 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    itemId ? "Update Post" : "Post Now"
                                )}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </LayOut>
    )
}

export default AddPost
