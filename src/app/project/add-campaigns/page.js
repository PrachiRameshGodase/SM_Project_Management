"use client"
import { addCampaign, fetchCampaignDetails } from '@/app/store/campaignSlice'
import { fetchUsers } from '@/app/store/userSlice'
import { OtherIcons } from '@/assests/icons'
import { Dropdown001 } from '@/components/common/Dropdown/Dropdown01'
import { campaignType } from '@/components/common/Helper/Helper'
import LayOut from '@/components/LayOut'
import FacebookCampaign from '@/components/pages/FacebookCampaign'
import GoogleCampaign from '@/components/pages/GoogleCampaign'
import PrintingCampaign from '@/components/pages/printingCampaigns'
import WhatsappCampaign from '@/components/pages/WhatsappCampaign'
import YoutubeCampaign from '@/components/pages/YoutubeCampaign'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'

const AddCampaigns = () => {
    const router = useRouter()
    const dispatch = useDispatch();

    const usersList = useSelector((state) => state.user?.employeeList?.data);
    const addCampaignLoading = useSelector((state) => state.campaign);
    const campaignDetailsData = useSelector((state) => state.campaign?.campaignDetails?.data);

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
            dispatch(fetchCampaignDetails(itemId));
        }
    }, [dispatch, itemId]);

    const [searchTrigger, setSearchTrigger] = useState(0);

    useEffect(() => {
        const sendData = { is_employee: 1, };
        dispatch(fetchUsers(sendData));
    }, [searchTrigger, dispatch,]);

    const [formData, setFormData] = useState({
        project_id: "",
        platforms: "",
        campaign_name: "",
        campaign_type: "",
        campaign_goal: "",
        ad_type: "",
        start_date: "",
        end_date: "",
        team: "",
        media_upload: "",
        attempted_users: "",
        sent_users: "",
        read_users: "",
        replied_users: "",
        notes: "",
        destination_url: "",
        goal: "",
        topic: "",
        engagement: "",
        target_audience: "",
        link_clicks: "",
        branches: "",
        ad_copy: "",
        video_url: "",
        budget: null,
        distribution_area: "",
        distribution_method: "",
        total_quantity_distributed: null,
        total_quantity_printed: null,


    })

    const [errors, setErrors] = useState({
        campaign_name: false,

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
            campaign_name: formData?.campaign_name ? false : true,

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
                    // post_status: status,
                    media_upload: JSON.stringify(formData.media_upload || []), // Ensure JSON string format
                    team: JSON.stringify(formData.team || []), // Ensure JSON string format
                };
                dispatch(addCampaign({ projectData: updatedFormData, router, itemId, itemId2 }));
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
        if (campaignDetailsData && itemId) {
            setFormData({
                id: campaignDetailsData?.id,
                project_id: campaignDetailsData?.project_id,
                platforms: campaignDetailsData?.platforms,
                campaign_name: campaignDetailsData?.campaign_name,
                campaign_type: campaignDetailsData?.campaign_type,
                campaign_goal: campaignDetailsData?.campaign_goal,
                ad_type: campaignDetailsData?.ad_type,
                start_date: campaignDetailsData?.start_date,
                end_date: campaignDetailsData?.end_date,
                media_upload: campaignDetailsData?.media_upload ? JSON.parse(campaignDetailsData?.media_upload) : [],
                attempted_users: campaignDetailsData?.attempted_users,
                sent_users: campaignDetailsData?.sent_users,
                read_users: campaignDetailsData?.read_users,
                replied_users: campaignDetailsData?.replied_users,
                notes: campaignDetailsData?.notes,
                destination_url: campaignDetailsData?.destination_url,
                topic: campaignDetailsData?.topic,
                engagement: campaignDetailsData?.engagement,
                target_audience: campaignDetailsData?.target_audience,
                link_clicks: campaignDetailsData?.link_clicks,
                branches: campaignDetailsData?.branches,
                ad_copy: campaignDetailsData?.ad_copy,
                video_url: campaignDetailsData?.video_url,
                budget: campaignDetailsData?.budget,
                distribution_area: campaignDetailsData?.distribution_area,
                distribution_method: campaignDetailsData?.distribution_method,
                total_quantity_distributed: campaignDetailsData?.total_quantity_distributed,
                total_quantity_printed: campaignDetailsData?.total_quantity_printed,
                team: campaignDetailsData?.team_names?.map((item) => item?.id)
            });
        }
    }, [campaignDetailsData, itemId]);

    let CampaignComponent;
    switch (formData?.platforms) {
        case "Facebook":
            CampaignComponent = <FacebookCampaign formData={formData} setFormData={setFormData} handleChange={handleChange} handleDropdownChange={handleDropdownChange} errors={errors} userList={usersList} />;
            break;
        case "Instagram":
            CampaignComponent = <FacebookCampaign formData={formData} setFormData={setFormData} handleChange={handleChange} handleDropdownChange={handleDropdownChange} errors={errors} userList={usersList} />;
            break;
        case "WhatsApp":
            CampaignComponent = <WhatsappCampaign formData={formData} setFormData={setFormData} handleChange={handleChange} handleDropdownChange={handleDropdownChange} errors={errors} userList={usersList} />;
            break;
        case "Google":
            CampaignComponent = <GoogleCampaign formData={formData} setFormData={setFormData} handleChange={handleChange} handleDropdownChange={handleDropdownChange} errors={errors} userList={usersList} />;
            break;
        case "YouTube":
            CampaignComponent = <YoutubeCampaign formData={formData} setFormData={setFormData} handleChange={handleChange} handleDropdownChange={handleDropdownChange} errors={errors} userList={usersList} />;
            break;
        // default:
        //     CampaignComponent = <WhatsappCampaign formData={formData} handleChange={handleChange} handleDropdownChange={handleDropdownChange} errors={errors} userList={usersList} />;
        //     break;
    }
    if (formData?.campaign_type == "Printing Marketing") {
        CampaignComponent = <PrintingCampaign formData={formData} setFormData={setFormData} handleChange={handleChange} handleDropdownChange={handleDropdownChange} errors={errors} userList={usersList} />;
    }

    const getPlatformOptions = (campaignType) => {
        if (campaignType === "Whatsapp Marketing") {
            return ["WhatsApp"];
        } else if (campaignType === "Paid Advertising") {
            return ["Facebook", "Instagram", "YouTube", "Google"];
        }
        return [];
    };

    // Update `postPlatform` when `campaign_type` changes
    const postPlatform = getPlatformOptions(formData?.campaign_type);

    return (
        <LayOut>
            <div className="sm:flex mx-auto sm:mx-0  flex-col items-center justify-center">
                <div className="text-2xl tracking-tight ml-4 sm:ml-[7px] text-[32px]  w-full ">{itemId ? "Update Campaigns" : "Add New Campaigns"}</div>

                <div className="sm:flex justify-center items-center h-screen mx-auto sm:-mt-16 xl:lg:-mt-18">
                    <form className={`w-full ${formData?.campaign_type === "Printing Marketing" ? "sm:w-[780px]" : "sm:w-[670px]"
                        } mb-4 h-[656px] bg-white p-8 rounded-lg space-y-6`} onSubmit={handleSubmit}>
                        <div className="sm:flex flex-col sm:flex-row justify-between">
                            <label className="block text-[20px]">Campaign Name<span className="text-red-600">*</span></label>
                            <div className="flex flex-col">
                                <input
                                    className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-[#0000004D] rounded-lg p-2 text-m sm:ml-7 placeholder:text-gray-400"
                                    type='text'
                                    placeholder='Enter Campaign Name'
                                    value={formData?.campaign_name}
                                    onChange={handleChange}
                                    name='campaign_name'
                                />
                                {errors?.campaign_name && (
                                    <p className="text-red-500 text-sm flex items-center mt-1 sm:ml-7">
                                        {OtherIcons.error_svg} <span className="ml-1">Please Enter Campaign Name</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Campaign Type</label>
                            <Dropdown001
                                options={campaignType}
                                selectedValue={formData?.campaign_type}
                                onSelect={(value) => handleDropdownChange("campaign_type", value)}
                                label="Select Campaign Type"
                            />
                        </div>
                        {(formData?.campaign_type == "Whatsapp Marketing" || formData?.campaign_type == "Paid Advertising") && <div className="sm:flex justify-between">
                            <label className="block text-[20px]">Platforms</label>
                            <Dropdown001
                                options={postPlatform}
                                selectedValue={formData?.platforms}
                                onSelect={(value) => handleDropdownChange("platforms", value)}
                                label="Select Platform"
                            />
                        </div>
                        }




                        {CampaignComponent}

                        <div className='sm:flex w-full justify-end'>
                            <button
                                type="submit"
                                className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-[#0000004D] rounded-lg p-2 text-m bg-black text-gray-100 flex items-center justify-center"
                                disabled={addCampaignLoading?.loading}
                            >
                                {addCampaignLoading?.loading ? (
                                    <div className="w-5 h-5 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    itemId ? "Update" : "Send Now"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </LayOut>
    )
}

export default AddCampaigns
