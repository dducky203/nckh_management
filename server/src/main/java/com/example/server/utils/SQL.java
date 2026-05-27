package com.example.server.utils;

public class SQL {
    // find conference by idEvent
    public static final String FIND_CONF_BY_IDEVENT="select * from conference where id_event=?";
    // find user by id
    public static final String FIND_USER_BY_ID="select * from user where id=?";
    // guest by event id
    public static final String GUEST_BY_EVENT_ID="select * from guest where event_id =?";
}
