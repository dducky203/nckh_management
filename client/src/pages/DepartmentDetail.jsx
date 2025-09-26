import React from "react";
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { Computer, School } from "@mui/icons-material";

const DepartmentDetail = () => {
  // Sample data for the Software Engineering department
  const departmentInfo = {
    name: "Bộ môn Công nghệ phần mềm",
    description:
      "Bộ môn Công nghệ phần mềm là một trong những bộ môn chủ lực của Khoa Công nghệ thông tin, tập trung vào đào tạo và nghiên cứu về các quy trình, phương pháp, kỹ thuật phát triển phần mềm hiệu quả và chất lượng cao.",
    leader: "TS. Nguyễn Văn A",
    established: "2010",
    staff: [
      {
        id: 1,
        name: "TS. Nguyễn Văn A",
        position: "Trưởng bộ môn",
        email: "nguyenvana@vnua.edu.vn",
      },
      {
        id: 2,
        name: "PGS.TS. Trần Thị B",
        position: "Phó Trưởng bộ môn",
        email: "tranthib@vnua.edu.vn",
      },
      {
        id: 3,
        name: "TS. Lê Văn C",
        position: "Giảng viên",
        email: "levanc@vnua.edu.vn",
      },
      {
        id: 4,
        name: "ThS. Phạm Thị D",
        position: "Giảng viên",
        email: "phamthid@vnua.edu.vn",
      },
    ],
    subjects: [
      "Nhập môn Công nghệ phần mềm",
      "Phân tích và thiết kế phần mềm",
      "Kiểm thử phần mềm",
      "Quản lý dự án phần mềm",
      "Đảm bảo chất lượng phần mềm",
      "Công nghệ Web và ứng dụng",
      "Lập trình hướng đối tượng",
    ],
    researchAreas: [
      "Công nghệ phần mềm hướng dịch vụ",
      "Kỹ thuật kiểm thử và đảm bảo chất lượng phần mềm",
      "Công nghệ Web và ứng dụng",
      "Phát triển phần mềm cho nông nghiệp thông minh",
      "IoT và ứng dụng trong nông nghiệp",
    ],
  };

  return (
    <div>
      <Typography
        variant="h4"
        component="h1"
        sx={{ color: "mainColor", mb: 2, fontWeight: "bold" }}
      >
        {departmentInfo.name}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="body1" paragraph>
        {departmentInfo.description}
      </Typography>

      <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "mainColor" }}>
        <School sx={{ mr: 1, verticalAlign: "middle" }} />
        Thông tin chung
      </Typography>

      <Box sx={{ bgcolor: "#f5f9fc", p: 2, borderRadius: 1, mb: 4 }}>
        <Typography variant="body1">
          <strong>Trưởng bộ môn:</strong> {departmentInfo.leader}
        </Typography>
        <Typography variant="body1">
          <strong>Năm thành lập:</strong> {departmentInfo.established}
        </Typography>
        <Typography variant="body1">
          <strong>Số lượng giảng viên:</strong> {departmentInfo.staff.length}{" "}
          người
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "mainColor" }}>
        <People sx={{ mr: 1, verticalAlign: "middle" }} />
        Đội ngũ giảng viên
      </Typography>

      <List>
        {departmentInfo.staff.map((person) => (
          <ListItem key={person.id} divider>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "mainColor" }}>
                {person.name.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={person.name}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {person.position}
                  </Typography>
                  {" — " + person.email}
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "mainColor" }}>
        <Computer sx={{ mr: 1, verticalAlign: "middle" }} />
        Các học phần phụ trách
      </Typography>

      <Box sx={{ bgcolor: "#f5f9fc", p: 2, borderRadius: 1, mb: 4 }}>
        <ul>
          {departmentInfo.subjects.map((subject, index) => (
            <li key={index}>
              <Typography variant="body1">{subject}</Typography>
            </li>
          ))}
        </ul>
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "mainColor" }}>
        <Insights sx={{ mr: 1, verticalAlign: "middle" }} />
        Hướng nghiên cứu
      </Typography>

      <Box sx={{ bgcolor: "#f5f9fc", p: 2, borderRadius: 1 }}>
        <ul>
          {departmentInfo.researchAreas.map((area, index) => (
            <li key={index}>
              <Typography variant="body1">{area}</Typography>
            </li>
          ))}
        </ul>
      </Box>
    </div>
  );
};

export default DepartmentDetail;
