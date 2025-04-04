import {
  fetchCampaign,
  fetchCampaignDetails,
  updateCampaignStatus,
} from "@/app/store/campaignSlice";
import { OtherIcons } from "@/assests/icons";
import { Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DrawerCampaign from "../common/Drawer/DrawerCampaign";
import DrawerCampaignFI from "../common/Drawer/DrawerCampaignFI";
import DrawerCampaignG from "../common/Drawer/DrawerCampaignG";
import DrawerCampaignWP from "../common/Drawer/DrawerCampaignWp";
import DrawerCampaignY from "../common/Drawer/DrawerCampaignY";
import Dropdown01 from "../common/Dropdown/Dropdown01";
import DropdownStatus01 from "../common/Dropdown/DropdownStatus01";
import { formatDate, statusProject } from "../common/Helper/Helper";
import { useDebounceSearch } from "../common/Helper/HelperFunction";
import Pagenation from "../common/Pagenation/Pagenation";
import SearchComponent from "../common/SearchComponent/SearchComponent";
import SortBy from "../common/Sort/SortBy";
import TableSkeleton from "../common/TableSkeleton/TableSkeleton";
import TruncatedTooltipText from "../common/TruncatedTooltipText/TruncatedTooltipText";

const Campaigns = ({ itemId }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const campaignListData = useSelector((state) => state.campaign?.list?.data);
  const campaignLoading = useSelector((state) => state.campaign);
  const totalCount = useSelector((state) => state?.campaign?.list?.total);
  const campaignDetailData = useSelector((state) => state.campaign?.campaignDetails?.data);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isDrawerOpen1, setIsDrawerOpen1] = useState(false);
  const [itemId2, setItemId2] = useState(null);

  const [dataLoading, setDataLoading] = useState(true);

  const handleTaskClick = (item) => {
    setItemId2(item?.id);
    setDataLoading(false)
    setIsDrawerOpen1(true);
    setSelectedPlatform(item?.platforms);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTrigger, setSearchTrigger] = useState(0);

  // reset current page to 1 when any filters are applied
  const resetPageIfNeeded = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  };

  //Search/////////////////////////////////////////////////////////////
  const [searchTermFromChild, setSearchTermFromChild] = useState("");
  // Debounced function to trigger search
  const debouncedSearch = useDebounceSearch(() => {
    setSearchTrigger((prev) => prev + 1);
  }, 800);

  // Handle search term change from child component
  const onSearch = (term) => {
    setSearchTermFromChild(term);
    if (term.length > 0 || term === "") {
      debouncedSearch();
    }
  };

  // sortBy
  const [selectedSortBy, setSelectedSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  //sortby

  // // filter
  const [selectedStatus, setSelectedStatus] = useState("");
  // // filter

  useEffect(() => {
    if (!itemId) return; // Ensure itemId is set before dispatching

    const sendData = {
      project_id: Number(itemId),
      limit: itemsPerPage,
      page: currentPage,
      ...(searchTermFromChild ? { search: searchTermFromChild } : {}),
      ...(selectedSortBy && { sort_by: selectedSortBy, sort_order: sortOrder }),
      ...(selectedStatus ? { status: selectedStatus } : {}),
    };

    dispatch(fetchCampaign(sendData));
  }, [searchTrigger, dispatch, selectedStatus, itemId]);
  useEffect(() => {
    if (itemId2) {
      dispatch(fetchCampaignDetails(itemId2));
    }
  }, [dispatch, itemId2]);

  const handleAddPost = () => {
    localStorage.setItem("itemId", itemId);
    router.push(`/project/add-campaigns`);
  };

  const handleStatusChange = async (value, id) => {
    dispatch(
      updateCampaignStatus({
        id: id,
        project_id: Number(itemId),
        status: value,
        dispatch,
        setDataLoading,
      })
    );
  };

  let DrawerComponent;
  switch (selectedPlatform) {
    case "WhatsApp":
      DrawerComponent = (
        <DrawerCampaignWP
          isOpen={isDrawerOpen1}
          setIsDrawerOpen={setIsDrawerOpen1}
          itemId2={itemId}
          itemId={itemId2}
          details={campaignDetailData}
        />
      );
      break;
    case "Facebook":
      DrawerComponent = (
        <DrawerCampaignFI
          isOpen={isDrawerOpen1}
          setIsDrawerOpen={setIsDrawerOpen1}
          itemId2={itemId}
          itemId={itemId2}
          details={campaignDetailData}
        />
      );
      break;
    case "Instagram":
      DrawerComponent = (
        <DrawerCampaignY
          isOpen={isDrawerOpen1}
          setIsDrawerOpen={setIsDrawerOpen1}
          itemId2={itemId}
          itemId={itemId2}
          details={campaignDetailData}
        />
      );
      break;
    case "Google":
      DrawerComponent = (
        <DrawerCampaignG
          isOpen={isDrawerOpen1}
          setIsDrawerOpen={setIsDrawerOpen1}
          itemId2={itemId}
          itemId={itemId2}
          details={campaignDetailData}
        />
      );
      break;
    case "YouTube":
      DrawerComponent = (
        <DrawerCampaignY
          isOpen={isDrawerOpen1}
          setIsDrawerOpen={setIsDrawerOpen1}
          itemId2={itemId}
          itemId={itemId2}
          details={campaignDetailData}
        />
      );
      break;
    case null:
      DrawerComponent = (
        <DrawerCampaign
          isOpen={isDrawerOpen1}
          setIsDrawerOpen={setIsDrawerOpen1}
          itemId2={itemId}
          itemId={itemId2}
          details={campaignDetailData}
        />
      );
      break;
    default:
      DrawerComponent = null; // No drawer if platform doesn't match
  }

  return (
    <div>
      <div className="w-full h-[44px] mt-6  flex justify-between items-center px-2 sm:px-4  ">
        {/* Left Section (Heading + Count) */}
        <div className="flex">
          <p className="text-[20px] sm:text-[30px] leading-[32px] tracking-[-1.5px]">
            All Campaigns list
          </p>
          <p className="font-bold p-2 rounded-full text-[10.16px] leading-[12.19px] text-[#400F6F] mt-3 ml-2 bg-[#f0e7fa] flex items-center justify-center w-[70px] h-[10px]">
            {totalCount} total
          </p>
          <p
            className={`${
              campaignLoading?.loading && "rotate_01"
            } mt-[6px] hover:cursor-pointer`}
            data-tooltip-content="Reload"
            data-tooltip-place="bottom"
            data-tooltip-id="my-tooltip"
            onClick={() => setSearchTrigger((prev) => prev + 1)}
          >
            {OtherIcons?.refresh_svg}
          </p>
        </div>

        {/* Right Section (Filters & Search) */}
        <div className="hidden min-[950px]:flex gap-6 items-center">
          <Dropdown01
            options={statusProject}
            selectedValue={selectedStatus}
            onSelect={setSelectedStatus}
            label="Status"
            icon={OtherIcons.user_svg}
          />
          {/* <Dropdown01 options={projectSortConstant} selectedValue={selectedSort} onSelect={setSelectedSort} label="Sort By" icon={OtherIcons.sort_by_svg} /> */}
          <SearchComponent onSearch={onSearch} section={searchTrigger} />

          <div className="w-[1px] h-[40px] bg-gray-400 opacity-40" />
          <Tooltip title="Add Task" arrow disableInteractive>
            <button
              className="w-full h-[44px] bg-[#048339] text-white rounded-lg flex items-center justify-center text-[16px] px-4"
              onClick={handleAddPost}
            >
              + New Campaigns
            </button>
          </Tooltip>
        </div>

        {/* Mobile Filter Button */}
        <div className="flex  gap-2  min-[950px]:hidden ">
          <SearchComponent onSearch={onSearch} section={searchTrigger} />
          <Tooltip title="Filter" arrow disableInteractive>
            <button
              className="min-[950px]:hidden w-[44px] h-[44px]  border border-gray-300 hover:ring-2 hover:ring-purple-200  hover:border-purple-500 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center text-2xl"
              onClick={() => setIsFilterOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                color="#000000"
                fill="none"
              >
                <path
                  d="M4 11L4 21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 13L19 21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 3L19 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.5 3L11.5 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 3L4 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.5 19L11.5 21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 9.5C2 9.03406 2 8.80109 2.07612 8.61732C2.17761 8.37229 2.37229 8.17761 2.61732 8.07612C2.80109 8 3.03406 8 3.5 8H4.5C4.96594 8 5.19891 8 5.38268 8.07612C5.62771 8.17761 5.82239 8.37229 5.92388 8.61732C6 8.80109 6 9.03406 6 9.5C6 9.96594 6 10.1989 5.92388 10.3827C5.82239 10.6277 5.62771 10.8224 5.38268 10.9239C5.19891 11 4.96594 11 4.5 11H3.5C3.03406 11 2.80109 11 2.61732 10.9239C2.37229 10.8224 2.17761 10.6277 2.07612 10.3827C2 10.1989 2 9.96594 2 9.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 11.5C17 11.0341 17 10.8011 17.0761 10.6173C17.1776 10.3723 17.3723 10.1776 17.6173 10.0761C17.8011 10 18.0341 10 18.5 10H19.5C19.9659 10 20.1989 10 20.3827 10.0761C20.6277 10.1776 20.8224 10.3723 20.9239 10.6173C21 10.8011 21 11.0341 21 11.5C21 11.9659 21 12.1989 20.9239 12.3827C20.8224 12.6277 20.6277 12.8224 20.3827 12.9239C20.1989 13 19.9659 13 19.5 13H18.5C18.0341 13 17.8011 13 17.6173 12.9239C17.3723 12.8224 17.1776 12.6277 17.0761 12.3827C17 12.1989 17 11.9659 17 11.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 14.5C9.5 14.0341 9.5 13.8011 9.57612 13.6173C9.67761 13.3723 9.87229 13.1776 10.1173 13.0761C10.3011 13 10.5341 13 11 13H12C12.4659 13 12.6989 13 12.8827 13.0761C13.1277 13.1776 13.3224 13.3723 13.4239 13.6173C13.5 13.8011 13.5 14.0341 13.5 14.5C13.5 14.9659 13.5 15.1989 13.4239 15.3827C13.3224 15.6277 13.1277 15.8224 12.8827 15.9239C12.6989 16 12.4659 16 12 16H11C10.5341 16 10.3011 16 10.1173 15.9239C9.87229 15.8224 9.67761 15.6277 9.57612 15.3827C9.5 15.1989 9.5 14.9659 9.5 14.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Tooltip>
        </div>

        {/* Mobile Filter Panel */}
        <div
          className={`fixed mt-20 top-0 right-0 w-[250px] h-full bg-white shadow-lg transform 
          ${
            isFilterOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out md:hidden`}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-2xl"
            onClick={() => setIsFilterOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              color="#000000"
              fill="none"
            >
              <path
                d="M18 6L12 12M12 12L6 18M12 12L18 18M12 12L6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Filter Options */}
          <div className="mt-16 flex flex-col gap-4 px-4">
            <Dropdown01
              options={statusProject}
              selectedValue={selectedStatus}
              onSelect={setSelectedStatus}
              label="Status"
              icon={OtherIcons.user_svg}
            />
            {/* <Dropdown01 options={projectSortConstant} selectedValue={selectedSort} onSelect={setSelectedSort} label="Sort By" icon={OtherIcons.sort_by_svg} /> */}
            {/* <SearchComponent /> */}
          </div>
        </div>
      </div>

      <div className="max-w-full  overflow-x-auto mt-6 ">
        {campaignLoading?.loading && dataLoading ? (
          <TableSkeleton rows={7} columns={5} />
        ) : (
          <table className="w-full border-spacing-y-1 min-w-[1000px] border-2 border-transparent  ">
            <thead className=" ">
              <tr className="text-left m-1 text-sm uppercase text-gray-800 shadow-tr-border rounded-md  ">
                <th className="py-2 sm:py-3 px-2 sm:px-4  text-[12px] sm:text-[15px]   flex ">
                  <div className="flex w-full justify-between items-center text-gray-700">
                    <span className="text-gray-700">Campaign Id</span>
                    <SortBy
                      setSearchTrigger={setSearchTrigger}
                      selectedSortBy={selectedSortBy}
                      setSelectedSortBy={setSelectedSortBy}
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                      sortOptions="campaign_id"
                      resetPageIfNeeded={resetPageIfNeeded}
                    />
                  </div>
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-[13px] sm:text-[16px] ">
                  Campaign Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-[13px] sm:text-[16px]  ">
                  Start Date
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-[13px] sm:text-[16px]  ">
                  END DATE
                </th>

                <th className="py-2 sm:py-3 px-2 sm:px-4 text-[13px] sm:text-[16px] ">
                  Platform
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-[13px] sm:text-[16px] ">
                  Campaign Type
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-[13px] sm:text-[16px] ">
                  Team
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-[13px] sm:text-[16px] ">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {campaignListData?.map((item, index) => (
                <tr
                  key={item?.id}
                  className="cursor-pointer  hover:bg-gray-100   hover:shadow-tr-border   rounded-md  transition-all duration-200"
                >
                  <td
                    className="py-2 sm:py-3 px-2 sm:px-4   text-[12px] sm:text-[15px]   rounded "
                    onClick={() => handleTaskClick(item)}
                  >
                    {item?.campaign_id || ""}
                  </td>
                  <td
                    className={`py-2 sm:py-3 px-2 sm:px-4   text-[12px] sm:text-[14px]  min-w-[150px] rounded `}
                    onClick={() => handleTaskClick(item)}
                  >
                    {item?.campaign_name || ""}
                  </td>
                  <td
                    className="py-2 sm:py-3 px-2 sm:px-4   text-[12px] sm:text-[15px]   "
                    onClick={() => handleTaskClick(item)}
                  >
                    {item?.start_date ? formatDate(item?.start_date) : "" || ""}
                  </td>
                  <td
                    className="py-2 sm:py-3 px-2 sm:px-4   text-[12px] sm:text-[15px]   "
                    onClick={() => handleTaskClick(item)}
                  >
                    {item?.end_date ? formatDate(item?.end_date) : "" || ""}
                  </td>
                  <td
                    className="py-2 sm:py-3 px-2 sm:px-4   text-[12px] sm:text-[15px]   "
                    onClick={() => handleTaskClick(item)}
                  >
                    {item?.platforms == "WhatsApp"
                      ? OtherIcons.wp_svg
                      : item?.platforms == "Facebook"
                      ? OtherIcons.facebook_svg
                      : item?.platforms == "Instagram"
                      ? OtherIcons.instagram_svg
                      : item?.platforms == "Google"
                      ? OtherIcons.google_svg
                      : item?.platforms == "YouTube"
                      ? OtherIcons.youtube_svg
                      : "" || ""}
                  </td>
                  <td
                    className="py-2 sm:py-3 px-2 sm:px-4   text-[12px] sm:text-[15px]   "
                    onClick={() => handleTaskClick(item)}
                  >
                    {item?.campaign_type || ""}
                  </td>

                  <td
                    className="py-2 sm:py-3 px-2 sm:px-4   text-[12px] sm:text-[15px]  "
                    onClick={() => handleTaskClick(item)}
                  >
                    <TruncatedTooltipText
                      text={item?.team_names
                        ?.map((item) => item?.name)
                        ?.join(", ")}
                      maxLength={25}
                    />
                  </td>
                  <td className={` text-[12px] sm:text-[14px] `}>
                    {item?.status ? (
                      <DropdownStatus01
                        options={statusProject}
                        selectedValue={item?.status}
                        onSelect={(value) =>
                          handleStatusChange(value, item?.id)
                        }
                        label="Status"
                        className="w-[140px]"
                        setDataLoading={setDataLoading}
                      />
                    ) : (
                      "" // Placeholder for empty status
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Pagination */}
      <Pagenation
        itemList={totalCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setSearchCall={setSearchTrigger}
      />

      {DrawerComponent}
    </div>
  );
};

export default Campaigns;
