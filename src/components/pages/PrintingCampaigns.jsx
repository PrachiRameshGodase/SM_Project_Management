import FileUpload from "../common/Attachments/FileUpload";
import { Dropdown001 } from "../common/Dropdown/Dropdown01";
import { Dropdown002 } from "../common/Dropdown/Dropdown02";
import { campaignGoal, distributionArea, distributionMethod, targetAuidence } from "../common/Helper/Helper";

import CustomDatePicker from "../common/DatePicker/CustomDatePicker";

const PrintingCampaign = ({
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
        <label className="block text-[20px]">Distribution Area</label>
        <Dropdown001
          options={distributionArea}
          selectedValue={formData?.distribution_area}
          onSelect={(value) => handleDropdownChange("distribution_area", value)}
          label="Select Distribution Area"
        />
      </div>

      <div className="sm:flex justify-between">
        <label className="block text-[20px]">Distribution Method</label>
        <Dropdown001
          options={distributionMethod}
          selectedValue={formData?.distribution_method}
          onSelect={(value) => handleDropdownChange("distribution_method", value)}
          label="Select Distribution Method"
        />
      </div>

      <div className="flex justify-between">
        <label className="block text-[20px]">Total Quantity Printed</label>
        <input
          className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400"
          type="number"
          placeholder="Enter Total Quantity Printed "
          value={formData?.total_quantity_distributed}
          name="total_quantity_distributed"
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-between">
        <label className="block text-[20px]">Total Quantity Distributed</label>
        <input
          className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400"
          type="number"
          placeholder="Enter Total Quantity Distributed "
          value={formData?.total_quantity_distributed}
          name="total_quantity_distributed"
          onChange={handleChange}
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
            setFormData((prev) => ({ ...prev, media_upload: files }));
          }}
          initialFiles={formData.attachment}
        />
      </div>
      
      <div className="sm:flex justify-between">
        <label className="block text-[20px]">Target Audience</label>
        <Dropdown001
          options={targetAuidence}
          selectedValue={formData?.target_audience}
          onSelect={(value) => handleDropdownChange("target_audience", value)}
          label="Select Target Audience"
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

     
      <div className="flex justify-between">
        <label className="block text-[20px]">Budget</label>
        <input
          className="w-[310px] sm:w-[350px] md:w-[400px] h-10 border border-gray-400 rounded-lg p-2 text-m ml-[78px] placeholder:text-gray-400"
          type="number"
          placeholder="Enter Budget"
          value={formData?.budget}
          name="budget"
          onChange={handleChange}
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

export default PrintingCampaign;
