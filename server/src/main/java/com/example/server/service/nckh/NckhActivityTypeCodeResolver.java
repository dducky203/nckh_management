package com.example.server.service.nckh;

import com.example.server.DTO.nckh.CreateActivityRequest;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class NckhActivityTypeCodeResolver {

    public String resolve(CreateActivityRequest req) {
        String explicitCatalogCode = norm(req.catalogCode);
        if (!explicitCatalogCode.isEmpty()) {
            return explicitCatalogCode;
        }

        String type = norm(req.activityType);
        return switch (type) {
            case "SEMINAR" -> "SEMINAR_PRESENT";
            case "CONFERENCE" -> resolveConference(req);
            case "INTL_PAPER" -> resolveIntlPaper(req);
            case "VN_PAPER" -> resolveVnPaper(req);
            case "PROCEEDING" -> resolveProceeding(req);
            case "REVIEW_PAPER" -> "REVIEW_PAPER";
            case "TECH_CONSULT" -> "TECH_CONSULT";
            case "TECH_PROCEDURE" -> "TECH_PROCEDURE";
            case "PROPOSAL" -> resolveProposal(req);
            default -> throw new IllegalStateException("activityType không hợp lệ: " + req.activityType);
        };
    }

    public Map<String, Object> declarationOptions() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("activityTypes", List.of(
                "SEMINAR",
                "CONFERENCE",
                "INTL_PAPER",
                "VN_PAPER",
                "PROCEEDING",
                "REVIEW_PAPER",
                "TECH_CONSULT",
                "TECH_PROCEDURE",
                "PROPOSAL"));
        result.put("conferenceRoles", List.of("ORG", "PRES"));
        result.put("conferenceLevels", List.of("INTL", "NAT", "ACAD"));
        result.put("intlPaperCategories", List.of("WOS", "SCOPUS", "ENG_ACAD", "OTHER", "CITATION"));
        result.put("vnPaperCategories", List.of("ACADEMY", "OTHER"));
        result.put("proceedingLevels", List.of("INTL", "NAT", "ACAD"));
        result.put("proposalLevels", List.of("NAT", "MINISTRY"));

        Map<String, String> generatedTypeCodes = new LinkedHashMap<>();
        generatedTypeCodes.put("SEMINAR", "SEMINAR_PRESENT");

        generatedTypeCodes.put("CONFERENCE.ORG.INTL", "CONF_ORG_INTL");
        generatedTypeCodes.put("CONFERENCE.ORG.NAT", "CONF_ORG_NAT");
        generatedTypeCodes.put("CONFERENCE.ORG.ACAD", "CONF_ORG_ACAD");
        generatedTypeCodes.put("CONFERENCE.PRES.INTL", "CONF_PRES_INTL");
        generatedTypeCodes.put("CONFERENCE.PRES.NAT", "CONF_PRES_NAT");
        generatedTypeCodes.put("CONFERENCE.PRES.ACAD", "CONF_PRES_ACAD");

        generatedTypeCodes.put("INTL_PAPER.WOS", "INTL_WOS");
        generatedTypeCodes.put("INTL_PAPER.SCOPUS", "INTL_SCOPUS");
        generatedTypeCodes.put("INTL_PAPER.ENG_ACAD", "INTL_ENG_ACAD");
        generatedTypeCodes.put("INTL_PAPER.OTHER", "INTL_OTHER");
        generatedTypeCodes.put("INTL_PAPER.CITATION", "INTL_CITATION");

        generatedTypeCodes.put("VN_PAPER.ACADEMY", "VN_ACADEMY");
        generatedTypeCodes.put("VN_PAPER.OTHER", "VN_OTHER");

        generatedTypeCodes.put("PROCEEDING.INTL", "PROC_INTL");
        generatedTypeCodes.put("PROCEEDING.NAT", "PROC_NAT");
        generatedTypeCodes.put("PROCEEDING.ACAD", "PROC_ACAD");

        generatedTypeCodes.put("REVIEW_PAPER", "REVIEW_PAPER");
        generatedTypeCodes.put("TECH_CONSULT", "TECH_CONSULT");
        generatedTypeCodes.put("TECH_PROCEDURE", "TECH_PROCEDURE");

        generatedTypeCodes.put("PROPOSAL.NAT", "PROPOSAL_NAT");
        generatedTypeCodes.put("PROPOSAL.MINISTRY", "PROPOSAL_MINISTRY");

        result.put("generatedTypeCodes", generatedTypeCodes);
        return result;
    }

    public List<String> resolveCatalogCodesByActivityType(String activityType) {
        String type = norm(activityType);
        if (type.isEmpty()) {
            return List.of();
        }

        return switch (type) {
            case "SEMINAR" -> List.of("SEMINAR_PRESENT");
            case "CONFERENCE" -> List.of(
                    "CONF_ORG_INTL", "CONF_ORG_NAT", "CONF_ORG_ACAD",
                    "CONF_PRES_INTL", "CONF_PRES_NAT", "CONF_PRES_ACAD");
            case "INTL_PAPER" -> List.of(
                    "INTL_WOS", "INTL_SCOPUS", "INTL_ENG_ACAD", "INTL_OTHER", "INTL_CITATION");
            case "VN_PAPER" -> List.of("VN_ACADEMY", "VN_OTHER");
            case "PROCEEDING" -> List.of("PROC_INTL", "PROC_NAT", "PROC_ACAD");
            case "REVIEW_PAPER" -> List.of("REVIEW_PAPER");
            case "TECH_CONSULT" -> List.of("TECH_CONSULT");
            case "TECH_PROCEDURE" -> List.of("TECH_PROCEDURE");
            case "PROPOSAL" -> List.of("PROPOSAL_NAT", "PROPOSAL_MINISTRY");
            default -> List.of();
        };
    }

    private String resolveConference(CreateActivityRequest req) {
        String role = norm(req.conferenceRole);
        String level = norm(req.conferenceLevel);
        if (role.isEmpty() || level.isEmpty()) {
            throw new IllegalStateException("Thiếu conferenceRole hoặc conferenceLevel");
        }
        return switch (role + "_" + level) {
            case "ORG_INTL" -> "CONF_ORG_INTL";
            case "ORG_NAT" -> "CONF_ORG_NAT";
            case "ORG_ACAD" -> "CONF_ORG_ACAD";
            case "PRES_INTL" -> "CONF_PRES_INTL";
            case "PRES_NAT" -> "CONF_PRES_NAT";
            case "PRES_ACAD" -> "CONF_PRES_ACAD";
            default -> throw new IllegalStateException("Tổ hợp hội thảo không hợp lệ: " + role + "/" + level);
        };
    }

    private String resolveIntlPaper(CreateActivityRequest req) {
        String category = norm(req.intlPaperCategory);
        return switch (category) {
            case "WOS" -> "INTL_WOS";
            case "SCOPUS" -> "INTL_SCOPUS";
            case "ENG_ACAD" -> "INTL_ENG_ACAD";
            case "OTHER" -> "INTL_OTHER";
            case "CITATION" -> "INTL_CITATION";
            default -> throw new IllegalStateException("intlPaperCategory không hợp lệ: " + req.intlPaperCategory);
        };
    }

    private String resolveVnPaper(CreateActivityRequest req) {
        String category = norm(req.vnPaperCategory);
        return switch (category) {
            case "ACADEMY" -> "VN_ACADEMY";
            case "OTHER" -> "VN_OTHER";
            default -> throw new IllegalStateException("vnPaperCategory không hợp lệ: " + req.vnPaperCategory);
        };
    }

    private String resolveProceeding(CreateActivityRequest req) {
        String level = norm(req.proceedingLevel);
        return switch (level) {
            case "INTL" -> "PROC_INTL";
            case "NAT" -> "PROC_NAT";
            case "ACAD" -> "PROC_ACAD";
            default -> throw new IllegalStateException("proceedingLevel không hợp lệ: " + req.proceedingLevel);
        };
    }

    private String resolveProposal(CreateActivityRequest req) {
        String level = norm(req.proposalLevel);
        return switch (level) {
            case "NAT" -> "PROPOSAL_NAT";
            case "MINISTRY" -> "PROPOSAL_MINISTRY";
            default -> throw new IllegalStateException("proposalLevel không hợp lệ: " + req.proposalLevel);
        };
    }

    private String norm(String value) {
        return value == null ? "" : value.trim().toUpperCase();
    }
}
