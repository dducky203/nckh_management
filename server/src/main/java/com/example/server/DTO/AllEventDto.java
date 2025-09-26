package com.example.server.DTO;

import com.example.server.domain.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AllEventDto {
    public Event event;
    public ExpertPresentation expertPresentation;
    public Conference conference;
    public ApprovedResearchTask approvedResearchTask;
    public ConferencePaper conferencePaper;
    public InternationalPaper internationalPaper;
    public MinistryTask ministryTask;
    public OverviewPaper overviewPaper;
    public ResearchAdvisoryCouncil researchAdvisoryCouncil;
    public ResearchProposal researchProposal;
    public Seminar seminar;
    public StudentResearchGuidance studentResearchGuidance;
    public VietnamesePaper  vietnamesePaper;
    public ActiveInCouncil activeInCouncil;
}
