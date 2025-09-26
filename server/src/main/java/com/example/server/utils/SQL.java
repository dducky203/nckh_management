package com.example.server.utils;

public class SQL {
    // get user by username and password
    public static final String GET_USER="select * from user where username=? and password=?";
    // get admin by username and password
    public static final String GET_ADMIN="select * from admin where username=? and password=?";
    // get criteria distinct in operating standard
    //public static final String GET_CRITERIA_IN_OS="select distinct criteria, id_type_of_criteria, unit,id from operating_standards";
    //find by idUSer for resume
    public static final String FIND_BY_IDUSER="select *from resume where id_user =?";
    // show event , order by create date 'desc'
    public static final String SHOW_ALL_EVENT="select * from event order by created_at desc";
    // show event , order by create date 'desc'
    public static final String SHOW_ALL_EVENT_STATUS_2="select * from event where status=2 order by created_at desc";
    // find by idEvent
    public static final String FIND_BY_ID_EVENT="select * from event where id=?";
    // filter by idOperatingStandard
    public static final String FILTER_BY_NAME="select * from event where id_operating_standard_2=?";
    // find conference by idEvent
    public static final String FIND_CONF_BY_IDEVENT="select * from conference where id_event=?";
    // find user by id
    public static final String FIND_USER_BY_ID="select * from user where id=?";
    // show event to user
    public static final String SHOW_EVENT_TO_USER="select * from event where creator=? order by created_at desc";
    // guest by event id
    public static final String GUEST_BY_EVENT_ID="select * from guest where event_id =?";
    // count guest
    public static final String COUNT_GUEST="select count(id) countGuest from guest where event_id=?";
    // member by event id
    public static final String MEMBER_BY_EVENT_ID="select * from member where event_id =?";
    // count member
    public static final String COUNT_MEMBER="select count(id) countMember from member where event_id=?";
    public static final String COUNT_EVENT_PER_MONTH="SELECT MONTH(e.date_of_event) AS month, COUNT(e.id) AS count\n" +
            "            FROM event e\n" +
            "            WHERE YEAR(e.date_of_event) = ? and date_of_event<current_date\n" +
            "            GROUP BY MONTH(e.date_of_event)\n" +
            "            ORDER BY month";
    public static final String SHOW_EV_BY_MONTH="SELECT * FROM event e\n" +
            "WHERE MONTH(e.date_of_event )=? and YEAR(e.date_of_event) = ?";
    // find all OS by criteria
    public static final String FIND_OS_BY_ID_CRITERIA="select * from operating_standards where id_type_of_criteria=?";
    // filter event by idCriteria
    public static final String FILTER_EV_BY_CRITERIA="select event.* from event\n" +
            "                inner JOIN nckh.operating_standards_2 os on event.id_operating_standard_2 = os.id\n" +
            "                inner join nckh.type_of_criteria toc on os.id_type_of_criteria = toc.id\n" +
            "            where toc.id=?";
    // type of criteria by id of OS
    public static final String FIND_TYPE_O_C_BY_OS="select type_of_criteria.* from type_of_criteria\n" +
            "    inner join nckh.operating_standards_2 os on type_of_criteria.id = os.id_type_of_criteria\n" +
            "where os.id=?";
    // get top 5 upcoming events
    public static final String GET_TOP5_EV="select event.* from event  \n" +
            "           inner join nckh.operating_standards_2 os on event.id_operating_standard_2 = os.id\n" +
            "           inner join nckh.type_of_criteria toc on os.id_type_of_criteria = toc.id\n" +
            "        where event.status=2 and toc.is_event = 1 and date_of_event > CURRENT_DATE\n" +
            "            order by date_of_event  desc\n" +
            "        limit 5";

    // get upcoming events
    public static final String GET_UPCOMING_E="SELECT event.*,\n" +
            "       DATEDIFF(event.date_of_event, CURRENT_DATE) AS days_until_event\n" +
            "FROM event\n" +
            "         INNER JOIN nckh.operating_standards_2 os ON event.id_operating_standard_2 = os.id\n" +
            "         INNER JOIN nckh.type_of_criteria toc ON os.id_type_of_criteria = toc.id\n" +
            "WHERE toc.is_event = 1\n" +
            "  AND event.date_of_event \n" +
            "ORDER BY event.date_of_event ASC;";
    // get all user in NCM (distint)
    public static final String GET_ALL_USER_IN_NCM= "SELECT *\n" +
            "FROM (\n" +
            "         SELECT *, ROW_NUMBER() OVER (PARTITION BY id_user ORDER BY id) AS rn\n" +
            "         FROM ncm\n" +
            "         where year =? and id_group=?\n" +
            "     ) AS sub\n" +
            "WHERE rn = 1";
    // get detail user in ncm
    public static final String DETAIL_USER_IN_NCM="SELECT ncm.id, ncm.id_user, ncm.role_of_team, ncm.norm,\n" +
            "        ncm.id_operating_standard, ncm.role_of_activity, ncm.id_group,\n" +
            "        o.name, o.catalog,ncm.year,ncm.status\n" +
            "        FROM ncm\n" +
            "        INNER JOIN nckh.operating_standards_2 o ON ncm.id_operating_standard = o.id\n" +
            "        WHERE id_user = ?";
    // distint user in ncm
    public static final String DISTINT_USER_IN_NCM_BY_ID_USER="SELECT *\n" +
            "FROM (\n" +
            "         SELECT *, ROW_NUMBER() OVER (PARTITION BY id_user ORDER BY id) AS rn\n" +
            "         FROM ncm where id_user=?\n" +
            "     ) AS sub\n" +
            "WHERE rn = 1";

    // get event by id_operating_standard_2 and year
    public static final String GET_EVENT_BY_OS2_AND_YEAR="select * from event where id_operating_standard_2=? and YEAR(date_of_event)=?";

    // get all event in ncm (distint)
    public static final String GET_ALL_EVENT_IN_NCM="SELECT DISTINCT CONCAT(o.catalog, ' - ', o.name) AS activity_name\n" +
            "FROM ncm u\n" +
            "         INNER JOIN nckh.operating_standards_2 o ON u.id_operating_standard = o.id\n" +
            "WHERE u.id_group = :groupId";

}
