//Dependencies
import React, { FC, ChangeEvent } from "react";
// import { motion } from 'framer-motion';

//Styling
import '../../../../styles/create_pages_styling/create_page/child_components/createTopSection.scss';

//Attending Interface
interface attendingInterface {
  name: string;
  available: Array<[number, number, number]>;
}

interface CTSProps {
  newForm: {
    title: string;
    location: string;
    description: string;
    early: number;
    late: number;
    days: number[];
    attending: Array<attendingInterface>;
  };
  handleChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CreateTopSection: FC<CTSProps> = ({newForm, handleChange}) => {

  /* ------------------------------------------ Component Variables & State ------------------------------------------ */

  /* ------------------------------------------ Animation Details (Framer-Motion) ------------------------------------------ */

  /* ------------------------------------------ Helper Functions ------------------------------------------ */

  /* ------------------------------------------ Event Handler Functions ------------------------------------------ */

  /* ------------------------------------------ Conditional JSX ------------------------------------------ */

  /* ------------------------------------------ Returning JSX ------------------------------------------ */

  return (
    <div id="create-top-section">
      <div id="create-top-left-subsection">
        <label htmlFor="title" id="create-title-wrapper" className="create-top-left-wrapper">
          <input required id="create-title" className="create-top-left-field" type="text" name="title" value={newForm.title} onChange={handleChange} />
          <span className="placeholder no-select">Title</span>
        </label>
        <label htmlFor="location" id="create-location-wrapper" className="create-top-left-wrapper">
          <input required id="create-location" className="create-top-left-field" type="text" name="location" value={newForm.location} onChange={handleChange} />
          <span className="placeholder no-select">Location</span>
        </label>
      </div>
      <label htmlFor="description" id="create-description-wrapper" className="create-top-right-wrapper">
        <textarea wrap="soft" required id="create-description" name="description" value={newForm.description} onChange={handleChange} />
        <span className="placeholder no-select">{newForm.description !== "" ? "Description" : "Enter a description for your event..."}</span>
      </label>
    </div>
  )
}

export default CreateTopSection;