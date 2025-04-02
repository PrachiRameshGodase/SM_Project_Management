import React, { useState } from "react";
import { Dropdown001 } from "../common/Dropdown/Dropdown01";
import { campaignGoal, googleBranches, postPlatform, wpAdType } from "../common/Helper/Helper";
import { Dropdown002 } from "../common/Dropdown/Dropdown02";
import FileUpload from "../common/Attachments/FileUpload";

import CustomDatePicker from "../common/DatePicker/CustomDatePicker";

const GoogleCampaign = ({
  formData,
  setFormData,
  handleChange,
  handleDropdownChange,
  errors,
  userList,
}) => {
  return (
    <>
      <div className="sm:flex justify-between">
        <label className="block text-[20px]">Campaign Goal</label>
        <Dropdown001
          options={campaignGoal}
          selectedValue={formData?.campaign_goal}
          onSelect={(value) => handleDropdownChange("campaign_goal", value)}
          label="Select Campaign Goal"
        />
      </div>

      <div className="sm:flex justify-between">
        <label className="block text-[20px]">Ad Type</label>
        <Dropdown001
          options={wpAdType}
          selectedValue={formData?.ad_type}
          onSelect={(value) => handleDropdownChange("ad_type", value)}
          label="Ad Type"
        />
      </div>

      <div className="sm:flex justify-between">
        <label className="block text-[20px]">Start Date</label>
        <CustomDatePicker
          selectedDate={formData?.start_date}
          onChange={(date) => handleDropdownChange("start_date", date)}
        />
      </div>

      <div className="flex justify-between">
        <label className="block text-[20px]">End Date</label>
        <CustomDatePicker
          selectedDate={formData?.end_date}
          onChange={(date) => handleDropdownChange("end_date", date)}
        />
      </div>

      <div className="sm:flex justify-between">
        <label className="block text-[20px]">Team</label>
        <Dropdown002
          options={userList}
          selectedValue={formData?.team}
          onSelect={(value) => handleDropdownChange("team", value)}
          label="Select Team"
        />
      </div>

      <div className="sm:flex justify-between">
        <label className="block text-[20px]">Media Upload</label>
        <FileUpload
          onFilesChange={(files) => {
            setFormData((prev) => ({ ...prev, attachment: files }));
          }}
          initialFiles={formData.attachment}
        />
      </div>

      <div className="flex justify-between">
        <label className="block text-[20px]">Destination URL</label>
        <input
          className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400"
          type="text"
          placeholder="Enter Destination URL"
          value={formData?.destination_url}
          name="destination_url"
          onChange={handleChange}
        />
      </div>

     

      <div className="sm:flex justify-between">
        <label className="block text-[20px]">Branches</label>
        <Dropdown001
          options={googleBranches}
          selectedValue={formData?.branches}
          onSelect={(value) => handleDropdownChange("branches", value)}
          label="Select Branches"
        />
      </div>

      <div className="flex justify-between">
        <label className="block text-[20px]">Notes</label>
        <textarea
          className="w-[310px] sm:w-[350px] md:w-[400px] h-40 border border-gray-300 rounded-lg p-2 text-m ml-[35px] placeholder:text-gray-400"
          type="text"
          placeholder="Enter Notes"
          value={formData?.notes}
          name="notes"
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default GoogleCampaign;
