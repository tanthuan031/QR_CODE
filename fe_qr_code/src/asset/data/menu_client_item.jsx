import React from 'react';
import {
  FaBullhorn,
  FaComments,
  FaFirstOrderAlt,
  FaHome,
  FaTasks,
  FaThLarge,
  FaUsers,
  FaUsersCog,
  FaUserTie,
  FaImages,
  FaFileExport,
  FaFileImport,
} from 'react-icons/fa';

export const menu_client_item = [
  {
    id: 1,
    name: 'Quản lý lớp học',
    active: true,
    link: '/',
    icon: <FaHome />,
    role: 1,
  },
  {
    id: 2,
    name: 'Lịch sử nghỉ phép',
    active: false,
    link: '/history',
    icon: <FaThLarge />,
    role: 2,
  },
];
