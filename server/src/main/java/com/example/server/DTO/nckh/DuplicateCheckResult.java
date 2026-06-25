package com.example.server.DTO.nckh;

public class DuplicateCheckResult {
    public boolean duplicate;
    public Long existingActivityId;
    public String message;

    public static DuplicateCheckResult ok() {
        DuplicateCheckResult r = new DuplicateCheckResult();
        r.duplicate = false;
        return r;
    }

    public static DuplicateCheckResult found(Long activityId, String message) {
        DuplicateCheckResult r = new DuplicateCheckResult();
        r.duplicate = true;
        r.existingActivityId = activityId;
        r.message = message;
        return r;
    }
}
