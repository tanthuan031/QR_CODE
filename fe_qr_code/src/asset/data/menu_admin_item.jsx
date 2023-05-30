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

export const menu_admin_item = [
  {
    id: 1,
    name: 'Tổng quan',
    active: true,
    link: '/admin/',
    icon: <FaHome />,
    role: 1,
  },
  {
    id: 2,
    name: 'Quản lý lớp học',
    active: false,
    link: '/admin/classroom',
    icon: <FaThLarge />,
    role: 2,
  },
  {
    id: 3,
    name: 'Quản lý nghỉ phép ',
    active: false,
    link: '/admin/ask-for-permission',
    icon: <FaThLarge />,
    role: 2,
  },
];
