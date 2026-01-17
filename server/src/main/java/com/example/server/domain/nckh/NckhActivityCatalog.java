package com.example.server.domain.nckh;

import jakarta.persistence.*;

@Entity
@Table(name = "nckh_activity_catalog")
public class NckhActivityCatalog {

    @Id
    @Column(name = "catalog_code", length = 50)
    private String catalogCode;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "unit", nullable = false, length = 50)
    private String unit;

    @Column(name = "quota_hours", nullable = false)
    private Double quotaHours; // S

    @Column(name = "is_shareable", nullable = false)
    private Boolean isShareable = true;

    @Column(name = "metric_key", nullable = false, length = 50)
    private String metricKey;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // getters/setters
    public String getCatalogCode() {
        return catalogCode;
    }

    public void setCatalogCode(String catalogCode) {
        this.catalogCode = catalogCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getQuotaHours() {
        return quotaHours;
    }

    public void setQuotaHours(Double quotaHours) {
        this.quotaHours = quotaHours;
    }

    public Boolean getIsShareable() {
        return isShareable;
    }

    public void setIsShareable(Boolean shareable) {
        isShareable = shareable;
    }

    public String getMetricKey() {
        return metricKey;
    }

    public void setMetricKey(String metricKey) {
        this.metricKey = metricKey;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }
}
