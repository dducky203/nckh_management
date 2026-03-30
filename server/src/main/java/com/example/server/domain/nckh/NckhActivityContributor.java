package com.example.server.domain.nckh;

import com.example.server.domain.EntityBase;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "nckh_activity_contributor", uniqueConstraints = @UniqueConstraint(name = "uq_act_user", columnNames = {
        "activity_id", "user_id" }))
public class NckhActivityContributor extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "activity_id", nullable = false)
    private Long activityId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "contrib_role", nullable = false)
    private Role role;

    @Column(name = "participants_n", nullable = false)
    private Integer participantsN = 1;

    @Column(name = "hours_share", nullable = false)
    private Double hoursShare = 0.0;

    @Column(name = "equiv_qty", nullable = false)
    private Double equivQty = 0.0;

    @Column(name = "note")
    private String note;

    @Transient
    private String userName;

    public enum Role {
        MAIN, MEMBER
    }

}
