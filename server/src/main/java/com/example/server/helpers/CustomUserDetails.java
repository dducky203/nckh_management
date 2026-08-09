package com.example.server.helpers;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.server.domain.User;
import com.example.server.utils.SecurityRoles;
import com.example.server.utils.SecurityUtils;

/**
 * Principal JWT — gắn authority nghiệp vụ để dùng trong SecurityConfig / hasAuthority.
 */
public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new LinkedHashSet<>();

        if (user.getIdRole() != null && user.getIdRole().getName() != null) {
            String roleName = user.getIdRole().getName().trim();
            if (!roleName.isEmpty()) {
                authorities.add(new SimpleGrantedAuthority(roleName));
                authorities.add(new SimpleGrantedAuthority("ROLE_" + roleName.toUpperCase()));
            }
        } else {
            authorities.add(new SimpleGrantedAuthority(SecurityRoles.ROLE_USER));
        }

        if (SecurityUtils.isAdmin(user)) {
            authorities.add(new SimpleGrantedAuthority(SecurityRoles.ROLE_ADMIN));
        }
        if (SecurityUtils.isAssistant(user)) {
            authorities.add(new SimpleGrantedAuthority(SecurityRoles.ROLE_ASSISTANT));
        }
        if (SecurityUtils.hasNckhStaffAccess(user)) {
            authorities.add(new SimpleGrantedAuthority(SecurityRoles.NCKH_STAFF));
            authorities.add(new SimpleGrantedAuthority(SecurityRoles.ROLE_NCKH_STAFF));
        }
        if (SecurityUtils.isStrictAdminPortalUser(user)) {
            authorities.add(new SimpleGrantedAuthority(SecurityRoles.STRICT_ADMIN));
            authorities.add(new SimpleGrantedAuthority(SecurityRoles.ROLE_STRICT_ADMIN));
        }
        if (SecurityUtils.isStudent(user)) {
            authorities.add(new SimpleGrantedAuthority(SecurityRoles.ROLE_STUDENT));
        }

        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return user.getInActive() == null || !Boolean.TRUE.equals(user.getInActive());
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getIsDeleted() == null || !Boolean.TRUE.equals(user.getIsDeleted());
    }

    public Integer getId() {
        return user.getId();
    }

    public User getUser() {
        return user;
    }
}
