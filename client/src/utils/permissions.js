export const isAdmin = (user) => {
  if (!user) return false;

  if (user.role === "admin") return true;

  const adminTitles = ["Thư ký", "Trưởng khoa", "Phó khoa"];
  if (user.title && adminTitles.includes(user.title)) {
    return true;
  }

  return false;
};

export const isLeadership = (user) => {
  if (!user) return false;
  const leadershipTitles = ["Trưởng khoa", "Phó khoa"];
  return user.title && leadershipTitles.includes(user.title);
};

export const isGroupLeader = (user, group) => {
  if (!user || !group) return false;
  return group.leaderId === user.id;
};

export const canEditGroup = (user, group) => {
  return isAdmin(user) || isGroupLeader(user, group);
};

export const canViewAllGroups = (user) => {
  return isAdmin(user);
};
