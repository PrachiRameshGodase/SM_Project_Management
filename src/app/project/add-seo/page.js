"use client"
import { addProjectTask, fetchProjectTaskDetails } from '@/app/store/projectSlice'
import { addSEO } from '@/app/store/seoSlice'
import { fetchUsers } from '@/app/store/userSlice'
import { OtherIcons } from '@/assests/icons'
import FileUpload from '@/components/common/Attachments/FileUpload'
import CustomDatePicker from '@/components/common/DatePicker/CustomDatePicker'
import { Dropdown0001, Dropdown001 } from '@/components/common/Dropdown/Dropdown01'
import { Dropdown002, Dropdown02 } from '@/components/common/Dropdown/Dropdown02'
import { departmentOptions, issueFixed, postPlatform, projectPriority, seoKeywords, taskType, taskVisibility } from '@/components/common/Helper/Helper'
import LayOut from '@/components/LayOut'
import { CircleX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'

const AddSEO = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const usersList = useSelector((state) => state.user?.employeeList?.data);
    const addSEOLoading = useSelector((state) => state.project);

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
        date: "",
        keywords: "",
        search_volume: "",
        technical_seo_issues_fixed: 1,
        schema_markup_added: 1,
        meta_title: "",
        meta_description: "",
        traffic: "",
        onpage_optimization_status: 1,
        backlink_created: 1,
        backlink_source_url: "",
        page_url: "",
        pages_per_session: "",
        conversion_rate: "",
        session_duration: "",
        bounce_rate: "",
        click_through_rate: "",
        competitor_analysis_notes: "",
        priority: ""

    })
    console.log("formData", formData)
    const [errors, setErrors] = useState({
        task_title: false,

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
                dispatch(addSEO({ projectData: formData, router, itemId2 }));
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
                <div className="text-2xl tracking-tight ml-4 sm:ml-[7px] text-[32px]  w-full ">{itemId ? "Update SEO" : "Add New SEO"}</div>

                <div className="sm:flex justify-center items-center h-screen mx-auto sm:-mt-16 xl:lg:-mt-18">
                    <form className="w-full sm:w-[750px] mb-4 h-[656px] bg-white p-8 rounded-lg space-y-6" onSubmit={handleSubmit}>
                        <div className="sm:flex flex-col sm:flex-row justify-between">
                            <label className="block text-[20px]">Date</label>
                            <div className="flex flex-col">
                                <CustomDatePicker
                                    selectedDate={formData?.date}
                                    onChange={(date) => handleDropdownChange("date", date)}
                                />

                            </div>
                        </div>


                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Keywords</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Keywords' value={formData?.keywords} name='keywords' onChange={handleChange} />

                        </div>

                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Search Volume</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Search Volume' value={formData?.search_volume} name='search_volume' onChange={handleChange} />

                        </div>

                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Technical SEO issues Fixed</label>
                            <Dropdown0001
                                options={issueFixed}
                                selectedValue={formData?.technical_seo_issues_fixed}
                                onSelect={(value) => handleDropdownChange("technical_seo_issues_fixed", value)}
                                label="Select Technical SEO Issues Fixed"
                            />

                        </div>
                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Schema Markup Added</label>
                            <Dropdown0001
                                options={issueFixed}
                                selectedValue={formData?.schema_markup_added}
                                onSelect={(value) => handleDropdownChange("schema_markup_added", value)}
                                label="Select Schema Markup Added"
                            />

                        </div>

                        <div className="flex justify-between">
                            <label className="block text-[20px]">Meta Title</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Meta Title' value={formData?.meta_title} name='meta_title' onChange={handleChange} />
                        </div>

                        <div className="flex justify-between">
                            <label className="block text-[20px]">Meta Description</label>
                            <textarea className="w-[310px] sm:w-[350px] md:w-[400px] h-40 border border-gray-300 rounded-lg p-2 text-m ml-[35px] placeholder:text-gray-400" type='text' placeholder='Enter Description' value={formData?.meta_description} name='meta_description' onChange={handleChange} />
                        </div>

                        <div className="flex justify-between">
                            <label className="block text-[20px]">Traffic</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Traffic' value={formData?.traffic} name='traffic' onChange={handleChange} />
                        </div>

                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">On-page optimization Status</label>
                            <Dropdown0001
                                options={issueFixed}
                                selectedValue={formData?.onpage_optimization_status}
                                onSelect={(value) => handleDropdownChange("onpage_optimization_status", value)}
                                label="Select On-page optimization Status"
                            />

                        </div>
                         <div className="sm:flex justify-between">
                                                    <label className="block text-[20px]">Priority</label>
                                                    <Dropdown001
                                                        options={projectPriority}
                                                        selectedValue={formData?.priority}
                                                        onSelect={(value) => handleDropdownChange("priority", value)}
                                                        label="Select Priority"
                                                    />
                                                </div>
                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Backlinks Created</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Backlinks' value={formData?.backlink_created} name='backlink_created' onChange={handleChange} />


                        </div>
                        <div className="flex justify-between">
                            <label className="block text-[20px]">Backlink source URL</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Backlink Source URL' value={formData?.backlink_source_url} name='backlink_source_url' onChange={handleChange} />
                        </div>
                        <div className="flex justify-between">
                            <label className="block text-[20px]">Page URL</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Page URL' value={formData?.page_url} name='page_url' onChange={handleChange} />
                        </div>
                        <div className="flex justify-between">
                            <label className="block text-[20px]">Pages per session</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Page Per Session' value={formData?.pages_per_session} name='pages_per_session' onChange={handleChange} />
                        </div>
                        <div className="flex justify-between">
                            <label className="block text-[20px]">Conversion Rate</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Conversion Rate' value={formData?.conversion_rate} name='conversion_rate' onChange={handleChange} />
                        </div>
                        <div className="flex justify-between">
                            <label className="block text-[20px]">Session Duration</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Session Duration' value={formData?.session_duration} name='session_duration' onChange={handleChange} />
                        </div>
                        <div className="flex justify-between">
                            <label className="block text-[20px]">Bounce Rate</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Bounce Rate' value={formData?.bounce_rate} name='bounce_rate' onChange={handleChange} />
                        </div>
                        <div className="flex justify-between">
                            <label className="block text-[20px]">Click Through Rate</label>
                            <input className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400" type='text' placeholder='Enter Link' value={formData?.click_through_rate} name='click_through_rate' onChange={handleChange} />
                        </div>





                        <div className="flex justify-between">
                            <label className="block text-[20px]">Competitor Analysis Notes</label>
                            <textarea className="w-[310px] sm:w-[350px] md:w-[400px] h-40 border border-gray-300 rounded-lg p-2 text-m ml-[35px] placeholder:text-gray-400" type='text' placeholder='Enter Notes' value={formData?.competitor_analysis_notes} name='competitor_analysis_notes' onChange={handleChange} />
                        </div>

                        <div className='sm:flex w-full justify-end'>
                            <button
                                type="submit"
                                className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-[#0000004D] rounded-lg p-2 text-m bg-black text-gray-100 flex items-center justify-center"
                                disabled={addSEOLoading?.loading}
                            >
                                {addSEOLoading?.loading ? (
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

export default AddSEO
