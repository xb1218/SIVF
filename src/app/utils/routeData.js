export default [
  {
    title: "患者列表",
    nav: true,
    activeIcon: "iconPatientlistblue",
    icon: "iconPatientlistgray",
    href: "/public/patients",
    sub: [
      {
        title: "工作台",
        href: "/public/patients/workbench",
      },
      {
        title: "更多患者",
        href: "/public/patients/more",
      },
    ],
  },
  {
    title: "预约管理",
    nav: false,
    activeIcon: "iconAppointmentmanagementblue",
    icon: "iconAppointmentmanagementgrey",
    href: "/public/reservation",
  },
  {
    title: "日程表",
    nav: true,
    activeIcon: "iconCalendarblue",
    icon: "iconCalendargray",
    href: "/public/schedule",
    sub: [
      {
        title: "取卵日程表",
        href: "/public/schedule/opu",
      },
      {
        title: "移植日程表",
        href: "/public/schedule/et",
      },
      {
        title: "IUI日程表",
        href: "/public/schedule/iui",
      },
    ],
  },
  {
    title: "随访记录",
    nav: false,
    activeIcon: "iconsuifangjilulanse",
    icon: "iconFollowuprecordsgrey",
    href: "/public/follow/followList",
  },
  {
    title: "数据视图",
    nav: true,
    activeIcon: "iconDataviewblue",
    icon: "iconDataviewgray",
    href: "/public/dashboard",
    sub: [
      {
        title: "总览",
        href: "/public/dashboard/overview",
      },
      {
        title: "数据管理",
        href: "/public/dashboard/manage",
      },
      {
        title: "数据回顾",
        href: "/public/dashboard/review",
      },
    ],
  },
  {
    title: "冷冻续费",
    nav: false,
    activeIcon: "iconFrozenrenewalmanagementblue",
    icon: "iconFrozenrenewalmanagementgray",
    href: "/public/renewal/frozen",
  },
  {
    title: "管理",
    nav: true,
    activeIcon: "iconchaojiguanliyuanxuanzhongbeifen",
    icon: "iconchaojiguanliyuan",
    href: "/public/admin",
    sub: [
      {
        title: "账号管理",
        href: "/public/admin/usermanage",
      },
      {
        title: "业务数据",
        href: "/public/admin/bizdata",
      },
      {
        title: "用药套餐",
        href: "/public/admin/advice",
      },
      {
        title: "检查套餐",
        href: "/public/admin/inspect",
      },
    ],
    subNomal: [
      {
        title: "用药套餐",
        href: "/public/admin/advice",
      },
      {
        title: "检查套餐",
        href: "/public/admin/inspect",
      },
    ],
  },
]
