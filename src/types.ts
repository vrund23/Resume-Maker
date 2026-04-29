/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Experience {
  id: string;
  jobTitle: string;
  employer: string;
  city: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  city: string;
  startDate: string;
  endDate: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string; // Stored as comma separated or newline for simplicity in input
  highlightedItems: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
    avatarUrl: string;
  };
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: SkillGroup[];
}
