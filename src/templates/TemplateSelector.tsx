import React from "react";
import { CVData } from "../types/cv";
import PrimaryTemplate from "./PrimaryTemplate";
import ClassicTemplate from "./ClassicTemplate";
import MinimalTemplate from "./MinimalTemplate";
import ATSTemplate from "./ATSTemplate";
import CreativeTemplate from "./CreativeTemplate";
import PremiumTemplate from "./PremiumTemplate";
import SoftPanelTemplate from "./SoftPanelTemplate";
import DiagonalTimelineTemplate from "./DiagonalTimelineTemplate";
import ExecutiveBandTemplate from "./ExecutiveBandTemplate";

interface TemplateSelectorProps {
  data: CVData;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ data }) => {
  switch (data.template) {
    case "primary":
      return <PrimaryTemplate data={data} />;
    case "classic":
      return <ClassicTemplate data={data} />;
    case "minimal":
      return <MinimalTemplate data={data} />;
    case "ats":
      return <ATSTemplate data={data} />;
    case "creative":
      return <CreativeTemplate data={data} />;
    case "premium":
      return <PremiumTemplate data={data} />;
    case "soft-panel":
      return <SoftPanelTemplate data={data} />;
    case "diagonal-timeline":
      return <DiagonalTimelineTemplate data={data} />;
    case "executive-band":
      return <ExecutiveBandTemplate data={data} />;
    default:
      return <PrimaryTemplate data={data} />;
  }
};

export default TemplateSelector;
